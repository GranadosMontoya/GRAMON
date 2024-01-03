# Generated by Django 4.1.4 on 2024-01-03 01:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sales_app', '0007_alter_sales_change_alter_sales_valor_final'),
    ]

    operations = [
        migrations.AlterField(
            model_name='saleproduct',
            name='full_value',
            field=models.DecimalField(decimal_places=2, max_digits=50),
        ),
        migrations.AlterField(
            model_name='saleproduct',
            name='unit_price',
            field=models.DecimalField(decimal_places=2, max_digits=50),
        ),
    ]
