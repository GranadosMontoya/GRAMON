from rest_framework.routers import DefaultRouter
from django.urls import path,include, re_path
from .views import *

router = DefaultRouter()

router.register('api/home',SalesTodayApi, basename="Home-Api")

urlpatterns = [
    path('', include(router.urls)),
]