# Generated by Django 4.1.4 on 2023-12-18 00:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sales_app', '0004_alter_sales_change'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sales',
            name='pay',
            field=models.DecimalField(decimal_places=2, max_digits=20),
        ),
    ]
