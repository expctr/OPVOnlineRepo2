# Это главный файл вспомогательного приложения для поддержания работы сервера.

from datetime import datetime
import time

from CloudinessDrawer.cloudiness_drawer import do_cloudiness_drawer_iteration
from ContinentsFileManager.continents_file_manager import do_continents_file_manager_iteration
from ForecastManager.forecast_manager import do_forecast_manager_iteration
from DatabaseManager.database_manager import do_database_manager_iteration
from CoordinatesManager.coorindates_manager import do_coordinates_manager_iteration
from SecondDatabaseManager.second_database_manager import do_second_database_manager_iteration

REPEAT_FLAG = False
SLEEP_TIME_IN_SECONDS = 60

do_cloudiness_drawer_iteration_last_call_time = None
CLOUDINESS_DRAWER_SLEEP_TIME = 3600 * 3

do_continents_file_manager_iteration_last_call_time = None
CONTINENTS_FILE_MANAGER_SLEEP_TIME = 3600

do_forecast_manager_iteration_last_call_time = None
FORECAST_MANAGER_SLEEP_TIME = 60

do_database_manager_iteration_last_call_time = None
DATABASE_MANAGER_SLEEP_TIME = 3600

do_coordinates_manager_iteration_last_call_time = None
COORDINATES_MANAGER_SLEEP_TIME = 3600

do_second_database_manager_iteration_last_call_time = None
SECOND_DATABASE_MANAGER_SLEEP_TIME = 3600


def check_cloudiness_drawer_readiness():
    return (do_cloudiness_drawer_iteration_last_call_time is None) \
        or ((datetime.now() - do_cloudiness_drawer_iteration_last_call_time).seconds >= CLOUDINESS_DRAWER_SLEEP_TIME)


def check_continents_file_manager_readiness():
    return (do_continents_file_manager_iteration_last_call_time is None) \
        or ((
                    datetime.now() - do_continents_file_manager_iteration_last_call_time).seconds >= CONTINENTS_FILE_MANAGER_SLEEP_TIME)


def check_forecast_manager_readiness():
    return (do_forecast_manager_iteration_last_call_time is None) \
        or ((datetime.now() - do_forecast_manager_iteration_last_call_time).seconds >= FORECAST_MANAGER_SLEEP_TIME)


def check_database_manager_readiness():
    return (do_database_manager_iteration_last_call_time is None) \
        or ((datetime.now() - do_database_manager_iteration_last_call_time).seconds >= DATABASE_MANAGER_SLEEP_TIME)


def check_coordinates_manager_readiness():
    return (do_coordinates_manager_iteration_last_call_time is None) \
        or ((
                        datetime.now() - do_coordinates_manager_iteration_last_call_time).seconds >= COORDINATES_MANAGER_SLEEP_TIME)


def check_second_database_manager_readiness():
    return (do_second_database_manager_iteration_last_call_time is None) \
        or ((datetime.now() - do_second_database_manager_iteration_last_call_time).seconds >= SECOND_DATABASE_MANAGER_SLEEP_TIME )


while True:
    if check_cloudiness_drawer_readiness():
        try:
            do_cloudiness_drawer_iteration()
        except:
            print("Ошибка во время рисования облачности.")
        do_cloudiness_drawer_iteration_last_call_time = datetime.now()

    if check_continents_file_manager_readiness():
        try:
            do_continents_file_manager_iteration()
        except:
            print("Ошибка во время генерации файлов с границами континентов.")
        do_continents_file_manager_iteration_last_call_time = datetime.now()

    if check_database_manager_readiness():
        try:
            do_second_database_manager_iteration()
        except:
            print("Ошибка во время работы первого менеджера базы данных.")
        do_database_manager_iteration_last_call_time = datetime.now()

    if check_coordinates_manager_readiness():
        try:
            do_coordinates_manager_iteration()
        except:
            print("Ошибка во время работы менеджера по преобразованию геомагнитных координат в географические.")
        do_coordinates_manager_iteration_last_call_time = datetime.now()

    if check_second_database_manager_readiness():
        try:
            do_second_database_manager_iteration()
        except:
            print("Ошибка во время работы второго менеджера базы данных.")
        do_second_database_manager_iteration_last_call_time = datetime.now()

    if check_forecast_manager_readiness():
        try:
            do_forecast_manager_iteration()
        except:
            print("Ошибка во время генерации файлов с прогнозами.")
        do_forecast_manager_iteration_last_call_time = datetime.now()

    if not REPEAT_FLAG:
        break
    time.sleep(SLEEP_TIME_IN_SECONDS)
