# В данном файле содержится перечисление,
# которое кодирует индекс типа файла.

from enum import IntEnum


class FileTypeIndex(IntEnum):
    """
    Перечисление, которое кодирует индекс типа файла.
    """
    UNKNOWN = -1
    NORTH_FORECAST_DIFFUSE = 0
    NORTH_FORECAST_IONS = 1
    NORTH_FORECAST_MONO = 2
    NORTH_FORECAST_TOTAL = 3
    NORTH_FORECAST_WAVE = 4
    NORTH_NOWCAST_DIFFUSE = 5
    NORTH_NOWCAST_IONS = 6
    NORTH_NOWCAST_MONO = 7
    NORTH_NOWCAST_TOTAL = 8
    NORTH_NOWCAST_WAVE = 9
    SOUTH_FORECAST_DIFFUSE = 10
    SOUTH_FORECAST_IONS = 11
    SOUTH_FORECAST_MONO = 12
    SOUTH_FORECAST_TOTAL = 13
    SOUTH_FORECAST_WAVE = 14
    SOUTH_NOWCAST_DIFFUSE = 15
    SOUTH_NOWCAST_IONS = 16
    SOUTH_NOWCAST_MONO = 17
    SOUTH_NOWCAST_TOTAL = 18
    SOUTH_NOWCAST_WAVE = 19
