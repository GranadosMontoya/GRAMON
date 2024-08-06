from rest_framework.viewsets import ModelViewSet
from .serializer import SalesTodaySerializer
from apps.sales_app.models import Sales
from django.utils import timezone
from datetime import timedelta

class SalesTodayApi(ModelViewSet):
    serializer_class = SalesTodaySerializer
    
    def get_queryset(self):
        now = timezone.now()
        start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
        end_of_day = start_of_day + timedelta(days=1)
        
        consulta = Sales.objects.filter(created_at__range=(start_of_day, end_of_day)).only('created_at', 'valor_final','id')
    
        print(f"QuerySet: {consulta.query}")  # Imprimir la consulta SQL generada
        return consulta
