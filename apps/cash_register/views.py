from django.views.generic import ListView
from django.urls import reverse_lazy
from django.contrib.auth.mixins import LoginRequiredMixin

from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required

#import local
from .models import Caja

class BoxListView(LoginRequiredMixin,ListView):
    model = Caja
    template_name = "box/list_box.html"
    context_object_name = 'history_box'
    ordering = ['-id']
    paginate_by = 15
    login_url = reverse_lazy('user_app:login')

@login_required(login_url='/')
def ModalAddBox(request):
    # Verificar si ya existe una caja abierta
    if Caja.caja_abierta_existe():
        return render(request,'box/error_box.html')  # Redirigir a la página adecuada
    # Si no hay una caja abierta, renderizar el formulario para abrir una nueva caja
    return render(request, 'box/new_box.html')

@login_required(login_url='/')
def ModalAddBox2(request):
    # Verificar si ya existe una caja abierta
    if Caja.caja_abierta_existe():
        return render(request,'box/error_box.html')  # Redirigir a la página adecuada
    # Si no hay una caja abierta, renderizar el formulario para abrir una nueva caja
    return render(request, 'box/new_box2.html')

@login_required(login_url='/')
def CloseBox(request):
    return render(request, 'box/close_box.html') 