# Import django
from django.forms import ValidationError
from rest_framework import serializers
from ..models import Sales,SaleProduct
from django.utils.timezone import localtime
from ...products_app.models import Products
from ...dashboard_products.models import Statistics_products
from django.db import transaction

#import local
from apps.cash_register.models import Caja, Transaccion


class SalesProductSerializer(serializers.ModelSerializer):
    quantity = serializers.IntegerField()
    class Meta:
        model = SaleProduct
        fields = ('code', 'quantity','unit_price','full_value')


class SalesSerializer(serializers.ModelSerializer):
    products = SalesProductSerializer(many=True)

    class Meta:
        model = Sales
        fields = ('user', 'client', 'products','valor_final', 'pay', 'change')

    def create(self, validated_data):
        # Iniciar una transacción atómica
        with transaction.atomic():
            # Obtener los productos y crear la venta
            list_products = validated_data.pop('products')
            sale = Sales.objects.create(**validated_data)

            for product_data in list_products:
                print('sebas')
                code = product_data['code']
                quantity = product_data['quantity']
                unit_price = product_data['unit_price']
                full_value = product_data['full_value']

                # Crear cada registro de producto en la venta
                SaleProduct.objects.create(code=code, sale=sale, quantity=quantity, unit_price=unit_price, full_value=full_value)
                
                # Actualizar cantidad de productos
                product = Products.objects.get(code=code)
                product.amount -= quantity
                product.save()

                # Actualizar estadísticas del producto
                product_statistics = Statistics_products.objects.get(code_statistics=code)
                product_statistics.quantity_statistics += quantity
                product_statistics.sold_value += full_value
                product_statistics.revenue += (full_value - (product.entry_price * quantity))
                product_statistics.save()

            # Registrar la transacción en la caja abierta
            caja_abierta = Caja.caja_abierta_existe()  # Método que devuelve la caja abierta
            if not caja_abierta:
                raise serializers.ValidationError("No se puede registrar una venta sin una caja abierta.")  # Lanza un error de validación

            Transaccion.objects.create(
                tipo='entrada',
                monto=sale.valor_final,  # El monto total de la venta
                descripcion=f"Venta realizada por {validated_data['user']}"
            )
            return sale

class SalesHistorySales(serializers.ModelSerializer):
    client_full_name = serializers.CharField(source='client.full_name')
    user_full_name = serializers.CharField(source='user.full_name')
    created_at = serializers.SerializerMethodField()
    class Meta:
        model = Sales
        fields = ('id', 'user_full_name', 'client_full_name', 'valor_final','created_at', 'pay', 'change')

    def get_created_at(self, obj):
        created_at_local = localtime(obj.created_at)
        return created_at_local.strftime('%Y-%m-%d %I:%M:%S %p')
