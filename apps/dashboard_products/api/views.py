# dashboard/views.py
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from ..models import Statistics_products
from .seralizer import DashboardProductsSerializer, ProductsRevenueSerializer

@api_view(['GET'])
def get_chart_data_quantity(request):
    statistics_data = Statistics_products.objects.order_by('-quantity_statistics')[:10]
    serializer = DashboardProductsSerializer(statistics_data, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_chart_data_revenue(request):
    statistics_data = Statistics_products.objects.order_by('-revenue')[:10]
    serializer = ProductsRevenueSerializer(statistics_data, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)