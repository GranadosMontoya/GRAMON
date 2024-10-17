from rest_framework.routers import DefaultRouter
from django.urls import path,include,re_path
from .views import *

router = DefaultRouter()

router.register('api/box', BoxApi, basename="box_api")

urlpatterns = [
    path('', include(router.urls)),
    re_path('api/v1/box',SalesView.as_view())
]