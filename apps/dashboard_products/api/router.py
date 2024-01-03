from django.urls import path
from .views import get_chart_data_quantity,get_chart_data_revenue

urlpatterns = [
    path('get_chart_data/products/', get_chart_data_quantity, name='get_chart_data'),
    path('get_chart_data/products/revenue/', get_chart_data_revenue, name='get_chart_data_revenue'),
]
