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


class DeparturesSerializer2(serializers.ModelSerializer):
    user_full_name = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")
    class Meta:
        model = Departures
        fields = ['id', 'name', 'exit_price', 'created_at', 'user', 'user_full_name']

    def get_user_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}" if obj.user else "Sin nombre"

