# Это главный файл для формирования файлов с прогнозами.

import sys
import tensorflow as tf
import numpy as np
import datetime as dt
from datetime import timedelta
from three_last_values_util import ThreeLastValuesUtil
from three_last_paths_util import ThreeLastPathsUtil
import sqlite3
import os
from datatype import DataType
import aacgmv2

current = os.path.dirname(os.path.realpath(__file__))
parent = os.path.dirname(current)
sys.path.append(parent)

from paths import (OVATION_PRIME_DATA_ROOT,
                   DATABASE_PATH,
                   CLUSTERS_PATH)

AURORAE_HEIGHT_KM = 95

# Адрес корневой папки с данными, полученными от системы Ovation Prime.
# OVATION_PRIME_DATA_ROOT = r'C:\OvationPrimeData'
# # SECOND_ROOT = r'C:\OvationPrimeData\2024'
#
# DATABASE_PATH = r'..\..\OPVOnline\db.sqlite3'
#
# CLUSTERS_PATH = r'clustering output.txt'

BAD_CLUSTERS_INDICES = [12, 20]
CLUSTERS_NUMBER = 22

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


def get_ts_last_three_values():
    three_last_ts_values_utils = []

    for i in range(0, 7680):
        three_last_ts_values_utils.append(ThreeLastValuesUtil())

    # three_last_paths_util = ThreeLastPathsUtil()
    # find_three_last_paths(SECOND_ROOT, three_last_paths_util)

    paths = get_three_last_files_paths()

    filename_0 = os.path.split(paths[0])[-1]
    filename_1 = os.path.split(paths[1])[-1]
    filename_2 = os.path.split(paths[2])[-1]

    # print("hello")
    # print(f"filename_0: {filename_0[-1]}")
    datetime_0 = get_datetime_from_str(get_file_datetime(filename_0))
    datetime_1 = get_datetime_from_str(get_file_datetime(filename_1))
    datetime_2 = get_datetime_from_str(get_file_datetime(filename_2))

    acceptable_timedelta_flag \
        = ((((datetime_1 - datetime_0).total_seconds() - 3660) < 300)
           and (((datetime_2 - datetime_1).total_seconds() - 3660) < 300))

    if acceptable_timedelta_flag:
        for path in paths:
            process_file(path, three_last_ts_values_utils)

        ts_last_three_values = []

        for util in three_last_ts_values_utils:
            ts_last_three_values.append(util.get_tuple())

        return ts_last_three_values, paths[-1]
    else:
        return None, None


def find_three_last_paths(
        directory: str, three_last_paths_util: ThreeLastPathsUtil):
    for filename in sorted(os.listdir(directory)):
        path = os.path.join(directory, filename)

        if os.path.isdir(path):
            find_three_last_paths(path, three_last_paths_util)
        elif filename.endswith('.txt'):
            three_last_paths_util.accept_path(path)


# def do_files_traversal(directory: str, three_last_values_utils: list[ThreeLastValuesUtil]) -> list[str]:
#     for filename in sorted(os.listdir(directory)):
#         path = os.path.join(directory, filename)
#
#         if os.path.isdir(path):
#             do_files_traversal(path, three_last_values_utils)
#         elif filename.endswith('.txt'):
#             file_type_index = get_file_type_index(filename)
#
#             if file_type_index == DataType.NORTH_NOWCAST_DIFFUSE:
#                 process_file(path, three_last_values_utils)


def process_file(path, three_last_values_utils: list[ThreeLastValuesUtil]):
    f = open(path)

    for index_and_line in enumerate(f):
        if 5 <= index_and_line[0] <= 7684:
            split_line = index_and_line[1].split(' ')

            while '' in split_line:
                split_line.remove('')

            three_last_values_utils[index_and_line[0] - 5].accept_value(float(split_line[-1]))

    f.close()


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


def get_path_to_model(cluster_index):
    return os.path.join('saved-models', f'model for cluster {cluster_index}')


def get_train_mean_and_std_path(cluster_index):
    return os.path.join('train-mean-and-std', f'train mean and std for cluster {cluster_index}.txt')


# def cluster_unit_index_to_file_path(clustering_unit_index: int) -> str:
#     mlt = get_mlt(clustering_unit_index)
#     magnetic_lat = get_magnetic_lat(clustering_unit_index)
#
#     return None


def get_second_forecast():
    clusters = get_clusters()
    ts_last_three_values, last_path = get_ts_last_three_values()

    if ts_last_three_values is None:
        return None, None

    result = []

    for i in range(CLUSTERS_NUMBER):
        result += get_second_forecast_for_cluster(clusters, i, ts_last_three_values)

    result.sort(key=lambda element: (element[0], element[1]))

    result_str = ""

    for current in result:
        current_str = f"{current[0]:.2f}  {current[1]:.1f}  {current[2]}\n"
        result_str += current_str

    return result_str, last_path


def get_second_forecast_file_path(last_path):
    # second_forecast_file_name = f"north diffuse {get_second_forecast_datetime(three_last_paths_util)}.txt"
    second_forecast_file_name = os.path.join("second-forecast",
                                             f"{get_second_forecast_datetime(last_path)}"
                                             f"_north_forecast_2_diffuse_energy-flux_aacgm.txt")
    second_forecast_file_name \
        = second_forecast_file_name.replace(":", "_")

    return second_forecast_file_name


# def get_second_forecast_file_path_3d(three_last_paths_util):
#     # second_forecast_file_name = f"north diffuse {get_second_forecast_datetime(three_last_paths_util)}.txt"
#     second_forecast_file_name = os.path.join("second-forecast-3d",
#                                              f"{get_second_forecast_datetime(three_last_paths_util)}"
#                                              f"_north_diffuse_energy-flux_aacgm_and_geographical.txt")
#     second_forecast_file_name \
#         = second_forecast_file_name.replace(":", "_")
#
#     return second_forecast_file_name

def rreplace(s, old, new):
    li = s.rsplit(old, 1) #Split only once
    return new.join(li)

def get_second_forecast_file_path_3d(forecast_path):
    forecast_path = rreplace(forecast_path, 'aacgm', 'aacgm_and_geographical')
    forecast_path = rreplace(forecast_path, 'second-forecast', 'second-forecast-3d')

    return forecast_path
    # split_forecast_path = os.path.split(forecast_path)
    # # last_element = split_forecast_path[-1].replace('aacgm', 'aacgm_and_geographical')
    # lst = []
    #
    # for cur in split_forecast_path:
    #     lst.append(cur)
    #
    # lst[-1] = lst[-1].replace('aacgm', 'aacgm_and_geographical')
    #
    # return os.path.join(lst[0], lst[1])


def get_datetime_from_str(datetime_str) -> dt.datetime:
    """
    Получаем дату и время по их строковому представлению.
    :param datetime_str: строковое представление даты и времени.
    :return: упомянутые дата и время.
    """
    # print(f"datetime_str: \'{datetime_str}\'")
    return dt.datetime(
        int(datetime_str[0:4]),
        int(datetime_str[5:7]),
        int(datetime_str[8:10]),
        int(datetime_str[11:13]),
        int(datetime_str[14:16])
    )


def get_file_datetime(filename: str) -> str:
    year = filename[0:4]
    month = filename[4:6]
    day = filename[6:8]
    hour = filename[9:11]
    minute = filename[11:13]
    second = '00'
    return f"{year}-{month}-{day} {hour}:{minute}:{second}"


def get_second_forecast_datetime(last_path):
    # cur.execute(f"SELECT datetime FROM opv_main_northnowcastdiffuserecord ORDER BY datetime DESC LIMIT 1;")
    # datetime = get_datetime_from_str(cur.fetchone()[0])
    # hour_and_minute_later = datetime + timedelta(hours=1, minutes=1)
    #
    # return hour_and_minute_later.strftime("%Y-%m-%d %H:%M")
    last_filename = os.path.split(last_path)[1]
    datetime = get_datetime_from_str(get_file_datetime(last_filename))
    hour_and_minute_later = datetime + timedelta(hours=1, minutes=1)

    return hour_and_minute_later.strftime("%Y%m%d_%H%M")


def get_second_forecast_for_cluster(clusters, cluster_index: int,
                                    ts_last_three_values: list[tuple[float, float, float]]) -> list[
    tuple[float, float, float]]:
    cluster = clusters[cluster_index]
    ts_last_values = get_ts_last_values(cluster, ts_last_three_values)

    model = tf.keras.models.load_model(get_path_to_model(cluster_index))
    predictions = model(np.array(ts_last_values)).numpy()
    train_mean, train_std = get_train_mean_and_std(cluster_index)

    if cluster_index in BAD_CLUSTERS_INDICES:
        for i in range(len(predictions)):
            predictions[i] = 0
    else:
        for i in range(len(predictions)):
            predictions[i] = predictions[i] * train_std + train_mean

    result = []

    for i in range(len(cluster)):
        mlt = get_mlt(cluster[i])
        magnetic_lat = get_magnetic_lat(cluster[i])
        predicted_value = predictions[i][0][0]

        # result += f"{mlt:.2f} {magnetic_lat:.1f} {predicted_value}\n"
        result.append((mlt, magnetic_lat, predicted_value))

    return result


def get_train_mean_and_std(cluster_index: int):
    path = get_train_mean_and_std_path(cluster_index)
    f = open(path, "r")
    line = f.readline()
    split_line = line.split(' ')
    return float(split_line[0]), float(split_line[1])


def get_ts_last_values(cluster, three_last_ts_values):
    ts_last_values = []

    for ts_index in cluster:
        ts_last_values.append(three_last_ts_values[ts_index])

    return ts_last_values


def get_mlt(clustering_unit_index):
    return clustering_unit_index // 80 * 0.25


def get_magnetic_lat(clustering_unit_index):
    return clustering_unit_index % 80 * 0.5 + 50


def get_clusters():
    file = open(CLUSTERS_PATH, 'r')
    lines = file.readlines()
    file.close()

    clusters = []

    for line in lines:
        if line.strip() == '':
            continue

        clusters.append(convert_line_to_list(line))

    return clusters


def convert_line_to_list(line: str):
    split_line = line.split(' ')
    result_list = []

    for current in split_line:
        if current == '\n':
            continue

        result_list.append(int(current))

    return result_list


df_dict = {}


# def get_three_last_ts_values(ts_index: int):
#     # zero_path, first_path, second_path = get_three_last_files_paths()
#     # return (get_ts_value(zero_path, index),
#     #         get_ts_value(first_path, index),
#     #         get_ts_value(second_path, index))
#     path = cluster_unit_index_to_file_path(ts_index)
#
#     if path not in df_dict.keys():
#         df_y_numpy = (pd.read_csv(path, sep=';'))['y'].to_numpy()
#         df_dict[path] = df_y_numpy
#     else:
#         df_y_numpy = df_dict[path]
#
#     return df_y_numpy[-3], df_y_numpy[-2], df_y_numpy[-1]


def get_three_last_files_paths():
    cur.execute(f"SELECT path FROM opv_main_northnowcastdiffuserecord ORDER BY datetime DESC LIMIT 3;")
    select_result = cur.fetchall()
    return select_result[2][0], select_result[1][0], select_result[0][0]


def get_coordinates_dict(path: str, _datetime: dt.datetime, south_flag):
    f = open(path)
    d = {}

    for index_and_line in enumerate(f):
        if 0 <= index_and_line[0] < 7680:
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


def do_forecast_manager_iteration():
    second_forecast, last_path = get_second_forecast()

    if second_forecast is None:
        return

    second_forecast_file_path = get_second_forecast_file_path(last_path)

    with open(second_forecast_file_path, 'w') as f:
        f.write(second_forecast)

    second_forecast_filename = os.path.split(second_forecast_file_path)[-1]
    file_datetime = get_datetime_from_str(get_file_datetime(second_forecast_filename))
    data = get_data_from_file(second_forecast_file_path, file_datetime, "south" in second_forecast_filename)
    # second_forecast_file_path_3d = get_second_forecast_file_path_3d(three_last_paths_util)
    # print(f"here: \'{second_forecast_file_path}\'")
    second_forecast_file_path_3d = get_second_forecast_file_path_3d(second_forecast_file_path)

    with open(second_forecast_file_path_3d, 'w') as f:
        f.write(data)


do_forecast_manager_iteration()
