# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-07-06 03:28
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tethys', '0003_document'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='container',
            name='documents',
        ),
        migrations.AlterField(
            model_name='container',
            name='name',
            field=models.CharField(max_length=100, unique=True),
        ),
    ]
