from rest_framework.routers import DefaultRouter
from django.urls import path,include
from .views import *

router = DefaultRouter()

router.register('api/box', BoxApi, basename="box_api")

urlpatterns = [
    path('', include(router.urls)),
]