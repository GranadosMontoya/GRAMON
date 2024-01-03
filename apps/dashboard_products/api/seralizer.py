# Import django
from rest_framework.serializers import ModelSerializer

#Import local
from ..models import Statistics_products



class DashboardProductsSerializer(ModelSerializer):
    """products serializer"""
    class Meta:
        model = Statistics_products
        fields = [
            'code_statistics',
            'product_name_statistics',
            'quantity_statistics',
        ]

class ProductsRevenueSerializer(ModelSerializer):
    """products serializer"""
    class Meta:
        model = Statistics_products
        fields = [
            'code_statistics',
            'product_name_statistics',
            'revenue',
        ]