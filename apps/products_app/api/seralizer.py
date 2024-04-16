# Import django
from rest_framework.serializers import ModelSerializer

#Import local
from..models import Products

class ProductsSerializer(ModelSerializer):
    """products serializer"""
    class Meta:
        model = Products
        fields = [
            'name',
            'code',
            'amount',
            'entry_price',
            'exit_price',
            'image',
        ]

class UpdateProductSerializer(ModelSerializer):
    class Meta:
        model = Products
        fields = "__all__"

class SupplySerializer(ModelSerializer):
    class Meta: 
        model = Products
        fields = ['amount','code']
    
    