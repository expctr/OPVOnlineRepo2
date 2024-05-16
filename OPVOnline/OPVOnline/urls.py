"""
URL configuration for OPVOnline project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from opv_main import views as views_main
from opv_2d import views as views_2d
from opv_3d import views as views_3d

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views_main.main_view),
    path('second-forecast', views_main.SecondForecastResponseUtil.as_view()),
    path('2d', views_2d.main_view),
    path('2d/util', views_2d.ResponseUtil.as_view()),
    path('2d/cloudiness', views_2d.CloudinessResponseUtil.as_view()),
    path('2d/terminator', views_2d.TerminatorResponseUtil.as_view()),
    path('2d/denoise', views_2d.DenoiseResponseUtil.as_view()),
    path('2d/continents', views_2d.ContinentsResponseUtil.as_view()),
    path('2d/rotation-angle', views_2d.RotationAngleResponseUtil.as_view()),
    path('2d/cities', views_2d.CitiesResponseUtil.as_view()),
    path('2d/total-rotation-angle', views_2d.TotalMltRotationAngleResponseUtil.as_view()),
    path('2d/extended-functionality-1', views_2d.ExtendedFunctionality1ResponseUtil.as_view()),
    path('3d', views_3d.main_view),
    path('3d/certain-file-data', views_3d.CertainFileDataResponseUtil.as_view()),
    path('3d/last-file-data', views_3d.LastFileDataAndFilesNumberResponseUtil.as_view()),
    path('3d/files-number-and-file-data-by-datetime', views_3d.FilesNumberAndFileDataByDatetimeResponseUtil.as_view()),
    path('3d/file-data-by-datetime', views_3d.FileDataByDatetimeResponseUtil.as_view()),
    path('3d/denoise', views_3d.DenoiseResponseUtil.as_view()),
    path('3d/second-forecast', views_3d.SecondForecastResponseUtil3D.as_view()),
]
