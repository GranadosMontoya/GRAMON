# Generated by Django 4.1.4 on 2024-02-04 22:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products_app', '0002_remove_products_id_alter_products_code'),
    ]

    operations = [
        migrations.AlterField(
            model_name='products',
            name='name',
            field=models.CharField(max_length=100),
        ),
    ]