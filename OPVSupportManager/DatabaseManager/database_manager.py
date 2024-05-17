# Данный файл содерижит код для заполнения базы данных ифнормацией о файлах,
# полученных от системы Ovation Prime.

import sqlite3
import os
import time
import sys

from datatype import DataType

current = os.path.dirname(os.path.realpath(__file__))
parent = os.path.dirname(current)
sys.path.append(parent)

from paths import (OVATION_PRIME_DATA_ROOT,
                   DATABASE_PATH)

# ----------------------------------------------------------------------------

# Адрес корневой папки с данными, полученными от системы Ovation Prime.
# OVATION_PRIME_DATA_ROOT = r'C:\OvationPrimeData'
# DATABASE_PATH = os.path.join('..', '..', 'OPVOnline', 'db.sqlite3')

THIS_FILENAME = "database_manager.py"

# ----------------------------------------------------------------------------

# Список директорий, которые надо игнорировать при обходе подпапок
# корневой папки с данными, полученными от системы Ovation Prime.
# Если в ROOT абсолютный путь, то тут тоже абсолютные пути.
# Если же в ROOT относительный путь, то тут тоже относительные пути.
directories_to_be_ignored = []

# Флажок, который поднят, если нужно повторять сеансы обхода подпапок
# корневой папки с данными, полученными от системы Ovation Prime.
REPEAT_FLAG = False

# Время ожидания между запуском сеансов обхода подпапок
# корневой папки с данными, полученными от системы Ovation Prime.
SLEEP_TIME_IN_SECONDS = 3600

# Соединение с базой данных.
conn = sqlite3.connect(DATABASE_PATH)

# Курсор для соединения с базой банных.
cur = conn.cursor()

# Список с названиями таблиц в базе данных.
database_tables_names = [
    'opv_main_northforecastdiffuserecord',
    'opv_main_northforecastionsrecord',
    'opv_main_northforecastmonorecord',
    'opv_main_northforecasttotalrecord',
    'opv_main_northforecastwaverecord',
    'opv_main_northnowcastdiffuserecord',
    'opv_main_northnowcastionsrecord',
    'opv_main_northnowcastmonorecord',
    'opv_main_northnowcasttotalrecord',
    'opv_main_northnowcastwaverecord',
    'opv_main_southforecastdiffuserecord',
    'opv_main_southforecastionsrecord',
    'opv_main_southforecastmonorecord',
    'opv_main_southforecasttotalrecord',
    'opv_main_southforecastwaverecord',
    'opv_main_southnowcastdiffuserecord',
    'opv_main_southnowcastionsrecord',
    'opv_main_southnowcastmonorecord',
    'opv_main_southnowcasttotalrecord',
    'opv_main_southnowcastwaverecord',
]

empty_databases_marks = None
databases_last_record_datetime = None
txt_files_number = 0


def do_files_traversal(directory):
    """
    Обходим подпапки указанной директории, чтобы находить
    .txt файлы с данными, полученными от системы Ovation Prime,
    и записывать информацию о них в базу данных.
    :param directory: адрес упомянутой директории.
    :return: None
    """
    if directory in directories_to_be_ignored:
        return

    global txt_files_number

    for filename in sorted(os.listdir(directory)):
        path = os.path.join(directory, filename)

        if os.path.isdir(path):
            do_files_traversal(path)
        elif filename.endswith('.txt'):
            make_record_in_database(path, filename)
            txt_files_number += 1

            if txt_files_number % 100 == 0:
                print(f"Message from {THIS_FILENAME}. Files count during traversal: {txt_files_number}")


def make_record_in_database(path: str, filename: str):
    """
    Вносим информацию о файле, полученном от системы Ovation Prime,
    в базу данных. Если соответствующая таблица непуста и дата и время ее самой поздней записи
    больше или равна дате и времени текущего файла, то запись в базу данных сделана не будет.
    :param path: путь к файлу, полученному от системы Ovation Prime.
    :param filename: имя файла, полученноого от системы Ovation Prime.
    :return: None
    """
    file_type_index = get_file_type_index(filename)

    if file_type_index == -1:
        return

    datetime = get_file_datetime(filename)

    if (not empty_databases_marks[file_type_index]) and (databases_last_record_datetime[file_type_index] >= datetime):
        return

    if file_is_short(path):
        return

    cur.execute(f"INSERT INTO {database_tables_names[file_type_index]}(datetime, path)" +
                f"VALUES('{datetime}', '{path}');")
    conn.commit()


def file_is_short(path: str) -> bool:
    f = open(path)
    number_of_lines = 0

    for line in f:
        number_of_lines += 1

    f.close()

    return number_of_lines < 7685


def get_file_type_index(filename: str) -> int:
    """
    Получаем индекс типа файла, полученного от системы Ovation Prime.
    :param filename: имя файла, полученного от системы Ovation Prime.
    :return: Индекс файла, полученного от системы Ovation Prime.
    Если имя упомянутого файла некорректно, то будет возвращено значение -1.
    """
    if filename.find('north') != -1:
        if filename.find('forecast') != -1:
            if filename.find('diffuse') != -1:
                return DataType.NORTH_FORECAST_DIFFUSE
            elif filename.find('ions') != -1:
                return DataType.NORTH_FORECAST_IONS
            elif filename.find('mono') != -1:
                return DataType.NORTH_FORECAST_MONO
            elif filename.find('wave') != -1:
                return DataType.NORTH_FORECAST_WAVE
            else:
                return DataType.NORTH_FORECAST_TOTAL
        elif filename.find('nowcast') != -1:
            if filename.find('diffuse') != -1:
                return DataType.NORTH_NOWCAST_DIFFUSE
            elif filename.find('ions') != -1:
                return DataType.NORTH_NOWCAST_IONS
            elif filename.find('mono') != -1:
                return DataType.NORTH_NOWCAST_MONO
            elif filename.find('wave') != -1:
                return DataType.NORTH_NOWCAST_WAVE
            else:
                return DataType.NORTH_NOWCAST_TOTAL
    elif filename.find('south') != 1:
        if filename.find('forecast') != -1:
            if filename.find('diffuse') != -1:
                return DataType.SOUTH_FORECAST_DIFFUSE
            elif filename.find('ions') != -1:
                return DataType.SOUTH_FORECAST_IONS
            elif filename.find('mono') != -1:
                return DataType.SOUTH_FORECAST_MONO
            elif filename.find('wave') != -1:
                return DataType.SOUTH_FORECAST_WAVE
            else:
                return DataType.SOUTH_FORECAST_TOTAL
        elif filename.find('nowcast') != -1:
            if filename.find('diffuse') != -1:
                return DataType.SOUTH_NOWCAST_DIFFUSE
            elif filename.find('ions') != -1:
                return DataType.SOUTH_NOWCAST_IONS
            elif filename.find('mono') != -1:
                return DataType.SOUTH_NOWCAST_MONO
            elif filename.find('wave') != -1:
                return DataType.SOUTH_NOWCAST_WAVE
            else:
                return DataType.SOUTH_NOWCAST_TOTAL
    return -1


def get_file_datetime(filename: str) -> str:
    """
    Получаем дату и время файла, полученного от системы Ovation Prime.
    :param filename: имя файла, полученного от системы Ovation Prime.
    :return: строковое представление упомянутых даты и времени.
    """
    year = filename[0:4]
    month = filename[4:6]
    day = filename[6:8]
    hour = filename[9:11]
    minute = filename[11:13]
    second = '00'
    return f"{year}-{month}-{day} {hour}:{minute}:{second}"


def do_database_manager_iteration():
    global empty_databases_marks
    global databases_last_record_datetime
    global txt_files_number

    empty_databases_marks = []

    for i in range(20):
        cur.execute(f"SELECT count(*) FROM {database_tables_names[i]};")
        empty_databases_marks.append(cur.fetchone()[0] == 0)

    databases_last_record_datetime = []

    for i in range(20):
        databases_last_record_datetime.append(None)
        if not empty_databases_marks[i]:
            cur.execute(f"SELECT datetime FROM {database_tables_names[i]} ORDER BY datetime DESC LIMIT 1;")
            databases_last_record_datetime[-1] = cur.fetchone()[0]

    txt_files_number = 0
    do_files_traversal(OVATION_PRIME_DATA_ROOT)


# do_database_manager_iteration()
