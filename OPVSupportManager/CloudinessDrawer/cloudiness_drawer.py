# Это главный файл для рисования облачности.

import datetime
import os
import sys
import pymysql
import datetime as dt
import numpy as np
import aacgmv2
import time

from drawing import draw

REPEAT_FLAG = False

SLEEP_TIME_IN_SECONDS = 3600 * 3

current = os.path.dirname(os.path.realpath(__file__))
parent = os.path.dirname(current)
sys.path.append(parent)

from paths import TOTAL_METEO_PATH, METEO_DATABASE_HOST


def get_north_meteo_path():
    north_meteo_path = os.path.join(TOTAL_METEO_PATH, "north")

    if not os.path.isdir(north_meteo_path):
        os.mkdir(north_meteo_path)

    return north_meteo_path


def get_south_meteo_path():
    south_meteo_path = os.path.join(TOTAL_METEO_PATH, "south")

    if not os.path.isdir(south_meteo_path):
        os.mkdir(south_meteo_path)

    return south_meteo_path


NORTH_METEO_PATH = get_north_meteo_path()
SOUTH_METEO_PATH = get_south_meteo_path()


# --------------------------------------------------------------

# TOTAL_METEO_PATH = r"D:\MeteoHighResolution"
# NORTH_METEO_PATH = r"D:\MeteoHighResolution\north"
# SOUTH_METEO_PATH = r"D:\MeteoHighResolution\south"
#
# METEO_DATABASE_HOST = "193.232.6.63"

THIS_FILENAME = "cloudiness_drawer.py"


def get_meteo_path(horizon_side: str, current_datetime: dt.datetime):
    return os.path.join(
        TOTAL_METEO_PATH,
        horizon_side,
        str(current_datetime.year),
        str(current_datetime.month).zfill(2),
        str(current_datetime.day).zfill(2),
        get_datetime_representation_2(current_datetime) + ".png"
    )


# --------------------------------------------------------------


def get_datetime_representation(_datetime: datetime.datetime):
    return f"{_datetime.year}-{str(_datetime.month).zfill(2)}-{str(_datetime.day).zfill(2)} {str(_datetime.hour).zfill(2)}:00:00"


def get_datetime_representation_2(_datetime: datetime.datetime):
    return f"{_datetime.year}-{str(_datetime.month).zfill(2)}-{str(_datetime.day).zfill(2)} {str(_datetime.hour).zfill(2)}-00-00"


def get_first(cur):
    for i in cur:
        return i


def get_cloudiness_description(_datetime, min_lat, max_lat):
    cloudiness_description = ""

    for lat in np.arange(min_lat, max_lat + 0.25, 0.25):
        geographical_latitudes = np.ones((1440,)) * lat
        geographical_longitudes = np.arange(-179.75, 180 + 0.25, 0.25)
        geographical_altitudes = np.zeros((1440,))

        geomagnetic_latitudes, geomagnetic_longitudes, _ \
            = aacgmv2.wrapper.convert_latlon_arr(geographical_latitudes, geographical_longitudes,
                                                 geographical_altitudes, _datetime, method_code='G2A')
        mlts = aacgmv2.wrapper.convert_mlt(geomagnetic_longitudes, _datetime, m2a=False)

        for j in range(len(geomagnetic_latitudes)):
            cloudiness_description += f"{geomagnetic_latitudes[j]}#{mlts[j]} "

        cloudiness_description += "\n"

    return cloudiness_description


def try_create_directories(directories):
    path = directories[0]
    if not os.path.isdir(path):
        os.mkdir(directories[0])

    for directory in directories[1:]:
        path = os.path.join(path, directory)
        if not os.path.isdir(path):
            os.mkdir(path)


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


first_file_datetime = None
last_file_datetime = None


def find_first_and_last_datetime_from_files(directory: str):
    global first_file_datetime
    global last_file_datetime

    if not os.path.isdir(directory):
        return

    for filename in sorted(os.listdir(directory)):
        path = os.path.join(directory, filename)

        if os.path.isdir(path):
            find_first_and_last_datetime_from_files(path)
        elif filename.endswith('.png'):
            current_datetime = get_datetime_from_str(filename)
            if (first_file_datetime is None) or (current_datetime < first_file_datetime):
                first_file_datetime = current_datetime
            if (last_file_datetime is None) or (current_datetime > last_file_datetime):
                last_file_datetime = current_datetime


def find_first_and_last_datetime_from_database(cur, table_name):
    cur.execute(f"SELECT dt FROM {table_name} ORDER BY dt;")
    for i in cur:
        first_datetime = i
        break
    for i in cur:
        last_datetime = i

    return first_datetime, last_datetime


def get_first_and_last_year_from_tables(horizon_side):
    cur.execute("SELECT table_name FROM INFORMATION_SCHEMA.TABLES WHERE table_type = 'BASE TABLE'")

    first_year = None
    last_year = None

    if horizon_side == 'north':
        for i in cur:
            if 'arctic' in i[0] and 'ant' not in i[0]:
                current_year = int(i[0][-4:])

                if (first_year is None) or (first_year > current_year):
                    first_year = current_year

                if (last_year is None) or (last_year < current_year):
                    last_year = current_year
    else:
        for i in cur:
            if 'antarctic' in i[0]:
                current_year = int(i[0][-4:])

                if (first_year is None) or (first_year > current_year):
                    first_year = current_year

                if (last_year is None) or (last_year < current_year):
                    last_year = current_year

    return first_year, last_year


def get_first_and_last_datetime_from_table(year, horizon_side):
    cur.execute(f"SELECT dt FROM {'arctic' if horizon_side == 'north' else 'antarctic'}_TCDC_{year} ORDER BY dt;")
    for i in cur:
        first_datetime = i[0]
        break
    for i in cur:
        last_datetime = i[0]

    return first_datetime, last_datetime


def get_first_and_last_datetime_from_tables(horizon_side):
    first_year, last_year = get_first_and_last_year_from_tables(horizon_side)

    first_datetime = None
    last_datetime = None

    for current_year in np.arange(first_year, last_year + 1, 1):
        current_first_datetime, current_last_datetime = get_first_and_last_datetime_from_table(current_year,
                                                                                               horizon_side)

        if (first_datetime is None) or (first_datetime > current_first_datetime):
            first_datetime = current_first_datetime

        if (last_datetime is None) or (last_datetime < current_last_datetime):
            last_datetime = current_last_datetime

    return first_datetime, last_datetime


def do_files_adding(begin_datetime, last_tables_datetime, horizon_side):
    current_datetime = begin_datetime

    while current_datetime <= last_tables_datetime:
        print(f"Message from {THIS_FILENAME}. current datetime: {current_datetime}")
        cloudiness_description \
            = get_cloudiness_description(current_datetime, 40 if horizon_side == 'north' else -90,
                                         90 if horizon_side == 'north' else -35)
        try_create_directories([
            TOTAL_METEO_PATH,
            horizon_side,
            f"{current_datetime.year}",
            f"{str(current_datetime.month).zfill(2)}",
            f"{str(current_datetime.day).zfill(2)}"
        ])
        # f = open(
        #     f"meteo-high-resolution/{horizon_side}/{current_datetime.year}/{str(current_datetime.month).zfill(2)}/{str(current_datetime.day).zfill(2)}/{get_datetime_representation_2(current_datetime)}.txt",
        #     "w")
        # f.write(cloudiness_description)
        # f.close()
        # here
        draw(current_datetime,
             horizon_side,
             # f"meteo-high-resolution/{horizon_side}/{current_datetime.year}/{str(current_datetime.month).zfill(2)}/{str(current_datetime.day).zfill(2)}/{get_datetime_representation_2(current_datetime)}.png",
             get_meteo_path(horizon_side=horizon_side, current_datetime=current_datetime),
             cloudiness_description)
        current_datetime += dt.timedelta(hours=3)


conn = pymysql.connect(
    user="reader",
    password="sNN942PhPI",
    host=METEO_DATABASE_HOST,
    port=3306,
    database="meteo"
)

cur = conn.cursor()

if not os.path.isdir(TOTAL_METEO_PATH):
    os.mkdir(TOTAL_METEO_PATH)


def do_cloudiness_drawer_iteration():
    global first_file_datetime
    global last_file_datetime

    start_time = time.time()

    # -----------------------------------------------------
    # Для северной полусферы
    # -----------------------------------------------------
    first_file_datetime = None
    last_file_datetime = None
    find_first_and_last_datetime_from_files(NORTH_METEO_PATH)

    first_arctic_tables_datetime, last_arctic_tables_datetime = get_first_and_last_datetime_from_tables('north')

    if first_arctic_tables_datetime is None:
        raise Exception()

    if (first_file_datetime is None) or (first_file_datetime > first_arctic_tables_datetime):
        do_files_adding(first_arctic_tables_datetime, last_arctic_tables_datetime, 'north')
    else:
        do_files_adding(last_file_datetime, last_arctic_tables_datetime, 'north')

    # -----------------------------------------------------
    # Для южной полусферы
    # -----------------------------------------------------
    first_file_datetime = None
    last_file_datetime = None
    find_first_and_last_datetime_from_files(os.path.join(SOUTH_METEO_PATH))

    first_antarctic_tables_datetime, last_antarctic_tables_datetime = get_first_and_last_datetime_from_tables('south')

    if first_antarctic_tables_datetime is None:
        raise Exception()

    if (first_file_datetime is None) or (first_file_datetime > first_antarctic_tables_datetime):
        do_files_adding(first_antarctic_tables_datetime, last_antarctic_tables_datetime, 'south')
    else:
        do_files_adding(last_file_datetime, last_antarctic_tables_datetime, 'south')


# do_cloudiness_drawer_iteration()
