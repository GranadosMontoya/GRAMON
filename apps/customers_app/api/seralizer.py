# Import django
from rest_framework.serializers import ModelSerializer
from ..models import Customer




class customerSerializer(ModelSerializer):
    """customer serializer"""
    class Meta:
        model = Customer
        fields = '__all__'