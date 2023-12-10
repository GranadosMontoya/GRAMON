# Import django
from django.forms import ValidationError
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers

#Import local
from..models import Products
from ..models import Products



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

class Product_InvSerializer(serializers.ModelSerializer):
    class Meta:
        model = Products
        fields = ['code','amount']
        extra_kwargs = {'amount': {'required': False}}

    def update(self, instance, validated_data):
        instance.amount -= validated_data.get('amount', instance.amount)
        instance.save()
        return instance

class UpdateProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Products
        fields = "__all__"
