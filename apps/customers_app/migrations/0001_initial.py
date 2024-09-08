# Generated by Django 4.1.4 on 2024-08-31 20:27

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Customer',
            fields=[
                ('id', models.PositiveIntegerField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=50)),
                ('last_name', models.CharField(max_length=50)),
                ('email', models.EmailField(blank=True, max_length=254)),
                ('adress', models.CharField(blank=True, max_length=50)),
                ('number', models.IntegerField()),
                ('full_name', models.CharField(default='', editable=False, max_length=100)),
            ],
        ),
    ]
