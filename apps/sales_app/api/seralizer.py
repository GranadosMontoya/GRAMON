# Import django
from rest_framework import serializers
from ..models import Sales,SaleProduct
from django.utils.timezone import localtime
from ...products_app.models import Products
from ...dashboard_products.models import Statistics_products


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
        list_products = validated_data.pop('products')
        sale = Sales.objects.create(**validated_data)

        for product_data in list_products:
            code = product_data['code']
            quantity = product_data['quantity']
            unit_price = product_data['unit_price']
            full_value = product_data['full_value']

            # Agrega esta línea para imprimir información de depuración
            print(f"Debug: Antes de modificar la cantidad del producto - Código: {code}, Cantidad: {quantity}")

            # Modificar la cantidad del producto
            SaleProduct.objects.create(code=code, sale=sale, quantity=quantity, unit_price=unit_price, full_value=full_value)   
            product = Products.objects.get(code=code)
            product.amount -= quantity
            valor_inicial = product.entry_price
            product.save()

            # Modificar la estadística del producto
            product_statistics = Statistics_products.objects.get(code_statistics=code)
            product_statistics.quantity_statistics += quantity
            product_statistics.sold_value += full_value
            valor_inicial_producto = valor_inicial * quantity
            diferencia = full_value - valor_inicial_producto
            product_statistics.revenue += diferencia
            product_statistics.save()
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
