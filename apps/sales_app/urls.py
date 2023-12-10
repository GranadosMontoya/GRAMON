from django.urls import path
from .views import *

app_name = 'sales_app'
urlpatterns = [
    # path('new_sale/',salesCreateView.as_view(),name='new_sale'),
    path('history_sales/',salesListView.as_view(), name='list_sale')
]
