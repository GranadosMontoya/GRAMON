from django.urls import path
from .views import dashboard

app_name = 'dashboard_products'
urlpatterns = [
    path('dashboard/', dashboard, name='dashboard'),
]