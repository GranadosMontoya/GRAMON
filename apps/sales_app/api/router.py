from rest_framework.routers import DefaultRouter
from django.urls import path,include, re_path
from .views import *

router = DefaultRouter()

router.register('api/sales',SalesApi, basename="prueba")

urlpatterns = [
    path('', include(router.urls)),
    re_path('new/sale', new_sale, name='new_sale'),
    re_path('api/v1/sales/', SalesView.as_view(), name='sale-api'),
    re_path('factura/sale',factura_sale)
]