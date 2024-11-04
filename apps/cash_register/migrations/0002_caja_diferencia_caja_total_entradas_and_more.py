# Generated by Django 4.1.4 on 2024-11-04 18:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cash_register', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='caja',
            name='diferencia',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True),
        ),
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
        migrations.AddField(
            model_name='caja',
            name='valor_esperado',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True),
        ),
        migrations.AlterField(
            model_name='caja',
            name='estado',
            field=models.CharField(choices=[('Abierta', 'Abierta'), ('Cerrada', 'Cerrada')], default='Abierta', max_length=10),
        ),
        migrations.AlterField(
            model_name='caja',
            name='id',
            field=models.CharField(editable=False, max_length=12, primary_key=True, serialize=False),
        ),
    ]