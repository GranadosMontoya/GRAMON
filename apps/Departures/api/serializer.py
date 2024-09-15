from rest_framework import serializers
from ..models import Departures
from apps.cash_register.models import Caja, Transaccion

class DeparturesSerializer(serializers.ModelSerializer):
    """Serializer para manejar las salidas (Departures)"""
    
    class Meta:
        model = Departures
        fields = ['id', 'name', 'exit_price', 'created_at']

    def create(self, validated_data):
        # Obtener la caja abierta
        caja_abierta = Caja.get_caja_abierta()
        if not caja_abierta:
            raise serializers.ValidationError("No se puede registrar una salida sin una caja abierta.")

        # Crear la salida
        departure = Departures.objects.create(**validated_data)

        # Registrar la transacción de salida en la caja
        Transaccion.objects.create(
            caja=caja_abierta,
            tipo='salida',
            monto=departure.exit_price,
            descripcion=f"Salida registrada: {departure.name}"
        )

        return departure
