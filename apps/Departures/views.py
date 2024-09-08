from django.views.generic import ListView
from django.urls import reverse_lazy
from django.contrib.auth.mixins import LoginRequiredMixin

from django.shortcuts import render
from django.contrib.auth.decorators import login_required

#import local
from .models import Departures

class DeparturesListView(LoginRequiredMixin,ListView):
    model = Departures
    template_name = "departures/list_departures.html"
    context_object_name = 'history_departures'
    ordering = ['-id']
    paginate_by = 15
    login_url = reverse_lazy('user_app:login')

@login_required(login_url='/')
def ModalAddDeparture(request):
    return render(request, 'departures/new_departure.html')