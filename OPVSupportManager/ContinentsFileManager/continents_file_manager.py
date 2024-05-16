# В этом файле содержится функционал для создания файлов с геомагнинтными координатами границ
# континентов. Кроме того, код в данном файле заносит информацию о созданных файлах в БД.

import sqlite3
import aacgmv2
import datetime as dt
import numpy as np
from shapely.geometry import Polygon
import shapely
from collections import deque
import calendar
import os
import sys

current = os.path.dirname(os.path.realpath(__file__))
parent = os.path.dirname(current)
sys.path.append(parent)

from paths import (CONTINENTS_ROOT,
                   CONTINENTS_PATH,
                   DATABASE_PATH)

# --------------------------------------------------------------------------

# ROOT = r"continents"
# CONTINENTS_PATH = r"..\..\OPVOnline\continents.txt"
# DATABASE_PATH = r'..\..\OPVOnline\db.sqlite3'
DATABASE_TABLE_NAME_CONTINENTS_BORDERS_NORTH = "opv_2d_continentsbordersnorthrecord"
DATABASE_TABLE_NAME_CONTINENTS_BORDERS_SOUTH = "opv_2d_continentsborderssouthrecord"

THIS_FILENAME = "continents_file_manager.py"


# --------------------------------------------------------------------------


def get_datetime_from_str(datetime_str) -> dt.datetime:
    return dt.datetime(
        int(datetime_str[0:4]),
        int(datetime_str[5:7]),
        int(datetime_str[8:10]),
        int(datetime_str[11:13]),
        int(datetime_str[14:16])
    )


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


def rotate_list(l, n):
    d = deque(l)
    d.rotate(n)

    return list(d)


def find_leap(magnetic_lat_mlts):
    for i in range(0, len(magnetic_lat_mlts)):
        next_index = i + 1 if i + 1 < len(magnetic_lat_mlts) else -1
        dif = abs(magnetic_lat_mlts[i][0] - magnetic_lat_mlts[next_index][0])
        if dif > 2.5:
            return i
    return 0


def create_file(_datetime: dt, horizon_side):
    _50_magnetic_latitude_polygon_geographical_lat_lngs = None
    north_horizon_flag = horizon_side == 'north'
    if north_horizon_flag:
        _50_magnetic_latitude_polygon_geographical_lat_lngs \
            = get_north_50_magnetic_latitude_polygon_vertices(_datetime)
    else:
        _50_magnetic_latitude_polygon_geographical_lat_lngs \
            = get_south_50_magnetic_latitude_polygon_vertices(_datetime)
    polygon_50_magnetic_latitude_geographical_lat_lngs \
        = Polygon(shapely.geometry.LineString(_50_magnetic_latitude_polygon_geographical_lat_lngs))
    continents_polygons_geographical_coordinates = get_continents_polygons_geographical_coordinates()

    magnetic_coordinates = ""
    # flag = True

    i = -1
    magnetic_lat_mlts_1 = None
    for current_continent_polygon_geographical_coordinates in continents_polygons_geographical_coordinates:
        current_intersection \
            = polygon_50_magnetic_latitude_geographical_lat_lngs \
            .intersection(current_continent_polygon_geographical_coordinates)

        if str(current_intersection) == "POLYGON EMPTY":
            continue

        i += 1

        # if north_horizon_flag and i == 1:
        #     continue

        if isinstance(current_intersection, shapely.geometry.polygon.Polygon):
            magnetic_lat_mlts = []
            for coords in current_intersection.exterior.coords:
                magnetic_lat, magnetic_lon, _ \
                    = aacgmv2.wrapper.convert_latlon(coords[0], coords[1], 0, _datetime, method_code='G2A')
                mlt = aacgmv2.wrapper.convert_mlt(magnetic_lon, _datetime, m2a=False)[0]
                magnetic_lat_mlts.append([magnetic_lat if north_horizon_flag else -magnetic_lat, mlt])
                # magnetic_coordinates += \
                #     str(magnetic_lat if north_horizon_flag else -magnetic_lat) + ' ' + str(mlt) + '\n'
            if not north_horizon_flag and i == 0:
                # del magnetic_lat_mlts[-5:-100:-1]
                magnetic_lat_mlts = deque(magnetic_lat_mlts)
                magnetic_lat_mlts.rotate(10)
                magnetic_lat_mlts = list(magnetic_lat_mlts)
                del magnetic_lat_mlts[9:12]
            if north_horizon_flag and i == 0:
                magnetic_lat_mlts_1 = magnetic_lat_mlts
            if north_horizon_flag and i == 1:
                # del magnetic_lat_mlts[0]
                magnetic_lat_mlts = rotate_list(magnetic_lat_mlts_1, -find_leap(magnetic_lat_mlts_1) - 1) \
                                    + rotate_list(magnetic_lat_mlts, 59)  # 291
            if not (north_horizon_flag and i == 0):
                for magnetic_lat_mlt in magnetic_lat_mlts:
                    magnetic_coordinates += str(magnetic_lat_mlt[0]) + ' ' + str(magnetic_lat_mlt[1]) + '\n'
            magnetic_coordinates += '@'
        elif isinstance(current_intersection, shapely.geometry.collection.GeometryCollection):
            for geometry_object in current_intersection.geoms:
                if isinstance(geometry_object, shapely.geometry.linestring.LineString):
                    for coords in geometry_object.coords:
                        magnetic_lat, magnetic_lon, _ \
                            = aacgmv2.wrapper.convert_latlon(coords[0], coords[1], 0, _datetime, method_code='G2A')
                        mlt = aacgmv2.wrapper.convert_mlt(magnetic_lon, _datetime, m2a=False)[0]
                        magnetic_coordinates += \
                            str(magnetic_lat if north_horizon_flag else -magnetic_lat) + ' ' + str(mlt) + '\n'
                    magnetic_coordinates += '@'
                else:
                    for coords in geometry_object.exterior.coords:
                        magnetic_lat, magnetic_lon, _ \
                            = aacgmv2.wrapper.convert_latlon(coords[0], coords[1], 0, _datetime, method_code='G2A')
                        mlt = aacgmv2.wrapper.convert_mlt(magnetic_lon, _datetime, m2a=False)[0]
                        magnetic_coordinates += \
                            str(magnetic_lat if north_horizon_flag else -magnetic_lat) + ' ' + str(mlt) + '\n'
                    magnetic_coordinates += '@'
        else:
            for cur_intersection in current_intersection.geoms:
                for coords in cur_intersection.exterior.coords:
                    magnetic_lat, magnetic_lon, _ \
                        = aacgmv2.wrapper.convert_latlon(coords[0], coords[1], 0, _datetime, method_code='G2A')
                    mlt = aacgmv2.wrapper.convert_mlt(magnetic_lon, _datetime, m2a=False)[0]
                    magnetic_coordinates += \
                        str(magnetic_lat if north_horizon_flag else -magnetic_lat) + ' ' + str(mlt) + '\n'
                magnetic_coordinates += '@'

    filename = str(_datetime)
    filename = filename.replace(":", "_")
    filename += '.txt'

    filepath = os.path.join(CONTINENTS_ROOT, 'north' if north_horizon_flag else 'south', filename)

    f = open(filepath, "w")
    f.write(magnetic_coordinates)
    print(f"Message from {THIS_FILENAME}. Write magnetic coordinates to: {filepath}")
    f.close()

    # Соединение с базой данных.
    conn = sqlite3.connect(DATABASE_PATH)

    # Курсор для соединения с базой банных.
    cur = conn.cursor()

    database_name = DATABASE_TABLE_NAME_CONTINENTS_BORDERS_NORTH \
        if north_horizon_flag \
        else DATABASE_TABLE_NAME_CONTINENTS_BORDERS_SOUTH

    cur.execute(f"INSERT INTO {database_name}(datetime, path)" +
                f"VALUES('{str(_datetime)}', '{filepath}');")
    conn.commit()


def add_months(sourcedatetime: dt.datetime, months: int):
    month = sourcedatetime.month - 1 + months
    year = sourcedatetime.year + month // 12
    month = month % 12 + 1
    day = min(sourcedatetime.day, calendar.monthrange(year, month)[1])
    return dt.datetime(year, month, day, sourcedatetime.hour, sourcedatetime.minute)


def do_continents_file_manager_iteration():
    conn = sqlite3.connect(DATABASE_PATH)
    cur = conn.cursor()

    cur.execute(
        f'SELECT path, datetime FROM opv_2d_continentsbordersnorthrecord ORDER BY datetime DESC '
        f'LIMIT 1;')
    tmp = cur.fetchone()
    _datetime = None

    if tmp is None:
        _datetime = get_datetime_from_str("2020-12-01T00:00")
    else:
        path = tmp[0]
        _datetime = get_datetime_from_str(tmp[1])
        _datetime = add_months(_datetime, 1)

    while _datetime <= dt.datetime.now():
        create_file(_datetime, 'north')
        create_file(_datetime, 'south')
        _datetime = add_months(_datetime, 1)


# do_continents_file_manager_iteration()
