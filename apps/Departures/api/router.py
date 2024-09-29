from rest_framework.routers import DefaultRouter
from django.urls import path,include,re_path
from .views import *

router = DefaultRouter()

router.register('api/departures', DeparturesApi, basename="departures_api")


urlpatterns = [
    path('', include(router.urls)),
    re_path('api/v1/departure/', DeparturesView.as_view(), name='departure-api'),
]