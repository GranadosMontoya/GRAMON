# Generated by Django 4.1.4 on 2024-01-06 04:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sales_app', '0008_alter_saleproduct_full_value_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sales',
            name='change',
            field=models.DecimalField(decimal_places=0, default=0, max_digits=99),
        ),
        migrations.AlterField(
            model_name='sales',
            name='pay',
            field=models.DecimalField(decimal_places=0, max_digits=99),
        ),
    ]