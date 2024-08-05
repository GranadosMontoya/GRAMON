from rest_framework.viewsets import ModelViewSet
from .serializer import SalesTodaySerializer
from apps.sales_app.models import Sales
from django.utils import timezone
from datetime import datetime

class SalesTodayApi(ModelViewSet):
    serializer_class = SalesTodaySerializer
    
    def get_queryset(self):
        today = timezone.now().date()
        start_of_day = datetime.combine(today, datetime.min.time())
        end_of_day = datetime.combine(today, datetime.max.time())

        return Sales.objects.filter(
            created_at__gte=start_of_day,
            created_at__lte=end_of_day
        ).only('created_at', 'valor_final')
