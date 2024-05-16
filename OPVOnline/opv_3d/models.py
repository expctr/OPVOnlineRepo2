# В данном файле содержатся модели для описания таблиц БД.

from django.db import models


class NorthForecastDiffuseRecord(models.Model):
    """
    Модель, которая соответствует северной полусфере,
    прогнозу, вкладу рассеянного сияния.
    """
    datetime = models.CharField(max_length=18)
    path = models.CharField(max_length=255)


class NorthForecastIonsRecord(models.Model):
    """
    Модель, которая соответствует северной полусфере,
    прогнозу, вкладу ионов.
    """
    datetime = models.CharField(max_length=18)
    path = models.CharField(max_length=255)


class NorthForecastMonoRecord(models.Model):
    """
    Модель, которая соответствует северной полусфере,
    прогнозу, вкладу моноэнергетических пиков.
    """
    datetime = models.CharField(max_length=18)
    path = models.CharField(max_length=255)


class NorthForecastTotalRecord(models.Model):
    """
    Модель, которая соответствует северной полусфере,
    прогнозу, общему вкладу авроральных компонент.
    """
    datetime = models.CharField(max_length=18)
    path = models.CharField(max_length=255)


class NorthForecastWaveRecord(models.Model):
    """
    Модель, которая соответствует северной полусфере,
    прогнозу, вкладу "broadband" ускорения.
    """
    datetime = models.CharField(max_length=18)
    path = models.CharField(max_length=255)


class NorthNowcastDiffuseRecord(models.Model):
    """
    Модель, которая соответствует северной полусфере,
    наблюдаемым данным, вкладу рассеянного сияния.
    """
    datetime = models.CharField(max_length=18)
    path = models.CharField(max_length=255)


class NorthNowcastIonsRecord(models.Model):
    """
    Модель, которая соответствует северной полусфере,
    наблюдаемым данным, вкладу ионов.
    """
    datetime = models.CharField(max_length=18)
    path = models.CharField(max_length=255)


class NorthNowcastMonoRecord(models.Model):
    """
    Модель, которая соответствует северной полусфере,
    наблюдаемым данным, вкладу моноэнергетических пиков.
    """
    datetime = models.CharField(max_length=18)
    path = models.CharField(max_length=255)


class NorthNowcastTotalRecord(models.Model):
    """
    Модель, которая соответствует северной полусфере,
    наблюдаемым данным, общему вкладу авроральных компонент.
    """
    datetime = models.CharField(max_length=18)
    path = models.CharField(max_length=255)


class NorthNowcastWaveRecord(models.Model):
    """
    Модель, которая соответствует северной полусфере,
    наблюдаемым данным, вкладу "broadband" ускорения.
    """
    datetime = models.CharField(max_length=18)
    path = models.CharField(max_length=255)


class SouthForecastDiffuseRecord(models.Model):
    """
    Модель, которая соответствует южной полусфере,
    прогнозу, вкладу рассеянного сияния.
    """
    datetime = models.CharField(max_length=18)
    path = models.CharField(max_length=255)


class SouthForecastIonsRecord(models.Model):
    """
    Модель, которая соответствует южной полусфере,
    прогнозу, вкладу ионов.
    """
    datetime = models.CharField(max_length=18)
    path = models.CharField(max_length=255)


class SouthForecastMonoRecord(models.Model):
    """
    Модель, которая соответствует южной полусфере,
    прогнозу, вкладу моноэнергетических пиков.
    """
    datetime = models.CharField(max_length=18)
    path = models.CharField(max_length=255)


class SouthForecastTotalRecord(models.Model):
    """
    Модель, которая соответствует южной полусфере,
    прогнозу, общему вкладу авроральных компонент.
    """
    datetime = models.CharField(max_length=18)
    path = models.CharField(max_length=255)


class SouthForecastWaveRecord(models.Model):
    """
    Модель, которая соответствует южной полусфере,
    прогнозу, вкладу "broadband" ускорения.
    """
    datetime = models.CharField(max_length=18)
    path = models.CharField(max_length=255)


class SouthNowcastDiffuseRecord(models.Model):
    """
    Модель, которая соответствует южной полусфере,
    наблюдаемым данных, вкладу рассеянного сияния.
    """
    datetime = models.CharField(max_length=18)
    path = models.CharField(max_length=255)


class SouthNowcastIonsRecord(models.Model):
    """
    Модель, которая соответствует южной полусфере,
    наблюдаемым данных, вкладу ионов.
    """
    datetime = models.CharField(max_length=18)
    path = models.CharField(max_length=255)


class SouthNowcastMonoRecord(models.Model):
    """
    Модель, которая соответствует южной полусфере,
    наблюдаемым данных, вкладу моноэнергетических пиков.
    """
    datetime = models.CharField(max_length=18)
    path = models.CharField(max_length=255)


class SouthNowcastTotalRecord(models.Model):
    """
    Модель, которая соответствует южной полусфере,
    наблюдаемым данных, общему вкладу авроральных компонент.
    """
    datetime = models.CharField(max_length=18)
    path = models.CharField(max_length=255)


class SouthNowcastWaveRecord(models.Model):
    """
    Модель, которая соответствует южной полусфере,
    наблюдаемым данных, вкладу "broadband" ускорения.
    """
    datetime = models.CharField(max_length=18)
    path = models.CharField(max_length=255)


