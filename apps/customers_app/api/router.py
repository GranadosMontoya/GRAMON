from rest_framework.routers import DefaultRouter
from django.urls import path,include
from .views import *

router = DefaultRouter()

router.register('api/v1/search/customer', CustomerApi, basename="prueba")

urlpatterns = [
    path('', include(router.urls)),
]