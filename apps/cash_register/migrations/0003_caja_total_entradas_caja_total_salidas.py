# Generated by Django 4.1.4 on 2024-10-16 01:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cash_register', '0002_alter_caja_estado_alter_caja_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='caja',
            name='total_entradas',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
        migrations.AddField(
            model_name='caja',
            name='total_salidas',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
    ]
