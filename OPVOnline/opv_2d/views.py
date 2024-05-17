# В данном файле содержится описание классов и функций для обработки клиентских запросов
# при работе страницы 2D визуализаци.

import os
from django.http import HttpResponse, HttpResponseBadRequest
from django.template.loader import render_to_string
from django.views import View
from django.http import JsonResponse

from opv_main.models import *
from opv_2d.models import *
from opv_2d.file_type_index import FileTypeIndex
import datetime as dt
import aacgmv2
from shapely.geometry import Polygon
import shapely
import numpy as np
import pymysql
import math
import json
import time
from collections import deque
from PIL import Image
import base64
import sys

from opv_2d.paths import (METEO_HIGH_RESOLUTION_PREFIX_PATH,
                          CONTINENTS_PATH,
                          CONTINENTS_PREFIX_PATH,
                          CITIES_PATH)

# meteo_conn = pymysql.connect(
#     user="reader",
#     password="sNN942PhPI",
#     host="193.232.6.63",
#     port=3306,
#     database="meteo"
# )


# from numba import njit

# # Note:
# # datetime_representation = get_datetime_representation_2(current_datetime))
# CLOUDINESS_IMAGE_PATH_TEMPLATE \
#     = ("meteo-high-resolution"
#        "/{horizon_side}"
#        "/{current_datetime.year}"
#        "/{str(current_datetime.month).zfill(2)}"
#        "/{str(current_datetime.day).zfill(2)}"
#        "/{datetime_representation_2}"
#        ".png")


# ---------------------------------------------------------------------------

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


# CLOUDINESS_IMAGE_PATH \
#     = r"C:\Coding\final-qualifying-work_2023-2024\CloudinessDrawer\meteo-high-resolution\north\2023\07\27\2023-07-27 00-00-00.png"
# ADJUSTED_DATETIME = get_datetime_from_str("2023-07-27 00:00:00")


# CONTINENTS_PATH = "continents.txt"
# CITIES_PATH = 'cities.txt'


def get_datetime_representation_2(_datetime: dt.datetime) -> str:
    return f"{_datetime.year}-{str(_datetime.month).zfill(2)}-{str(_datetime.day).zfill(2)} {str(_datetime.hour).zfill(2)}-00-00"


def get_cloudiness_image_path(horizon_side: str, current_datetime: dt.datetime) -> str:
    # datetime_representation_2 = get_datetime_representation_2(current_datetime)
    # return CLOUDINESS_IMAGE_PATH_TEMPLATE.format(horizon_side=horizon_side,
    #                                              current_datetime=current_datetime,
    #                                              datetime_representation_2=datetime_representation_2)
    return os.path.join(
        METEO_HIGH_RESOLUTION_PREFIX_PATH,
        horizon_side,
        str(current_datetime.year),
        str(current_datetime.month).zfill(2),
        str(current_datetime.day).zfill(2),
        get_datetime_representation_2(current_datetime) + ".png"
    )


def get_file_path_with_cloudiness_cells_geomagnetic_coordinates(_datetime: dt.datetime, horizon_side: str) -> str:
    return os.path.join(METEO_HIGH_RESOLUTION_PREFIX_PATH,
                        horizon_side,
                        f"{_datetime.year}",
                        str(_datetime.month).zfill(2),
                        str(_datetime.day).zfill(2),
                        get_datetime_representation_2(_datetime) + ".txt")


# ---------------------------------------------------------------------------

def main_view(request):
    """
    Функция, которая возвращает html код страницы для
    визуализации данных, полученных от системы Ovation Prime.
    :param request: запрос к серверу.
    :return: ответ сервера.
    """
    response = render_to_string('opv_2d/index.html')
    return HttpResponse(response)


def get_data_from_file(path: str) -> str:
    """
    Получаем строковое представление данных из файла,
    полученного от системы Ovation Prime.
    :param path: путь к упомянутому файлу.
    :return: содержание строк упомянутого файла.
             Номера строк: 5 - 7684 включительно.
             Нумерация строк начинается с 0.
    """
    f = open(path)
    data = ''

    for index_and_line in enumerate(f):
        if 5 <= index_and_line[0] <= 7684:
            data += index_and_line[1]

    f.close()

    return data


def get_file_type_index(file_type_description: str) -> int:
    """
    Получаем индекс типа файла по строковому описанию типа файла.
    :param file_type_description: строковое описание типа файла.
    :return: индекс типа файла.
    """
    if 'north' in file_type_description:
        if 'forecast' in file_type_description:
            if 'diffuse' in file_type_description:
                return FileTypeIndex.NORTH_FORECAST_DIFFUSE
            elif 'ions' in file_type_description:
                return FileTypeIndex.NORTH_FORECAST_IONS
            elif 'mono' in file_type_description:
                return FileTypeIndex.NORTH_FORECAST_MONO
            elif 'total' in file_type_description:
                return FileTypeIndex.NORTH_FORECAST_TOTAL
            elif 'wave' in file_type_description:
                return FileTypeIndex.NORTH_FORECAST_WAVE
            else:
                return FileTypeIndex.UNKNOWN
        elif 'nowcast' in file_type_description:
            if 'diffuse' in file_type_description:
                return FileTypeIndex.NORTH_NOWCAST_DIFFUSE
            elif 'ions' in file_type_description:
                return FileTypeIndex.NORTH_NOWCAST_IONS
            elif 'mono' in file_type_description:
                return FileTypeIndex.NORTH_NOWCAST_MONO
            elif 'total' in file_type_description:
                return FileTypeIndex.NORTH_NOWCAST_TOTAL
            elif 'wave' in file_type_description:
                return FileTypeIndex.NORTH_NOWCAST_WAVE
            else:
                return FileTypeIndex.UNKNOWN
        else:
            return FileTypeIndex.UNKNOWN
    elif 'south' in file_type_description:
        if 'forecast' in file_type_description:
            if 'diffuse' in file_type_description:
                return FileTypeIndex.SOUTH_FORECAST_DIFFUSE
            elif 'ions' in file_type_description:
                return FileTypeIndex.SOUTH_FORECAST_IONS
            elif 'mono' in file_type_description:
                return FileTypeIndex.SOUTH_FORECAST_MONO
            elif 'total' in file_type_description:
                return FileTypeIndex.SOUTH_FORECAST_TOTAL
            elif 'wave' in file_type_description:
                return FileTypeIndex.SOUTH_FORECAST_WAVE
            else:
                return FileTypeIndex.UNKNOWN
        elif 'nowcast' in file_type_description:
            if 'diffuse' in file_type_description:
                return FileTypeIndex.SOUTH_NOWCAST_DIFFUSE
            elif 'ions' in file_type_description:
                return FileTypeIndex.SOUTH_NOWCAST_IONS
            elif 'mono' in file_type_description:
                return FileTypeIndex.SOUTH_NOWCAST_MONO
            elif 'total' in file_type_description:
                return FileTypeIndex.SOUTH_NOWCAST_TOTAL
            elif 'wave' in file_type_description:
                return FileTypeIndex.SOUTH_NOWCAST_WAVE
            else:
                return FileTypeIndex.UNKNOWN
        else:
            return FileTypeIndex.UNKNOWN
    else:
        return FileTypeIndex.UNKNOWN


def get_north_50_magnetic_latitude_polygon_vertices(_datetime):
    north_50_magnetic_latitude_polygon_geographical_lat_lngs = []
    for mlt in np.arange(0, 24, 0.1):  # np.arange(0, 24, 0.01)
        next_mlt = mlt + 0.1
        magnetic_lat = 50
        magnetic_lng = aacgmv2.wrapper.convert_mlt(mlt, _datetime, m2a=True)[0]
        next_magnetic_lng = aacgmv2.wrapper.convert_mlt(next_mlt, _datetime, m2a=True)[0]
        geographical_lat, geographical_lon, _ \
            = aacgmv2.wrapper.convert_latlon(magnetic_lat, magnetic_lng, 0, _datetime, method_code='A2G')
        next_geographical_lat, next_geographical_lon, _ \
            = aacgmv2.wrapper.convert_latlon(magnetic_lat, next_magnetic_lng, 0, _datetime, method_code='A2G')

        if geographical_lon >= 0 >= next_geographical_lon:
            north_50_magnetic_latitude_polygon_geographical_lat_lngs.append([geographical_lat, 180])
            north_50_magnetic_latitude_polygon_geographical_lat_lngs.append([90, 180])
            north_50_magnetic_latitude_polygon_geographical_lat_lngs.append([90, -180])
            north_50_magnetic_latitude_polygon_geographical_lat_lngs.append([geographical_lat, -180])
        else:
            north_50_magnetic_latitude_polygon_geographical_lat_lngs.append((geographical_lat, geographical_lon))
    return north_50_magnetic_latitude_polygon_geographical_lat_lngs


def get_south_50_magnetic_latitude_polygon_vertices(_datetime):
    north_50_magnetic_latitude_polygon_geographical_lat_lngs = []
    for mlt in np.arange(0, 24, 0.1):
        next_mlt = mlt + 0.1
        magnetic_lat = -50
        magnetic_lng = aacgmv2.wrapper.convert_mlt(mlt, _datetime, m2a=True)[0]
        next_magnetic_lng = aacgmv2.wrapper.convert_mlt(next_mlt, _datetime, m2a=True)[0]
        geographical_lat, geographical_lon, _ \
            = aacgmv2.wrapper.convert_latlon(magnetic_lat, magnetic_lng, 0, _datetime, method_code='A2G')
        next_geographical_lat, next_geographical_lon, _ \
            = aacgmv2.wrapper.convert_latlon(magnetic_lat, next_magnetic_lng, 0, _datetime, method_code='A2G')

        if geographical_lon >= 0 >= next_geographical_lon:
            north_50_magnetic_latitude_polygon_geographical_lat_lngs.append([geographical_lat, 180])
            north_50_magnetic_latitude_polygon_geographical_lat_lngs.append([-90, 180])
            north_50_magnetic_latitude_polygon_geographical_lat_lngs.append([-90, -180])
            north_50_magnetic_latitude_polygon_geographical_lat_lngs.append([geographical_lat, -180])
        else:
            north_50_magnetic_latitude_polygon_geographical_lat_lngs.append((geographical_lat, geographical_lon))

    return north_50_magnetic_latitude_polygon_geographical_lat_lngs


def get_terminator_geographical_lat_lngs_from_string(terminator_veritces_string_representation):
    terminator_geographical_lat_lngs = []
    split_result = terminator_veritces_string_representation.split('\n')
    for line in split_result:
        split_line = line.split(' ')
        if len(split_line) < 2:
            continue
        terminator_geographical_lat_lngs.append((float(split_line[0]), float(split_line[1])))
    return terminator_geographical_lat_lngs


class ResponseUtil(View):
    """
    Класс для обработки запросов к серверу, связанных с
    визуализаций данных, полученных от системы Ovation Prime.
    """

    # Список методов для доступа к таблицам в базе данных
    # с информацией о файлах, полученных от системы Ovation Prime.
    recordAccessDelegates = [
        NorthForecastDiffuseRecord.objects.order_by,
        NorthForecastIonsRecord.objects.order_by,
        NorthForecastMonoRecord.objects.order_by,
        NorthForecastTotalRecord.objects.order_by,
        NorthForecastWaveRecord.objects.order_by,
        NorthNowcastDiffuseRecord.objects.order_by,
        NorthNowcastIonsRecord.objects.order_by,
        NorthNowcastMonoRecord.objects.order_by,
        NorthNowcastTotalRecord.objects.order_by,
        NorthNowcastWaveRecord.objects.order_by,
        SouthForecastDiffuseRecord.objects.order_by,
        SouthForecastIonsRecord.objects.order_by,
        SouthForecastMonoRecord.objects.order_by,
        SouthForecastTotalRecord.objects.order_by,
        SouthForecastWaveRecord.objects.order_by,
        SouthNowcastDiffuseRecord.objects.order_by,
        SouthNowcastIonsRecord.objects.order_by,
        SouthNowcastMonoRecord.objects.order_by,
        SouthNowcastTotalRecord.objects.order_by,
        SouthNowcastWaveRecord.objects.order_by,
    ]

    def get(self, request):
        """
        Обрабатываем GET запрос к серверу, связанный с
        визуализацией данных, полученных от системы Ovation Prime.
        :param request: запрос к серверу.
        :return: ответ сервера.
        """
        if request.GET.get('purpose') is None:
            return HttpResponseBadRequest()

        if request.GET['purpose'] == 'get files number and last file data':
            return self.process_get_files_number_and_last_file_data_request(request)
        elif request.GET['purpose'] == 'get files number and file data by datetime':
            return self.process_get_files_number_and_file_by_datetime_request(request)
        elif request.GET['purpose'] == 'get file data by index':
            return self.process_get_file_by_index_request(request)
        elif request.GET['purpose'] == 'get file data by datetime':
            return self.process_get_file_by_datetime_request(request)
        elif request.GET['purpose'] == 'get terminator vertices coordinates':
            return self.process_get_terminator_vertices_coordinates_request(request)
        else:
            return HttpResponseBadRequest()

    def process_get_files_number_and_last_file_data_request(self, request):
        """
        Обрабатываем запрос к серверу на получение количества
        файлов и данных последнего файла выбранного типа.
        :param request: запрос к серверу.
        :return: ответ сервера.
        """
        if request.GET.get('filesType') is None:
            return HttpResponseBadRequest()

        file_type_index = get_file_type_index(request.GET['filesType'])

        if file_type_index == FileTypeIndex.UNKNOWN:
            return HttpResponseBadRequest()

        records = self.recordAccessDelegates[file_type_index]('datetime')
        record = records[len(records) - 1]
        files_number = len(records)

        return JsonResponse({
            'filesNumber': str(files_number),
            'data': get_data_from_file(record.path),
            'fileName': os.path.split(record.path)[-1],
            'fileDateTime': record.datetime
        })

    def process_get_files_number_and_file_by_datetime_request(self, request):
        """
        Обрабатываем запрос к серверу на получение количества
        файлов и данных одного файла выбранного типа. Выбирается
        тот файл, чьи дата и время являются ближайшеми к дате
        и времени, которые указаны в запросе к серверу.
        :param request: запрос к серверу.
        :return: ответ сервера.
        """
        if request.GET.get('filesType') is None:
            return HttpResponseBadRequest()

        if request.GET.get('inputFileDateTime') is None:
            return HttpResponseBadRequest()

        file_type_index = get_file_type_index(request.GET['filesType'])

        if file_type_index == FileTypeIndex.UNKNOWN:
            return HttpResponseBadRequest()

        records = self.recordAccessDelegates[file_type_index]('datetime')
        input_file_datetime_str = request.GET['inputFileDateTime']
        input_file_date_time = get_datetime_from_str(input_file_datetime_str)

        min_timedelta_total_seconds \
            = abs((input_file_date_time - get_datetime_from_str(records[0].datetime)).total_seconds())
        searched_index = 0

        for i in range(len(records)):
            cur_time_delta_total_seconds \
                = abs((input_file_date_time - get_datetime_from_str(records[i].datetime)).total_seconds())
            if cur_time_delta_total_seconds < min_timedelta_total_seconds:
                min_timedelta_total_seconds = cur_time_delta_total_seconds
                searched_index = i

        files_number = len(records)

        return JsonResponse({
            'filesNumber': str(files_number),
            'data': get_data_from_file(records[searched_index].path),
            'fileName': os.path.split(records[searched_index].path)[-1],
            'fileIndex': str(searched_index),
            'fileDateTime': records[searched_index].datetime
        })

    def process_get_file_by_index_request(self, request):
        """
        Обрабатываем запрос к серверу на получение
        файла по индексу.
        :param request: запрос к серверу.
        :return: ответ сервера.
        """
        if request.GET.get('filesType') is None:
            return HttpResponseBadRequest()

        if request.GET.get('fileIndex') is None:
            return HttpResponseBadRequest()

        try:
            file_index = int(request.GET.get('fileIndex'))
        except ValueError:
            return HttpResponseBadRequest()

        if file_index < 0:
            return HttpResponseBadRequest()

        file_type_index = get_file_type_index(request.GET['filesType'])

        if file_type_index == FileTypeIndex.UNKNOWN:
            return HttpResponseBadRequest()

        records = self.recordAccessDelegates[file_type_index]('datetime')

        if file_index > len(records) - 1:
            return HttpResponseBadRequest()

        record = records[file_index]

        return JsonResponse({'data': get_data_from_file(record.path),
                             'fileName': os.path.split(record.path)[-1],
                             'fileDateTime': record.datetime})

    def process_get_file_by_datetime_request(self, request):
        """
        Обрабатываем запрос к серверу на получение
        файла, чьи дата и время являются ближайшими
        к дате и времени, указанным в запросе к серверу.
        :param request: запрос к серверу.
        :return: ответ сервера.
        """
        if request.GET.get('filesType') is None:
            return HttpResponseBadRequest()

        if request.GET.get('inputFileDateTime') is None:
            return HttpResponseBadRequest()

        file_type_index = get_file_type_index(request.GET['filesType'])

        if file_type_index == FileTypeIndex.UNKNOWN:
            return HttpResponseBadRequest()

        records = self.recordAccessDelegates[file_type_index]('datetime')
        input_file_datetime_str = request.GET['inputFileDateTime']
        input_file_date_time = get_datetime_from_str(input_file_datetime_str)

        min_timedelta_total_seconds \
            = abs((input_file_date_time - get_datetime_from_str(records[0].datetime)).total_seconds())
        searched_index = 0

        for i in range(len(records)):
            cur_time_delta_total_seconds \
                = abs((input_file_date_time - get_datetime_from_str(records[i].datetime)).total_seconds())
            if cur_time_delta_total_seconds < min_timedelta_total_seconds:
                min_timedelta_total_seconds = cur_time_delta_total_seconds
                searched_index = i

        return JsonResponse({'data': get_data_from_file(records[searched_index].path),
                             'fileName': os.path.split(records[searched_index].path)[-1],
                             'fileIndex': str(searched_index),
                             'fileDateTime': records[searched_index].datetime})

    # def process_get_terminator_vertices_coordinates_request(self, request):
    #     _datetime = get_datetime_from_str(request.GET['dateTime'])
    #     _50_magnetic_latitude_polygon_geographical_lat_lngs = None
    #     north_horizon_flag = request.GET['horizonSide'] == 'north'
    #     if north_horizon_flag:
    #         _50_magnetic_latitude_polygon_geographical_lat_lngs \
    #             = get_north_50_magnetic_latitude_polygon_vertices(_datetime)
    #     else:
    #         _50_magnetic_latitude_polygon_geographical_lat_lngs \
    #             = get_south_50_magnetic_latitude_polygon_vertices(_datetime)
    #     terminator_geographical_lat_lngs \
    #         = get_terminator_geographical_lat_lngs_from_string(request.GET['terminatorVerticesCoordinates'])
    #
    #     polygon1 = Polygon(shapely.geometry.LineString(_50_magnetic_latitude_polygon_geographical_lat_lngs))
    #     polygon2 = Polygon(shapely.geometry.LineString(terminator_geographical_lat_lngs))
    #     intersection = polygon1.intersection(polygon2)
    #
    #     magnetic_coordinates = ''
    #
    #     if isinstance(intersection, shapely.geometry.polygon.Polygon):
    #         for coords in intersection.exterior.coords:
    #             magnetic_lat, magnetic_lon, _ \
    #                 = aacgmv2.wrapper.convert_latlon(coords[0], coords[1], 0, _datetime, method_code='G2A')
    #             mlt = aacgmv2.wrapper.convert_mlt(magnetic_lon, _datetime, m2a=False)[0]
    #             magnetic_coordinates += \
    #                 str(magnetic_lat if north_horizon_flag else -magnetic_lat) + ' ' + str(mlt) + '\n'
    #         magnetic_coordinates += '@'
    #     else:
    #         for cur_intersection in intersection.geoms:
    #             for coords in cur_intersection.exterior.coords:
    #                 magnetic_lat, magnetic_lon, _ \
    #                     = aacgmv2.wrapper.convert_latlon(coords[0], coords[1], 0, _datetime, method_code='G2A')
    #                 mlt = aacgmv2.wrapper.convert_mlt(magnetic_lon, _datetime, m2a=False)[0]
    #                 magnetic_coordinates += \
    #                     str(magnetic_lat if north_horizon_flag else -magnetic_lat) + ' ' + str(mlt) + '\n'
    #             magnetic_coordinates += '@'
    #
    #     return JsonResponse({
    #         'magneticCoordinates': magnetic_coordinates
    #     })


# @njit(fastmath=True, cache=True)
def str2float(text):
    sep = ord(".")
    c_min = ord("0")
    c_max = ord("9")

    n = len(text)
    valid = n > 0
    # determine sign
    start = n - 1
    stop = -1
    sign = 1
    if valid:
        first = ord(text[0])
        if first == ord("+"):
            stop = 0
        elif first == ord("-"):
            sign = -1
            stop = 0
    # parse rest
    sep_pos = 0
    number = 0
    j = 0
    for i in range(start, stop, -1):
        c = ord(text[i])
        if c_min <= c <= c_max:
            number += (c - c_min) * 10 ** j
            j += 1
        elif c == sep and sep_pos == 0:
            sep_pos = j
        else:
            valid = False
            break
    return sign * number / 10 ** sep_pos


# @njit(fastmath=True, cache=True)
def get_geoinformation_data_unit_index(mlt: float, magnetic_lat: float) -> int:
    a = mlt / 0.25
    b = (magnetic_lat - 50) / 0.5
    return int(80 * a + b)


# @njit(fastmath=True, cache=True)
def get_mlt(geoinformation_data_unit_index: int) -> float:
    return geoinformation_data_unit_index // 80 * 0.25


# @njit(fastmath=True, cache=True)
def get_magnetic_lat(geoinformation_data_unit_index: float) -> float:
    return geoinformation_data_unit_index % 80 * 0.5 + 50


# @njit(fastmath=True, cache=True)
def parse_array(data: str) -> np.ndarray:
    arr = np.zeros(7680, dtype=float)
    split_data = data.split('\n')

    for row in split_data:
        split_row = row.split(' ')

        while '' in split_row:
            split_row.remove('')

        if len(split_row) == 0:
            continue

        mlt = str2float(split_row[0])
        geomagnetic_lat = str2float(split_row[1])
        value = str2float(split_row[2])

        index = get_geoinformation_data_unit_index(mlt, geomagnetic_lat)
        arr[index] = value

    return arr


# @njit(fastmath=True, cache=True)
def cut_trail(f_str):
    cut = 0
    for c in f_str[::-1]:
        if c == "0":
            cut += 1
        else:
            break
    if cut == 0:
        for c in f_str[::-1]:
            if c == "9":
                cut += 1
            else:
                cut -= 1
                break
    if cut > 0:
        f_str = f_str[:-cut]
    if f_str == "":
        f_str = "0"
    return f_str


# @njit(fastmath=True, cache=True)
def float2str(value):
    if math.isnan(value):
        return "nan"
    elif value == 0.0:
        return "0.0"
    elif value < 0.0:
        return "-" + float2str(-value)
    elif math.isinf(value):
        return "inf"
    else:
        max_digits = 16
        min_digits = -4
        e10 = math.floor(math.log10(value)) if value != 0.0 else 0
        if min_digits < e10 < max_digits:
            i_part = math.floor(value)
            f_part = math.floor((1 + value % 1) * 10.0 ** max_digits)
            i_str = str(i_part)
            f_str = cut_trail(str(f_part)[1:max_digits - e10])
            return i_str + "." + f_str
        else:
            m10 = value / 10.0 ** e10
            exp_str_len = 4
            i_part = math.floor(m10)
            f_part = math.floor((1 + m10 % 1) * 10.0 ** max_digits)
            i_str = str(i_part)
            f_str = cut_trail(str(f_part)[1:max_digits])
            e_str = str(e10)
            if e10 >= 0:
                e_str = "+" + e_str
            return i_str + "." + f_str + "e" + e_str


# @njit(fastmath=True, cache=True)
def denoised_arr2string(denoised_arr: np.ndarray) -> str:
    result = ''

    for i in range(denoised_arr.shape[0]):
        current_mlt = get_mlt(i)
        current_lat = get_magnetic_lat(i)
        result += float2str(current_mlt) + ' ' + float2str(current_lat) + ' ' + float2str(denoised_arr[i]) + '\n'

    return result


# @njit(fastmath=True, cache=True)
def denoise(data: str) -> str:
    arr = parse_array(data)

    denoised_data = ''

    for i in range(arr.shape[0]):
        values_in_window = [0.0]
        values_in_window.clear()
        current_mlt = get_mlt(i)
        current_lat = get_magnetic_lat(i)

        for delta_mlt in [-0.25, 0.0, 0.25]:
            for delta_lat in [-0.5, 0.0, 0.5]:
                new_mlt = current_mlt + delta_mlt
                new_lat = current_lat + delta_lat

                if new_mlt < 0:
                    new_mlt += 24

                if new_mlt > 23.75:
                    new_mlt -= 24

                new_index = get_geoinformation_data_unit_index(new_mlt, new_lat)

                if 0 <= new_index < arr.shape[0]:
                    values_in_window.append(arr[new_index])

        denoised_data += float2str(current_mlt) + ' ' + float2str(current_lat) \
                         + ' ' + float2str(np.median(np.array(values_in_window))) + '\n'

    return denoised_data

    # for key, value in ovation_prime_data_units_coordinates_and_values_dict.items():
    #     values_in_window = []
    #
    #     for delta_mlt in [-0.25, 0.0, 0.25]:
    #         for delta_lat in [-0.5, 0.0, 0.5]:
    #             new_mlt = str2float(key.split('#')[0]) + delta_mlt
    #             new_lat = str2float(key.split('#')[1]) + delta_lat
    #
    #             if new_mlt < 0:
    #                 new_mlt += 24
    #
    #             if new_mlt > 23.75:
    #                 new_mlt -= 24
    #
    #             new_key = str(new_mlt) + "#" + str(new_lat)
    #
    #             if new_key in ovation_prime_data_units_coordinates_and_values_dict:
    #                 values_in_window.append(ovation_prime_data_units_coordinates_and_values_dict[new_key])
    #
    #     # denoised_data += str(key[0]) + ' ' + str(key[1]) + ' ' + str(np.median(np.array(values_in_window))) + '\n'
    #     # denoised_data += str(key[0]) + ' ' + str(key[1]) + ' ' + str(value) + '\n'
    #
    # return data


def convert_coordinates_from_geographic_to_geomagnetic(geographic_coordinates, _datetime):
    # print(f'geographic_coordinates[0]: {geographic_coordinates[0]}')
    # print(f'geographic_coordinates[1]: {geographic_coordinates[1]}')

    magnetic_lat, magnetic_lon, _ \
        = aacgmv2.wrapper.convert_latlon(geographic_coordinates[0], geographic_coordinates[1], 0,
                                         _datetime, method_code='G2A')
    mlt = aacgmv2.wrapper.convert_mlt(magnetic_lon, _datetime, m2a=False)[0]

    return magnetic_lat, mlt


def get_first(cur):
    for i in cur:
        return i


def get_adjusted_datetime(_datetime: dt.datetime):
    datetime_variants = []

    previous_day = _datetime - dt.timedelta(days=1)
    datetime_variants.append(dt.datetime(
        previous_day.year,
        previous_day.month,
        previous_day.day,
        21,
        0,
        0
    ))

    for hour in range(0, 24, 3):
        current_datetime_variant = dt.datetime(
            _datetime.year,
            _datetime.month,
            _datetime.day,
            hour,
            0,
            0
        )
        datetime_variants.append(current_datetime_variant)

    next_day = _datetime + dt.timedelta(days=1)
    datetime_variants.append(dt.datetime(
        next_day.year,
        next_day.month,
        next_day.day,
        0,
        0,
        0
    ))

    nearest_datetime_one = datetime_variants[0]
    nearest_datetime_two = datetime_variants[-1]

    for datetime_variant in datetime_variants:
        if (datetime_variant < _datetime) \
                and (math.fabs((_datetime - datetime_variant).total_seconds())
                     < math.fabs((_datetime - nearest_datetime_one).total_seconds())):
            nearest_datetime_one = datetime_variant

        if (datetime_variant >= _datetime) \
                and (math.fabs((_datetime - datetime_variant).total_seconds())
                     < math.fabs((_datetime - nearest_datetime_two).total_seconds())):
            nearest_datetime_two = datetime_variant

    if math.fabs((_datetime - nearest_datetime_one).total_seconds()) \
            < math.fabs((_datetime - nearest_datetime_two).total_seconds()):
        return nearest_datetime_one, nearest_datetime_two
    else:
        return nearest_datetime_two, nearest_datetime_one


def get_descriptions(_datetime, cloudiness_list, min_lat, max_lat, min_lon, max_lon):
    cloudiness_geomagnetic_latitudes_description = ""
    cloudiness_mlts_description = ""
    cloudiness_values_description = ""

    start_time = time.time()

    for lat in np.arange(min_lat, max_lat + 0.25, 0.25):
        geographical_latitudes = np.ones((1440,)) * lat
        geographical_longitudes = np.arange(-179.75, 180 + 0.25, 0.25)
        geographical_altitudes = np.zeros((1440,))

        geomagnetic_latitudes, geomagnetic_longitudes, _ \
            = aacgmv2.wrapper.convert_latlon_arr(geographical_latitudes, geographical_longitudes,
                                                 geographical_altitudes, _datetime, method_code='G2A')
        mlts = aacgmv2.wrapper.convert_mlt(geomagnetic_longitudes, _datetime, m2a=False)

        for geomagnetic_latitude in geomagnetic_latitudes:
            cloudiness_geomagnetic_latitudes_description += str(geomagnetic_latitude) + " "
        cloudiness_geomagnetic_latitudes_description += "\n"

        for mlt in mlts:
            cloudiness_mlts_description += str(mlt) + " "
        cloudiness_mlts_description += "\n"

    for i in range(len(cloudiness_list)):
        for j in range(len(cloudiness_list[i])):
            cloudiness_values_description += str(cloudiness_list[i][j]) + " "
        cloudiness_values_description += "\n"

    elapsed = time.time() - start_time
    return cloudiness_geomagnetic_latitudes_description, \
        cloudiness_mlts_description, \
        cloudiness_values_description


def get_cloudiness_image_path_and_adjusted_datetime(_datetime: dt.datetime, north_horizon_flag: bool):
    nearest_datetime_one, nearest_datetime_two = get_adjusted_datetime(_datetime)
    horizon_side = "north" if north_horizon_flag else "south"
    cloudiness_image_path_one = get_cloudiness_image_path(horizon_side, nearest_datetime_one)
    cloudiness_image_path_two = get_cloudiness_image_path(horizon_side, nearest_datetime_two)
    adjusted_date_time = None
    searched_path = None

    try:
        cloudiness_image = Image.open(cloudiness_image_path_one)
        searched_path = cloudiness_image_path_one
        adjusted_date_time = nearest_datetime_one
    except FileNotFoundError:
        cloudiness_image = None

    if cloudiness_image is None:
        try:
            cloudiness_image = Image.open(cloudiness_image_path_two)
            searched_path = cloudiness_image_path_two
            adjusted_date_time = nearest_datetime_two
        except FileNotFoundError:
            cloudiness_image = None

    if cloudiness_image is None:
        return None, None
    else:
        return searched_path, adjusted_date_time


class CloudinessResponseUtil(View):
    def get(self, request):
        _datetime = get_datetime_from_str(request.GET['dateTime'])
        north_horizon_flag = request.GET['horizonSide'] == 'north'
        cloudiness_image_path, adjusted_datetime \
            = get_cloudiness_image_path_and_adjusted_datetime(_datetime, north_horizon_flag)

        # cloudiness_image_path = r"C:\Coding\final-qualifying-work_2023-2024\CloudinessDrawer\meteo-high-resolution\north\2023\07\27\2023-07-27 00-00-00.png"
        # adjusted_datetime = get_datetime_from_str("2023-07-27 00:00:00")
        # cloudiness_image_path = CLOUDINESS_IMAGE_PATH
        # adjusted_datetime = ADJUSTED_DATETIME

        cloudiness_mlt_rotation_angle = get_rotation_angle(adjusted_datetime, _datetime)

        if adjusted_datetime is None:
            return JsonResponse({
                "cloudinessBase64": "",
                "cloudinessDatetime": "",
                "cloudinessMltRotationAngle": "0"
            })
        else:
            with open(cloudiness_image_path, "rb") as image_file:
                encoded_string = base64.b64encode(image_file.read())
            return JsonResponse({
                "cloudinessBase64": encoded_string.decode('utf-8'),
                "cloudinessDatetime": adjusted_datetime,
                "cloudinessMltRotationAngle": str(cloudiness_mlt_rotation_angle)
            })


class DenoiseResponseUtil(View):
    def post(self, request):
        data = request.POST['data']
        # st = time.time()
        denoised_data = denoise(data)
        # et = time.time()
        # elapsed_time = et - st
        # print('Execution time:', elapsed_time * 1000, 'ms')

        # st = time.time()
        # arr = parse_array(data)
        # et = time.time()
        # elapsed_time = et - st
        # print('Execution time of parsing:', elapsed_time * 1000, 'ms')

        return JsonResponse({
            'data': denoised_data
        })


class TerminatorResponseUtil(View):
    def post(self, request):
        _datetime = get_datetime_from_str(request.POST['dateTime'])
        _50_magnetic_latitude_polygon_geographical_lat_lngs = None
        north_horizon_flag = request.POST['horizonSide'] == 'north'
        if north_horizon_flag:
            _50_magnetic_latitude_polygon_geographical_lat_lngs \
                = get_north_50_magnetic_latitude_polygon_vertices(_datetime)
        else:
            _50_magnetic_latitude_polygon_geographical_lat_lngs \
                = get_south_50_magnetic_latitude_polygon_vertices(_datetime)
        terminator_geographical_lat_lngs \
            = get_terminator_geographical_lat_lngs_from_string(request.POST['terminatorVerticesCoordinates'])

        polygon1 = Polygon(shapely.geometry.LineString(_50_magnetic_latitude_polygon_geographical_lat_lngs))
        polygon2 = Polygon(shapely.geometry.LineString(terminator_geographical_lat_lngs))
        intersection = polygon1.intersection(polygon2)

        magnetic_coordinates = ''

        if isinstance(intersection, shapely.geometry.polygon.Polygon):
            for coords in intersection.exterior.coords:
                magnetic_lat, magnetic_lon, _ \
                    = aacgmv2.wrapper.convert_latlon(coords[0], coords[1], 0, _datetime, method_code='G2A')
                mlt = aacgmv2.wrapper.convert_mlt(magnetic_lon, _datetime, m2a=False)[0]
                magnetic_coordinates += \
                    str(magnetic_lat if north_horizon_flag else -magnetic_lat) + ' ' + str(mlt) + '\n'
            magnetic_coordinates += '@'
        else:
            for cur_intersection in intersection.geoms:
                for coords in cur_intersection.exterior.coords:
                    magnetic_lat, magnetic_lon, _ \
                        = aacgmv2.wrapper.convert_latlon(coords[0], coords[1], 0, _datetime, method_code='G2A')
                    mlt = aacgmv2.wrapper.convert_mlt(magnetic_lon, _datetime, m2a=False)[0]
                    magnetic_coordinates += \
                        str(magnetic_lat if north_horizon_flag else -magnetic_lat) + ' ' + str(mlt) + '\n'
                magnetic_coordinates += '@'

        return JsonResponse({
            'magneticCoordinates': magnetic_coordinates
        })


def euclidean_dist(first_lat_lng, second_lat_lng):
    # print(
    #     f"euclidean_dist: {((first_lat_lng[0] - second_lat_lng[0]) ** 2 + (first_lat_lng[1] - second_lat_lng[1]) ** 2) ** 0.5}")
    return ((first_lat_lng[0] - second_lat_lng[0]) ** 2 + (first_lat_lng[1] - second_lat_lng[1]) ** 2) ** 0.5


def get_middle(first_lat_lng, second_lat_lng):
    lat = (first_lat_lng[0] + second_lat_lng[0]) / 2
    lng = (first_lat_lng[1] + second_lat_lng[1]) / 2 + 180

    return [lat, lng]


def get_continent_polygon_geographical_coordinates(line: str, remove_seam: bool) -> Polygon:
    continent_polygon_vertices_lat_lngs = []
    split_line = line.split(" ")
    while "\n" in split_line:
        split_line.remove("\n")
    while "" in split_line:
        split_line.remove("")

    for coordinates_representation in split_line:
        split_coordinates = coordinates_representation.split("#")
        continent_polygon_vertices_lat_lngs.append([float(split_coordinates[0]), float(split_coordinates[1])])

    return Polygon(shapely.geometry.LineString(continent_polygon_vertices_lat_lngs))


def get_continents_polygons_geographical_coordinates():
    continents_polygons = []

    f = open(CONTINENTS_PATH)
    remove_seam = True

    for line in f:
        if len(line) == 0:
            continue
        continents_polygons.append(get_continent_polygon_geographical_coordinates(line, remove_seam))
        remove_seam = False

    return continents_polygons


def rotate_list(l, n):
    d = deque(l)
    d.rotate(n)

    return list(d)


def find_leap(magnetic_lat_mlts):
    for i in range(0, len(magnetic_lat_mlts)):
        next_index = i + 1 if i + 1 < len(magnetic_lat_mlts) else -1
        dif = abs(magnetic_lat_mlts[i][0] - magnetic_lat_mlts[next_index][0])
        # print(f"dif = {dif}")
        if dif > 2.5:
            # print(f"i: {i}")
            # print(f"dif: {dif}")
            return i
    return 0


def get_rotation_angle(first_datetime, second_datetime):
    sample_lat = 70
    sample_lng = 100

    current_magnetic_lat, current_magnetic_lon, _ \
        = aacgmv2.wrapper.convert_latlon(sample_lat, sample_lng, 0, first_datetime, method_code='G2A')
    current_mlt = aacgmv2.wrapper.convert_mlt(current_magnetic_lon, first_datetime, m2a=False)[0]

    cloudiness_magnetic_lat, cloudiness_magnetic_lon, _ \
        = aacgmv2.wrapper.convert_latlon(sample_lat, sample_lng, 0, second_datetime, method_code='G2A')
    cloudiness_mlt = aacgmv2.wrapper.convert_mlt(cloudiness_magnetic_lon, second_datetime, m2a=False)[0]

    rotation_angle = current_mlt - cloudiness_mlt

    if rotation_angle >= 24:
        rotation_angle -= 24

    if rotation_angle < 0:
        rotation_angle += 24

    return rotation_angle


class ContinentsResponseUtil(View):
    def get(self, request):
        _datetime = get_datetime_from_str(request.GET['dateTime'])
        north_horizon_flag = request.GET['horizonSide'] == 'north'
        records = ContinentsBordersNorthRecord.objects.order_by('datetime') \
            if north_horizon_flag \
            else ContinentsBordersSouthRecord.objects.order_by('datetime')

        min_timedelta_total_seconds \
            = abs((_datetime - get_datetime_from_str(records[0].datetime)).total_seconds())
        searched_datetime = records[0].datetime
        searched_path = records[0].path

        for record in records:
            cur_time_delta_total_seconds \
                = abs((_datetime - get_datetime_from_str(record.datetime)).total_seconds())
            if cur_time_delta_total_seconds < min_timedelta_total_seconds:
                min_timedelta_total_seconds = cur_time_delta_total_seconds
                searched_datetime = record.datetime
                searched_path = record.path

        magnetic_coordinates = None
        rotation_angle = get_rotation_angle(_datetime, get_datetime_from_str(searched_datetime))

        with open(os.path.join(CONTINENTS_PREFIX_PATH, searched_path)) as f:
            magnetic_coordinates = f.read()

        return JsonResponse({
            'magneticCoordinates': magnetic_coordinates,
            'rotationAngle': rotation_angle
        })

        # _datetime = get_datetime_from_str(request.GET['dateTime'])
        # _50_magnetic_latitude_polygon_geographical_lat_lngs = None
        # north_horizon_flag = request.GET['horizonSide'] == 'north'
        # if north_horizon_flag:
        #     _50_magnetic_latitude_polygon_geographical_lat_lngs \
        #         = get_north_50_magnetic_latitude_polygon_vertices(_datetime)
        # else:
        #     _50_magnetic_latitude_polygon_geographical_lat_lngs \
        #         = get_south_50_magnetic_latitude_polygon_vertices(_datetime)
        # polygon_50_magnetic_latitude_geographical_lat_lngs \
        #     = Polygon(shapely.geometry.LineString(_50_magnetic_latitude_polygon_geographical_lat_lngs))
        # continents_polygons_geographical_coordinates = get_continents_polygons_geographical_coordinates()
        #
        # magnetic_coordinates = ""
        # # flag = True
        #
        # i = -1
        # magnetic_lat_mlts_1 = None
        # for current_continent_polygon_geographical_coordinates in continents_polygons_geographical_coordinates:
        #     current_intersection \
        #         = polygon_50_magnetic_latitude_geographical_lat_lngs \
        #         .intersection(current_continent_polygon_geographical_coordinates)
        #
        #     # print(type(current_intersection))
        #
        #     if str(current_intersection) == "POLYGON EMPTY":
        #         continue
        #
        #     i += 1
        #
        #     # if north_horizon_flag and i == 1:
        #     #     continue
        #
        #     if isinstance(current_intersection, shapely.geometry.polygon.Polygon):
        #         # print(str(current_intersection))
        #         magnetic_lat_mlts = []
        #         for coords in current_intersection.exterior.coords:
        #             magnetic_lat, magnetic_lon, _ \
        #                 = aacgmv2.wrapper.convert_latlon(coords[0], coords[1], 0, _datetime, method_code='G2A')
        #             mlt = aacgmv2.wrapper.convert_mlt(magnetic_lon, _datetime, m2a=False)[0]
        #             magnetic_lat_mlts.append([magnetic_lat if north_horizon_flag else -magnetic_lat, mlt])
        #             # magnetic_coordinates += \
        #             #     str(magnetic_lat if north_horizon_flag else -magnetic_lat) + ' ' + str(mlt) + '\n'
        #         if not north_horizon_flag and i == 0:
        #             # print(len(magnetic_lat_mlts))
        #             # del magnetic_lat_mlts[-5:-100:-1]
        #             magnetic_lat_mlts = deque(magnetic_lat_mlts)
        #             magnetic_lat_mlts.rotate(10)
        #             magnetic_lat_mlts = list(magnetic_lat_mlts)
        #             del magnetic_lat_mlts[9:12]
        #         if north_horizon_flag and i == 0:
        #             magnetic_lat_mlts_1 = magnetic_lat_mlts
        #         if north_horizon_flag and i == 1:
        #             # del magnetic_lat_mlts[0]
        #             # print('here:')
        #             # print(rotate_list(magnetic_lat_mlts_1, -find_leap(magnetic_lat_mlts_1))[0][0]
        #             #       - rotate_list(magnetic_lat_mlts_1, -find_leap(magnetic_lat_mlts_1))[0][-1])
        #             magnetic_lat_mlts = rotate_list(magnetic_lat_mlts_1, -find_leap(magnetic_lat_mlts_1) - 1) \
        #                                 + rotate_list(magnetic_lat_mlts, 59)  # 291
        #         if not (north_horizon_flag and i == 0):
        #             for magnetic_lat_mlt in magnetic_lat_mlts:
        #                 # print(magnetic_lat_mlt)
        #                 magnetic_coordinates += str(magnetic_lat_mlt[0]) + ' ' + str(magnetic_lat_mlt[1]) + '\n'
        #         magnetic_coordinates += '@'
        #     elif isinstance(current_intersection, shapely.geometry.collection.GeometryCollection):
        #         for geometry_object in current_intersection.geoms:
        #             if isinstance(geometry_object, shapely.geometry.linestring.LineString):
        #                 for coords in geometry_object.coords:
        #                     magnetic_lat, magnetic_lon, _ \
        #                         = aacgmv2.wrapper.convert_latlon(coords[0], coords[1], 0, _datetime, method_code='G2A')
        #                     mlt = aacgmv2.wrapper.convert_mlt(magnetic_lon, _datetime, m2a=False)[0]
        #                     magnetic_coordinates += \
        #                         str(magnetic_lat if north_horizon_flag else -magnetic_lat) + ' ' + str(mlt) + '\n'
        #                 magnetic_coordinates += '@'
        #             else:
        #                 for coords in geometry_object.exterior.coords:
        #                     magnetic_lat, magnetic_lon, _ \
        #                         = aacgmv2.wrapper.convert_latlon(coords[0], coords[1], 0, _datetime, method_code='G2A')
        #                     mlt = aacgmv2.wrapper.convert_mlt(magnetic_lon, _datetime, m2a=False)[0]
        #                     magnetic_coordinates += \
        #                         str(magnetic_lat if north_horizon_flag else -magnetic_lat) + ' ' + str(mlt) + '\n'
        #                 magnetic_coordinates += '@'
        #     else:
        #         for cur_intersection in current_intersection.geoms:
        #             for coords in cur_intersection.exterior.coords:
        #                 magnetic_lat, magnetic_lon, _ \
        #                     = aacgmv2.wrapper.convert_latlon(coords[0], coords[1], 0, _datetime, method_code='G2A')
        #                 mlt = aacgmv2.wrapper.convert_mlt(magnetic_lon, _datetime, m2a=False)[0]
        #                 magnetic_coordinates += \
        #                     str(magnetic_lat if north_horizon_flag else -magnetic_lat) + ' ' + str(mlt) + '\n'
        #             magnetic_coordinates += '@'
        #
        # return JsonResponse({
        #     'magneticCoordinates': magnetic_coordinates
        # })


class RotationAngleResponseUtil(View):
    def get(self, request):
        current_datetime = get_datetime_from_str(request.GET['currentDatetime'])
        cloudiness_datetime = get_datetime_from_str(request.GET['cloudinessDatetime'])
        horizon_side = request.GET['horizonSide']

        sample_lat = 70 if horizon_side == 'north' else -70
        sample_lng = 100

        current_magnetic_lat, current_magnetic_lon, _ \
            = aacgmv2.wrapper.convert_latlon(sample_lat, sample_lng, 0, current_datetime, method_code='G2A')
        current_mlt = aacgmv2.wrapper.convert_mlt(current_magnetic_lon, current_datetime, m2a=False)[0]

        cloudiness_magnetic_lat, cloudiness_magnetic_lon, _ \
            = aacgmv2.wrapper.convert_latlon(sample_lat, sample_lng, 0, cloudiness_datetime, method_code='G2A')
        cloudiness_mlt = aacgmv2.wrapper.convert_mlt(cloudiness_magnetic_lon, cloudiness_datetime, m2a=False)[0]

        rotation_angle = cloudiness_mlt - current_mlt

        if rotation_angle < 0:
            rotation_angle += 24

        return JsonResponse({
            'rotationAngle': rotation_angle
        })


class NamedGeographicalPoint:
    def __init__(self, name: str, lat: float, lng: float):
        self.name = name
        self.lat = lat
        self.lng = lng
        self.magnetic_lat = None
        self.mlt = None

    def compute_geomagnetic_coordinates(self, _datetime: dt.datetime):
        self.magnetic_lat, self.mlt \
            = convert_coordinates_from_geographic_to_geomagnetic(
            [self.lat, self.lng], _datetime)

    @staticmethod
    def parse(line: str):
        split_line = line.split(' ')
        return NamedGeographicalPoint(split_line[0], float(split_line[1]), float(split_line[2]))

    def to_string(self):
        return f'{self.name} {self.magnetic_lat} {self.mlt}'


class CitiesResponseUtil(View):
    def get(self, request):
        if request.GET['hemisphere'] != 'north':
            return JsonResponse({
                'citiesDescription': ''
            })

        _datetime = get_datetime_from_str(request.GET['dateTime'])

        file = open(CITIES_PATH, 'r', encoding="utf-8")
        lines = file.readlines()
        file.close()

        cities_description = ''

        for line in lines:
            named_geographical_point = NamedGeographicalPoint.parse(line)
            named_geographical_point.compute_geomagnetic_coordinates(_datetime)

            cities_description += named_geographical_point.to_string() + '\n'

        return JsonResponse({
            'citiesDescription': cities_description
        })


class ExtendedFunctionality1Class:
    def __init__(self, source_name: str,
                 source_lat: float, source_lng: float,
                 first_point_list, second_point_list):
        self.source = NamedGeographicalPoint(source_name, source_lat, source_lng)
        self.first_point_list = first_point_list
        self.second_point_list = second_point_list

        self.first_geomagnetic_coordinates_list = []
        self.second_geomagnetic_coordinates_list = []

    @staticmethod
    def parse(line: str):
        split_line = line.split('|')
        source = NamedGeographicalPoint.parse(split_line[0])

        first_point_list = []
        first_point_list_raw = split_line[1].split(' ')

        for current in first_point_list_raw:
            split_current = current.split('#')
            first_point_list.append((float(split_current[0]), float(split_current[1])))

        second_point_list = []
        second_point_list_raw = split_line[2].split(' ')

        for current in second_point_list_raw:
            split_current = current.split('#')

            if split_current == ['\n']:
                continue

            second_point_list.append((float(split_current[0]), float(split_current[1])))

        return ExtendedFunctionality1Class(source.name,
                                           source.lat,
                                           source.lng,
                                           first_point_list,
                                           second_point_list)

    def compute_geomagnetic_coordinates(self, _datetime: dt.datetime):
        self.source.compute_geomagnetic_coordinates(_datetime)

        for geographical_coordinates in self.first_point_list:
            current_magnetic_lat, current_mlt \
                = convert_coordinates_from_geographic_to_geomagnetic(geographical_coordinates, _datetime)
            self.first_geomagnetic_coordinates_list.append((current_magnetic_lat, current_mlt))

        for geographical_coordinates in self.second_point_list:
            current_magnetic_lat, current_mlt \
                = convert_coordinates_from_geographic_to_geomagnetic(geographical_coordinates, _datetime)
            self.second_geomagnetic_coordinates_list.append((current_magnetic_lat, current_mlt))

    def to_string(self):
        source_representation = self.source.to_string()

        first_geomagnetic_coordinates_list_representation = ''

        for current in self.first_geomagnetic_coordinates_list:
            first_geomagnetic_coordinates_list_representation += f'{current[0]}#{current[1]} '

        second_geomagnetic_coordinates_list_representation = ''

        for current in self.second_geomagnetic_coordinates_list:
            second_geomagnetic_coordinates_list_representation += f'{current[0]}#{current[1]} '

        return (source_representation
                + '|'
                + first_geomagnetic_coordinates_list_representation
                + '|'
                + second_geomagnetic_coordinates_list_representation)


class ExtendedFunctionality1ResponseUtil(View):
    def get(self, request):
        # if request.GET['hemisphere'] != 'north':
        #     return JsonResponse({
        #         'description': ''
        #     })
        #
        # _datetime = get_datetime_from_str(request.GET['dateTime'])
        #
        # file = open('radar-stations.txt', 'r', encoding="utf-8")
        # lines = file.readlines()
        # file.close()
        #
        # description = ''
        #
        # for line in lines:
        #     extended_1 = ExtendedFunctionality1Class.parse(line)
        #     extended_1.compute_geomagnetic_coordinates(_datetime)
        #
        #     description += extended_1.to_string() + '\n'
        #
        # return JsonResponse({
        #     'description': description
        # })
        return JsonResponse({})


class TotalMltRotationAngleResponseUtil(View):
    def get(self, request):
        _datetime = get_datetime_from_str(request.GET['dateTime'])
        # print('Orange')
        # print(request.GET)
        horizon_side = request.GET['horizonSide']
        geographic_lat_lon = [55.4424 if horizon_side == 'north' else -55.4424, 37.3636]
        _, mlt = convert_coordinates_from_geographic_to_geomagnetic(
            geographic_lat_lon, _datetime)

        mlt_rotation_angle = mlt - 20

        if mlt_rotation_angle < 0:
            mlt_rotation_angle += 24

        return JsonResponse({
            'mltRotationAngle': str(mlt_rotation_angle)
        })
