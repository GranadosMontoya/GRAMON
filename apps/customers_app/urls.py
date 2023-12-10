#import django
from django.urls import path

#import local
from .views import *


app_name = 'customer_app'
urlpatterns = [
    path('create_customer/',customerCreateView.as_view(),name='create_customer'),
    path('list_customer/', customerListView.as_view(), name='list_customer'),
    path('delete_customer/<pk>', customerDeleteView.as_view(),name='delete_customer'),
    path('update_customer/<pk>',customerUpdateView.as_view(), name='update_customer')
]
