from rest_framework import serializers
from apps.cash_register.models import Caja

class BoxSerializer(serializers.ModelSerializer):
    """Serializer para manejar las salidas (Departures)"""
    
    class Meta:
        model = Caja
        fields = ['id', 'fecha_apertura', 'saldo_inicial', 'saldo_final', 'fecha_cierre', 'estado','total_entradas','total_salidas']

class BoxSerializer2(serializers.ModelSerializer):
    """Serializer para manejar las salidas (Departures)"""
    fecha_apertura = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")
    fecha_cierre = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")
    class Meta:
        model = Caja
        fields = ['id', 'fecha_apertura', 'saldo_inicial', 'saldo_final', 'fecha_cierre', 'estado','total_entradas','total_salidas']
