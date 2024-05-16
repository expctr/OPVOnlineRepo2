# В данном файле содержится реализация функций для получения прогноза.

import datetime as dt
from datetime import timedelta
import os
import aacgmv2
import numpy as np

from opv_main.models import *

ROOT_FORECAST = os.path.join('..',
                             'OPVSupportManager',
                             'ForecastManager',
                             'second-forecast', )

ROOT_FORECAST_3D = os.path.join('..',
                                'OPVSupportManager',
                                'ForecastManager',
                                'second-forecast-3d', )


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


def merge_files_data(path_3d: str, path_2d: str):
    merged_data = ""

    with open(path_3d, 'r') as file_3d:
        lines_3d = file_3d.read().split('\n')

    with open(path_2d, 'r') as file_2d:
        lines_2d = file_2d.read().split('\n')

    for index_and_line_3d in enumerate(lines_3d):
        merged_line = lines_2d[index_and_line_3d[0]] + ' ' + index_and_line_3d[1] + '\n'
        merged_data += merged_line

    return merged_data


def get_second_forecast_paths_and_datetime_and_filename():
    last_filename_2d = None
    last_path_2d = None

    for filename_2d in sorted(os.listdir(ROOT_FORECAST)):
        path = os.path.join(ROOT_FORECAST, filename_2d)
        last_filename_2d = filename_2d
        last_path_2d = path

    last_filename_3d = None
    last_path_3d = None

    for filename_3d in sorted(os.listdir(ROOT_FORECAST_3D)):
        path = os.path.join(ROOT_FORECAST_3D, filename_3d)
        last_filename_3d = filename_3d
        last_path_3d = path

    if get_file_datetime(last_filename_2d) != get_file_datetime(last_filename_3d):
        return None, None, None, None
    else:
        return last_path_2d, last_path_3d, get_file_datetime(last_filename_2d), last_filename_2d


def get_second_forecast_params():
    path_2d, path_3d, _datetime, filename = get_second_forecast_paths_and_datetime_and_filename()
    data = merge_files_data(path_3d, path_2d)

    return data, _datetime, filename
