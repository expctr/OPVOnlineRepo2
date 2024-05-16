# В данном файле содержится описание классов и функций для обработки клиентских запросов
# при работе страницы 3D визуализаци.

from django.http import HttpResponse, HttpResponseBadRequest
from django.template.loader import render_to_string
from django.views import View
from django.http import JsonResponse

import sqlite3
import aacgmv2
import datetime as dt
import numpy as np
from opv_3d.file_type_index import FileTypeIndex
import os
import math

from opv_3d.second_forecast import get_second_forecast_params

from opv_3d.paths import DATABASE_PATH


# from numba import njit

# ------------------------------------------------------------------------

# DATABASE_PATH = r'..\OPVOnline\db.sqlite3'


# ------------------------------------------------------------------------

def main_view(request):
    response = render_to_string('opv_3d/index.html')
    return HttpResponse(response)


def convert_datetime_to_str(_datetime: dt.datetime) -> str:
    second = '00'
    return (f"{_datetime.year}-{_datetime.month:02}-{_datetime.day:02} "
            f"{_datetime.hour:02}:{_datetime.minute:02}:{second}")


def get_datetime_from_str(datetime_str) -> dt.datetime:
    return dt.datetime(
        int(datetime_str[0:4]),
        int(datetime_str[5:7]),
        int(datetime_str[8:10]),
        int(datetime_str[11:13]),
        int(datetime_str[14:16])
    )


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
                = aacgmv2.wrapper.convert_latlon(
                magnetic_lat,
                magnetic_lon,
                1000,
                _datetime,
                method_code='A2G'
            )

            if south_flag:
                geographical_lat *= -1

            d[(mlt, magnetic_lat)] \
                = (geographical_lat, geographical_lon, geographical_alt, value)

    for mlt in np.arange(0.0, 24.0, 0.25):
        magnetic_lat = float(90.0)
        value = -1

        magnetic_lon \
            = aacgmv2.wrapper.convert_mlt([mlt], _datetime, m2a=True)[0]

        geographical_lat, geographical_lon, geographical_alt \
            = aacgmv2.wrapper.convert_latlon(
            magnetic_lat,
            magnetic_lon,
            1000,
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
            second_point_magnetic = (increase_mlt(mlt), magnetic_lat)
            third_point_magnetic = (increase_mlt(mlt), magnetic_lat + 0.5)
            fourth_point_magnetic = (mlt, magnetic_lat + 0.5)

            first_point_geographic = coordinates_dict[first_point_magnetic]
            second_point_geographic = coordinates_dict[second_point_magnetic]
            third_point_geographic = coordinates_dict[third_point_magnetic]
            fourth_point_geographic = coordinates_dict[fourth_point_magnetic]

            _3d_units_description \
                += (f'{first_point_geographic[0]} {first_point_geographic[1]} '
                    f'{second_point_geographic[0]} {second_point_geographic[1]} '
                    f'{third_point_geographic[0]} {third_point_geographic[1]} '
                    f'{fourth_point_geographic[0]} {fourth_point_geographic[1]} '
                    f'{first_point_geographic[2]} '
                    f'{first_point_geographic[3]} '
                    f'{first_point_magnetic[0]} {first_point_magnetic[1]}'
                    f'\n')

    return _3d_units_description


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


databaseTablesNames = [
    'opv_3d_northforecastdiffuserecord',
    'opv_3d_northforecastionsrecord',
    'opv_3d_northforecastmonorecord',
    'opv_3d_northforecasttotalrecord',
    'opv_3d_northforecastwaverecord',
    'opv_3d_northnowcastdiffuserecord',
    'opv_3d_northnowcastionsrecord',
    'opv_3d_northnowcastmonorecord',
    'opv_3d_northnowcasttotalrecord',
    'opv_3d_northnowcastwaverecord',
    'opv_3d_southforecastdiffuserecord',
    'opv_3d_southforecastionsrecord',
    'opv_3d_southforecastmonorecord',
    'opv_3d_southforecasttotalrecord',
    'opv_3d_southforecastwaverecord',
    'opv_3d_southnowcastdiffuserecord',
    'opv_3d_southnowcastionsrecord',
    'opv_3d_southnowcastmonorecord',
    'opv_3d_southnowcasttotalrecord',
    'opv_3d_southnowcastwaverecord',
]

secondDatabaseTablesNames = [
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


# def get_file_datetime(filename: str) -> str:
#     year = filename[0:4]
#     month = filename[4:6]
#     day = filename[6:8]
#     hour = filename[9:11]
#     minute = filename[11:13]
#     second = '00'
#     return f"{year}-{month}-{day} {hour}:{minute}:{second}"


def merge_files_data(path_3d: str, path_2d: str):
    merged_data = ""

    with open(path_3d, 'r') as file_3d:
        lines_3d = file_3d.read().split('\n')

    with open(path_2d, 'r') as file_2d:
        lines_2d = file_2d.read().split('\n')

    if lines_3d[-1] == '':
        lines_3d = lines_3d[:-1]

    for index_and_line_3d in enumerate(lines_3d):
        merged_line = lines_2d[index_and_line_3d[0] + 5] + ' ' + index_and_line_3d[1] + '\n'
        merged_data += merged_line

    return merged_data


def get_data_from_file(path: str, _datetime: dt.datetime, file_type_index) -> str:
    # coordinates_dict = get_coordinates_dict(path, _datetime, south_flag)
    # units_description = get_3d_units_description(coordinates_dict)

    conn = sqlite3.connect(DATABASE_PATH)
    cur = conn.cursor()

    cur.execute(
        f"SELECT path FROM {secondDatabaseTablesNames[file_type_index]} "
        f"WHERE datetime = '{convert_datetime_to_str(_datetime)}';")
    tmp = cur.fetchone()
    path_2d = tmp[0]

    merge_result = merge_files_data(path, path_2d)

    return merge_result


class LastFileDataAndFilesNumberResponseUtil(View):
    def get(self, request):
        conn = sqlite3.connect(DATABASE_PATH)
        cur = conn.cursor()

        if request.GET.get('filesType') is None:
            return HttpResponseBadRequest()

        file_type_index = get_file_type_index(request.GET['filesType'])

        if file_type_index == FileTypeIndex.UNKNOWN:
            return HttpResponseBadRequest()

        files_type = request.GET['filesType']
        south_flag = files_type.split(' ')[0] == 'south'

        cur.execute(
            f'SELECT path, datetime FROM {databaseTablesNames[file_type_index]} ORDER BY datetime DESC '
            f'LIMIT 1;')
        tmp = cur.fetchone()
        path = tmp[0]
        _datetime = get_datetime_from_str(tmp[1])

        cur.execute(f'SELECT COUNT(*) FROM {databaseTablesNames[file_type_index]};')
        tmp = cur.fetchone()
        files_number = tmp[0]

        return JsonResponse({
            'filesNumber': str(files_number),
            'data': get_data_from_file(path, _datetime, file_type_index),
            'fileName': os.path.split(path)[-1],
            'fileDateTime': _datetime
        })


class CertainFileDataResponseUtil(View):
    def get(self, request):
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
        south_flag = request.GET['filesType'].split(' ')[0] == 'south'

        if file_type_index == FileTypeIndex.UNKNOWN:
            return HttpResponseBadRequest()

        conn = sqlite3.connect(DATABASE_PATH)
        cur = conn.cursor()

        cur.execute(f'SELECT path, datetime FROM {databaseTablesNames[file_type_index]} ORDER BY datetime')
        tmp = cur.fetchall()

        if file_index > len(tmp) - 1:
            return HttpResponseBadRequest()

        record = tmp[file_index]

        path = record[0]
        _datetime = get_datetime_from_str(record[1])

        return JsonResponse({'data': get_data_from_file(path, _datetime, file_type_index),
                             'fileName': os.path.split(path)[-1],
                             'fileDateTime': _datetime})


class FilesNumberAndFileDataByDatetimeResponseUtil(View):
    def get(self, request):
        if request.GET.get('filesType') is None:
            return HttpResponseBadRequest()

        if request.GET.get('inputFileDateTime') is None:
            return HttpResponseBadRequest()

        file_type_index = get_file_type_index(request.GET['filesType'])
        south_flag = request.GET['filesType'].split(' ')[0] == 'south'

        if file_type_index == FileTypeIndex.UNKNOWN:
            return HttpResponseBadRequest()

        conn = sqlite3.connect(DATABASE_PATH)
        cur = conn.cursor()

        # records = self.recordAccessDelegates[file_type_index]('datetime')
        cur.execute(f'SELECT path, datetime FROM {databaseTablesNames[file_type_index]};')
        input_file_datetime_str = request.GET['inputFileDateTime']
        input_file_date_time = get_datetime_from_str(input_file_datetime_str)
        records = cur.fetchall()
        min_timedelta_total_seconds \
            = abs((input_file_date_time - get_datetime_from_str(records[0][1])).total_seconds())
        searched_index = 0

        for i in range(len(records)):
            cur_time_delta_total_seconds \
                = abs((input_file_date_time - get_datetime_from_str(records[i][1])).total_seconds())
            if cur_time_delta_total_seconds < min_timedelta_total_seconds:
                min_timedelta_total_seconds = cur_time_delta_total_seconds
                searched_index = i

        files_number = len(records)

        return JsonResponse({
            'filesNumber': str(files_number),
            'data': get_data_from_file(records[searched_index][0],
                                       get_datetime_from_str(records[searched_index][1]),
                                       file_type_index),
            'fileName': os.path.split(records[searched_index][0])[-1],
            'fileIndex': str(searched_index),
            'fileDateTime': records[searched_index][1]
        })


class FileDataByDatetimeResponseUtil(View):
    def get(self, request):
        if request.GET.get('filesType') is None:
            return HttpResponseBadRequest()

        if request.GET.get('inputFileDateTime') is None:
            return HttpResponseBadRequest()

        file_type_index = get_file_type_index(request.GET['filesType'])
        south_flag = request.GET['filesType'].split(' ')[0] == 'south'

        if file_type_index == FileTypeIndex.UNKNOWN:
            return HttpResponseBadRequest()

        # records = self.recordAccessDelegates[file_type_index]('datetime')
        conn = sqlite3.connect(DATABASE_PATH)
        cur = conn.cursor()
        cur.execute(f'SELECT path, datetime FROM {databaseTablesNames[file_type_index]};')
        records = cur.fetchall()

        input_file_datetime_str = request.GET['inputFileDateTime']
        input_file_date_time = get_datetime_from_str(input_file_datetime_str)

        min_timedelta_total_seconds \
            = abs((input_file_date_time - get_datetime_from_str(records[0][1])).total_seconds())
        searched_index = 0

        for i in range(len(records)):
            cur_time_delta_total_seconds \
                = abs((input_file_date_time - get_datetime_from_str(records[i][1])).total_seconds())
            if cur_time_delta_total_seconds < min_timedelta_total_seconds:
                min_timedelta_total_seconds = cur_time_delta_total_seconds
                searched_index = i

        return JsonResponse({'data': get_data_from_file(records[searched_index][0],
                                                        get_datetime_from_str(records[searched_index][1]),
                                                        file_type_index),
                             'fileName': os.path.split(records[searched_index][0])[-1],
                             'fileIndex': str(searched_index),
                             'fileDateTime': records[searched_index][1]})


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

        mlt = str2float(split_row[10])
        geomagnetic_lat = str2float(split_row[11])
        value = str2float(split_row[9])

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
    split_data = data.split('\n')
    units = {}

    for cur in split_data:
        if len(cur) == 0:
            continue
        current_unit = GeoinformationData3DUnit.parse(cur)
        units[(current_unit.first_point_mlt, current_unit.first_point_magnetic_lat)] \
            = current_unit

    arr = np.zeros(7680, dtype=float)

    for unit in units.values():
        index \
            = get_geoinformation_data_unit_index(
            unit.first_point_mlt, unit.first_point_magnetic_lat)
        arr[index] = unit.value

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

        units[(current_mlt, current_lat)].value = np.median(np.array(values_in_window))
        denoised_data += units[(current_mlt, current_lat)].to_string() + '\n'

    return denoised_data


class GeoinformationData3DUnit:
    def __init__(
            self,
            first_point_mlt,
            first_point_magnetic_lat,
            value,
            first_point_geographical_lat,
            first_point_geographical_lon
    ):
        self.first_point_mlt = first_point_mlt
        self.first_point_magnetic_lat = first_point_magnetic_lat
        self.value = value
        self.first_point_geographical_lat = first_point_geographical_lat
        self.first_point_geographical_lon = first_point_geographical_lon

    @staticmethod
    def parse(description: str):
        split_description = description.split(' ')

        while '' in split_description:
            split_description.remove('')

        return GeoinformationData3DUnit(
            float(split_description[0]),
            float(split_description[1]),
            float(split_description[2]),
            float(split_description[3]),
            float(split_description[4]),
        )

    def to_string(self) -> str:
        return (f"{self.first_point_mlt} "
                f"{self.first_point_magnetic_lat} "
                f"{self.value} "
                f"{self.first_point_geographical_lat} "
                f"{self.first_point_geographical_lon} "
                )


class DenoiseResponseUtil(View):
    def post(self, request):
        data = request.POST['data']
        denoised_data = denoise(data)

        return JsonResponse({
            'data': denoised_data
        })


class SecondForecastResponseUtil3D(View):
    def get(self, request):
        data, _datetime, filename = get_second_forecast_params()

        return JsonResponse({
            'filesNumber': '1',
            'data': data,
            'fileName': filename,
            'fileDateTime': _datetime
        })
