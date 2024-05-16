# В данном файле содержатся модели для описания таблиц БД.

from django.db import models


class ContinentsBordersNorthRecord(models.Model):
    datetime = models.CharField(max_length=18)
    path = models.CharField(max_length=255)


class ContinentsBordersSouthRecord(models.Model):
    datetime = models.CharField(max_length=18)
    path = models.CharField(max_length=255)
