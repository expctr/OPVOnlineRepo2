# Generated by Django 5.0 on 2024-05-05 11:36

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='NorthForecastDiffuseRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('datetime', models.CharField(max_length=18)),
                ('path', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='NorthForecastIonsRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('datetime', models.CharField(max_length=18)),
                ('path', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='NorthForecastMonoRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('datetime', models.CharField(max_length=18)),
                ('path', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='NorthForecastTotalRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('datetime', models.CharField(max_length=18)),
                ('path', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='NorthForecastWaveRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('datetime', models.CharField(max_length=18)),
                ('path', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='NorthNowcastDiffuseRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('datetime', models.CharField(max_length=18)),
                ('path', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='NorthNowcastIonsRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('datetime', models.CharField(max_length=18)),
                ('path', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='NorthNowcastMonoRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('datetime', models.CharField(max_length=18)),
                ('path', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='NorthNowcastTotalRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('datetime', models.CharField(max_length=18)),
                ('path', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='NorthNowcastWaveRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('datetime', models.CharField(max_length=18)),
                ('path', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='SouthForecastDiffuseRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('datetime', models.CharField(max_length=18)),
                ('path', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='SouthForecastIonsRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('datetime', models.CharField(max_length=18)),
                ('path', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='SouthForecastMonoRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('datetime', models.CharField(max_length=18)),
                ('path', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='SouthForecastTotalRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('datetime', models.CharField(max_length=18)),
                ('path', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='SouthForecastWaveRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('datetime', models.CharField(max_length=18)),
                ('path', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='SouthNowcastDiffuseRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('datetime', models.CharField(max_length=18)),
                ('path', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='SouthNowcastIonsRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('datetime', models.CharField(max_length=18)),
                ('path', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='SouthNowcastMonoRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('datetime', models.CharField(max_length=18)),
                ('path', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='SouthNowcastTotalRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('datetime', models.CharField(max_length=18)),
                ('path', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='SouthNowcastWaveRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('datetime', models.CharField(max_length=18)),
                ('path', models.CharField(max_length=255)),
            ],
        ),
    ]