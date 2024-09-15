from rest_framework import serializers
from apps.cash_register.models import Caja

class BoxSerializer(serializers.ModelSerializer):
    """Serializer para manejar las salidas (Departures)"""
    
    class Meta:
        model = Caja
        fields = ['id', 'fecha_apertura', 'saldo_inicial', 'saldo_final', 'fecha_cierre', 'estado']