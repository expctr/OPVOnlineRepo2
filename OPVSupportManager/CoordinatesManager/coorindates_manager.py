# В данном файле содержится функционал для преобразования файлов с данными Ovation Prime с целью
# перехода от геомагнитной к географичекой системе координат. Это нужно для обеспечения работы
# страницы 3D визуализации.

import datetime as dt
import aacgmv2
import numpy as np
import os
from datatype import DataType
import sys

current = os.path.dirname(os.path.realpath(__file__))
parent = os.path.dirname(current)
sys.path.append(parent)

from paths import OVATION_PRIME_DATA_ROOT, SECOND_OVATION_PRIME_DATA_ROOT

# ----------------------------------------------------------------------
# SOURCE_ROOT = r"C:\OvationPrimeData"
# DESTINATION_ROOT = r"D:\OvationPrimeData2"

THIS_FILENAME = "coorindates_manager.py"
# ----------------------------------------------------------------------

AURORAE_HEIGHT_KM = 95

files_last_record_datetime_marks = [None] * 20


def get_file_type_index(filename: str) -> int | None:
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


def get_datetime_from_str(datetime_str) -> dt.datetime:
    """
    Получаем дату и время по их строковому представлению.
    :param datetime_str: строковое представление даты и времени.
    :return: упомянутые дата и время.
    """
    return dt.datetime(
        int(datetime_str[0:4]),
        int(datetime_str[5:7]),
        int(datetime_str[8:10]),
        int(datetime_str[11:13]),
        int(datetime_str[14:16])
    )


def find_last_datetime_marks_from_destination(directory: str):
    global files_last_record_datetime_marks

    for filename in sorted(os.listdir(directory)):
        path = os.path.join(directory, filename)

        if os.path.isdir(path):
            find_last_datetime_marks_from_destination(path)
        elif filename.endswith('.txt'):
            file_type_index = get_file_type_index(filename)

            if file_type_index:
                files_last_record_datetime_marks[file_type_index] = get_datetime_from_str(get_file_datetime(filename))


def start_search_of_last_datetime_marks_from_destination():
    global files_last_record_datetime_marks
    files_last_record_datetime_marks = [None] * 20

    find_last_datetime_marks_from_destination(SECOND_OVATION_PRIME_DATA_ROOT)


def get_coordinates_dict(path: str, _datetime: dt.datetime, south_flag):
    f = open(path)
    d = {}

    for index_and_line in enumerate(f):
        if 5 <= index_and_line[0] <= 7684:
            line = index_and_line[1]
            split_line = line.split(' ')

            while '' in split_line:
                split_line.remove('')

            mlt = float(split_line[0])
            magnetic_lat = float(split_line[1])
            value = float(split_line[2])

            magnetic_lon \
                = aacgmv2.wrapper.convert_mlt([mlt], _datetime, m2a=True)[0]

            geographical_lat, geographical_lon, geographical_alt \
                = aacgmv2.wrapper.convert_latlon(magnetic_lat,
                                                 magnetic_lon,
                                                 AURORAE_HEIGHT_KM,
                                                 _datetime,
                                                 method_code='A2G'
                                                 )

            if south_flag:
                geographical_lat *= -1

            d[(mlt, magnetic_lat)] \
                = (geographical_lat, geographical_lon, geographical_alt, value)

    f.close()
    return d


def increase_mlt(mlt: float):
    increased_mlt = mlt + 0.25

    if increased_mlt > 23.75:
        increased_mlt -= 24.0

    return increased_mlt


def get_3d_units_description(coordinates_dict):
    _3d_units_description = ''

    for mlt in np.arange(0, 24, 0.25):
        for magnetic_lat in np.arange(50, 90.0, 0.5):
            first_point_magnetic = (mlt, magnetic_lat)
            # second_point_magnetic = (increase_mlt(mlt), magnetic_lat)
            # third_point_magnetic = (increase_mlt(mlt), magnetic_lat + 0.5)
            # fourth_point_magnetic = (mlt, magnetic_lat + 0.5)

            first_point_geographic = coordinates_dict[first_point_magnetic]
            # second_point_geographic = coordinates_dict[second_point_magnetic]
            # third_point_geographic = coordinates_dict[third_point_magnetic]
            # fourth_point_geographic = coordinates_dict[fourth_point_magnetic]

            _3d_units_description \
                += (
                    # f'{first_point_magnetic[0]} {first_point_magnetic[1]} '
                    # f'{first_point_geographic[3]} '
                    f'{first_point_geographic[0]:.6f} '
                    f'{first_point_geographic[1]:.6f} '
                    # f'{second_point_geographic[0]} {second_point_geographic[1]} '
                    # f'{third_point_geographic[0]} {third_point_geographic[1]} '
                    # f'{fourth_point_geographic[0]} {fourth_point_geographic[1]} '
                    # f'{first_point_geographic[2]} '
                    f'\n')

    return _3d_units_description


def get_data_from_file(path: str, _datetime: dt.datetime, south_flag) -> str:
    coordinates_dict = get_coordinates_dict(path, _datetime, south_flag)
    units_description = get_3d_units_description(coordinates_dict)

    return units_description


def get_data_path_in_destination(path_in_source: str):
    path_in_destination = path_in_source.replace(OVATION_PRIME_DATA_ROOT, SECOND_OVATION_PRIME_DATA_ROOT, 1)
    path_in_destination_directory, path_in_destination_filename = os.path.split(path_in_destination)
    path_in_destination_filename = path_in_destination_filename.replace("aacgm", "aacgm_and_geographic")

    return os.path.join(path_in_destination_directory, path_in_destination_filename)


def try_create_directories(directories):
    path = directories[0]
    if not os.path.isdir(path):
        os.mkdir(directories[0])

    for directory in directories[1:]:
        path = os.path.join(path, directory)
        if not os.path.isdir(path):
            os.mkdir(path)


def file_is_short(path: str) -> bool:
    f = open(path)
    number_of_lines = 0

    for line in f:
        number_of_lines += 1

    f.close()

    return number_of_lines < 7685


def do_source_traversal(directory: str):
    for filename in sorted(os.listdir(directory)):
        path = os.path.join(directory, filename)

        if os.path.isdir(path):
            do_source_traversal(path)
        elif filename.endswith('.txt'):
            file_type_index = get_file_type_index(filename)

            # print(f"file_type_index: {file_type_index}")

            if file_type_index != -1:
                file_datetime = get_datetime_from_str(get_file_datetime(filename))

                if (files_last_record_datetime_marks[file_type_index] is None \
                        or file_datetime >= files_last_record_datetime_marks[file_type_index])\
                        and not file_is_short(path):
                    data = get_data_from_file(path, file_datetime, "south" in filename)
                    data_path_in_destination = get_data_path_in_destination(path)
                    directories = data_path_in_destination.split(os.sep)
                    directories.pop(-1)
                    try_create_directories(directories)
                    with open(data_path_in_destination, "w") as f:
                        print(f"Message from {THIS_FILENAME}. Write data to: {data_path_in_destination}")
                        f.write(data)


def do_coordinates_manager_iteration():
    start_search_of_last_datetime_marks_from_destination()
    do_source_traversal(OVATION_PRIME_DATA_ROOT)


# do_coordinates_manager_iteration()
