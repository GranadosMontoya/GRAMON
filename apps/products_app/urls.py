#import django
from django.urls import path

#import local
from .views import *

app_name = 'products_app'
urlpatterns = [
    path('list_products/',listproducts,name='list_products'),
]