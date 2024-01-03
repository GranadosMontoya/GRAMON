# dashboard/views.py
from django.shortcuts import render
from django.http import JsonResponse
from decimal import Decimal
from .models import Statistics_products

def dashboard(request):
    # Obtener tus datos desde el modelo o de cualquier otra fuente
    statistics_data = Statistics_products.objects.all()
    # Puedes procesar los datos según sea necesario y pasarlos al template
    context = {
        'statistics_data': statistics_data,
    }
    return render(request, 'dashboard_products/dashboard.html', context)
