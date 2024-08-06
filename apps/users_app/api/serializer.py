#Import rest_framework 
from rest_framework import serializers

#Import local
from apps.sales_app.models import Sales

class SalesTodaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Sales
        fields = ('created_at','valor_final','id',)