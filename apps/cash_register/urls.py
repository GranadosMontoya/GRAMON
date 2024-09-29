#import django
from django.urls import path, re_path

#import local
from .views import *

app_name = 'box_app'
urlpatterns = [
    # path('list/departures',DeparturesListView.as_view() ,name='list_departures'),
    path('add/box/', ModalAddBox),
    re_path('add/box2/', ModalAddBox2),
    re_path('close/box/', CloseBox),
    re_path('list/box/', BoxListView.as_view(), name="Box_history"),

]