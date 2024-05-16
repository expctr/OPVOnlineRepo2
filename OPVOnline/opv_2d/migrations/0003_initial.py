# Generated by Django 5.0 on 2024-03-01 10:30

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('opv_2d', '0002_delete_northforecastdiffuserecord_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='ContinentsBordersNorthRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('datetime', models.CharField(max_length=18)),
                ('path', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='ContinentsBordersSouthRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('datetime', models.CharField(max_length=18)),
                ('path', models.CharField(max_length=255)),
            ],
        ),
    ]
