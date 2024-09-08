#import django
from django.urls import path, re_path

#import local
from .views import *

app_name = 'departures_app'
urlpatterns = [
    path('list/departures',DeparturesListView.as_view() ,name='list_departures'),
    re_path('add/departure/', ModalAddDeparture),
]