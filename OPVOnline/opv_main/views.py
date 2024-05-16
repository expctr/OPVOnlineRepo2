# В данном файле содержится описание классов и функций для обработки клиентских запросов
# при работе главной страницы.

from django.http import HttpResponse, HttpResponseBadRequest
from django.template.loader import render_to_string
from django.views import View
from django.http import JsonResponse

import os

ROOT_FORECAST = os.path.join('..',
                             'OPVSupportManager',
                             'ForecastManager',
                             'second-forecast', )


def main_view(request):
    response = render_to_string('opv_main/index.html')
    return HttpResponse(response)


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


class SecondForecastResponseUtil(View):
    def get(self, request):
        last_filename = None
        last_path = None

        for filename in sorted(os.listdir(ROOT_FORECAST)):
            path = os.path.join(ROOT_FORECAST, filename)
            last_filename = filename
            last_path = path

        with open(last_path, "r") as file:
            data = file.read()

        file_datetime = get_file_datetime(last_filename)

        return JsonResponse({
            'filesNumber': '1',
            'data': data,
            'fileName': last_filename,
            'fileDateTime': file_datetime
        })
