# В данном классе содержится функционал для рисования облачности.

import datetime
import os
import sys
import datetime as dt
import numpy as np
import aacgmv2
import time
import pymysql
import math
import json

from cloudiness_cell import CloudinessCell
from display import Display


THIS_FILENAME = "drawing.py"

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


def get_cloudiness_cells_values(_datetime: dt.datetime, north_horizon_flag: bool):
    meteo_conn = pymysql.connect(
        user="reader",
        password="sNN942PhPI",
        host="193.232.6.63",
        port=3306,
        database="meteo"
    )

    nearest_datetime_one, nearest_datetime_two = get_adjusted_datetime(_datetime)
    partial_table_name = 'arctic' if north_horizon_flag else 'antarctic'

    cur = meteo_conn.cursor()

    try:
        cur.execute(
            f"SELECT UNCOMPRESS(grid) FROM {partial_table_name}_TCDC_{_datetime.year} WHERE dt='{nearest_datetime_one}';")
    except Exception:
        return None, None

    adjusted_datetime = nearest_datetime_one
    first_cur = get_first(cur)

    if first_cur is None:
        try:
            cur.execute(
                f"SELECT UNCOMPRESS(grid) FROM {partial_table_name}_TCDC_{_datetime.year} WHERE dt='{nearest_datetime_two}';")
        except Exception:
            return None, None

        adjusted_datetime = nearest_datetime_two
        first_cur = get_first(cur)

    if first_cur is None:
        return None, None

    cloudiness_list = json.loads(first_cur[0])['data']

    cloudiness_cells_description = ""

    for i in range(len(cloudiness_list)):
        for j in range(len(cloudiness_list[i])):
            cloudiness_cells_description += str(cloudiness_list[i][j]) + " "
        cloudiness_cells_description += "\n"

    return cloudiness_cells_description, adjusted_datetime


def get_drawing_data(_datetime, horizon_side):
    north_horizon_flag = horizon_side == 'north'
    cloudiness_cells_values, adjusted_datetime \
        = get_cloudiness_cells_values(_datetime, north_horizon_flag)

    if adjusted_datetime is None:
        return None, None

    return cloudiness_cells_values, adjusted_datetime


def parse_cloudiness_geomagnetic_coordinates(
        cloudiness_cells_geomagnetic_coordinates_data: str):
    if cloudiness_cells_geomagnetic_coordinates_data == "":
        return None

    cloudiness_cells_geomagnetic_coordinates = []
    rows = cloudiness_cells_geomagnetic_coordinates_data.split('\n')
    while '' in rows:
        rows.remove('')

    for i in range(len(rows)):
        split_row = rows[i].split(" ")
        while '' in split_row:
            split_row.remove('')
        new_row = []

        for j in range(len(split_row)):
            geomagnetic_coordinates = split_row[j].split('#')
            geomagnetic_latitude = abs(float(geomagnetic_coordinates[0]))
            mlt = float(geomagnetic_coordinates[1])

            new_row.append((geomagnetic_latitude, mlt))

        cloudiness_cells_geomagnetic_coordinates.append(new_row)

    return cloudiness_cells_geomagnetic_coordinates


def parse_cloudiness_cells_values(cloudiness_cells_value_data: str):
    if cloudiness_cells_value_data == "":
        return None

    cloudiness_cells_values = []
    rows = cloudiness_cells_value_data.split('\n')
    while '' in rows:
        rows.remove('')

    for i in range(len(rows)):
        split_row = rows[i].split(' ')
        while '' in split_row:
            split_row.remove('')
        new_row = []

        for j in range(len(split_row)):
            cloudiness_vell_value = float(split_row[j])
            new_row.append(cloudiness_vell_value)

        cloudiness_cells_values.append(new_row)

    return cloudiness_cells_values


# def get_mlt_rotation_angle(current_datetime, cloudiness_datetime):
#     sample_lat = 70
#     sample_lng = 100
#
#     current_magnetic_lat, current_magnetic_lon, _ \
#         = aacgmv2.wrapper.convert_latlon(sample_lat, sample_lng, 0, current_datetime, method_code='G2A')
#     current_mlt = aacgmv2.wrapper.convert_mlt(current_magnetic_lon, current_datetime, m2a=False)[0]
#
#     cloudiness_magnetic_lat, cloudiness_magnetic_lon, _ \
#         = aacgmv2.wrapper.convert_latlon(sample_lat, sample_lng, 0, cloudiness_datetime, method_code='G2A')
#     cloudiness_mlt = aacgmv2.wrapper.convert_mlt(cloudiness_magnetic_lon, cloudiness_datetime, m2a=False)[0]
#
#     rotation_angle = cloudiness_mlt - current_mlt
#
#     if rotation_angle < 0:
#         rotation_angle += 24
#
#     return rotation_angle


def get_cloudiness_cell_color(cloudiness_cell_value):
    return 220, 220, 220, round(cloudiness_cell_value / 100 * 255)


def draw(current_datetime,
         horizon_side,
         path,
         cloudiness_cells_geomagnetic_coordinates_data):
    cloudiness_cells_values_data, adjusted_datetime = get_drawing_data(current_datetime, horizon_side)
    cloudiness_cells_geomagnetic_coordinates = parse_cloudiness_geomagnetic_coordinates(
        cloudiness_cells_geomagnetic_coordinates_data)
    cloudiness_cells_values = parse_cloudiness_cells_values(cloudiness_cells_values_data)
    # mlt_rotation_angle = get_mlt_rotation_angle(current_datetime, adjusted_datetime)

    display = Display()

    for i in range(len(cloudiness_cells_geomagnetic_coordinates))[:-1]:
        for j in range(len(cloudiness_cells_geomagnetic_coordinates[i])):
            next_j_adjusted = (j + 1) if (j + 1 < len(cloudiness_cells_geomagnetic_coordinates[i])) else 0

            first_cloudiness_cell_vertex = cloudiness_cells_geomagnetic_coordinates[i][j]
            second_cloudiness_cell_vertex = cloudiness_cells_geomagnetic_coordinates[i + 1][j]
            third_cloudiness_cell_vertex = cloudiness_cells_geomagnetic_coordinates[i + 1][next_j_adjusted]
            fourth_cloudiness_cell_vertex = cloudiness_cells_geomagnetic_coordinates[i][next_j_adjusted]
            cloudiness_cell_value = cloudiness_cells_values[i][j]

            if first_cloudiness_cell_vertex[0] < 50 \
                    or second_cloudiness_cell_vertex[0] < 50 \
                    or third_cloudiness_cell_vertex[0] < 50 \
                    or fourth_cloudiness_cell_vertex[0] < 50:
                continue

            first_cloudiness_cell = CloudinessCell(
                first_cloudiness_cell_vertex[0],
                first_cloudiness_cell_vertex[1]
            )
            second_cloudiness_cell = CloudinessCell(
                second_cloudiness_cell_vertex[0],
                second_cloudiness_cell_vertex[1]
            )
            third_cloudiness_cell = CloudinessCell(
                third_cloudiness_cell_vertex[0],
                third_cloudiness_cell_vertex[1]
            )
            fourth_cloudiness_call = CloudinessCell(
                fourth_cloudiness_cell_vertex[0],
                fourth_cloudiness_cell_vertex[1]
            )

            display.fill_tetragon(
                first_cloudiness_cell.get_standard_x(
                    display.width
                ),
                first_cloudiness_cell.get_standard_y(
                    display.width
                ),
                second_cloudiness_cell.get_standard_x(
                    display.width
                ),
                second_cloudiness_cell.get_standard_y(
                    display.width
                ),
                third_cloudiness_cell.get_standard_x(
                    display.width
                ),
                third_cloudiness_cell.get_standard_y(
                    display.width
                ),
                fourth_cloudiness_call.get_standard_x(
                    display.width
                ),
                fourth_cloudiness_call.get_standard_y(
                    display.width
                ),
                get_cloudiness_cell_color(cloudiness_cell_value)
            )

    display.save(path)
