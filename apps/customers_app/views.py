#impot django
from django.views.generic import CreateView, ListView, DeleteView, UpdateView
from django.urls import reverse_lazy
from django.contrib.auth.mixins import LoginRequiredMixin

#import local
from .models import Customer
from .forms import BaseFormCustomer
# Create your views here.


class customerCreateView(LoginRequiredMixin,CreateView):
    template_name = "customers/create_customer.html"
    form_class = BaseFormCustomer
    success_url = reverse_lazy('customer_app:list_customer')
    login_url = reverse_lazy('user_app:login')


class customerListView(LoginRequiredMixin,ListView):
    model = Customer
    template_name = "customers/list_customer.html"
    context_object_name = 'customers'
    login_url = reverse_lazy('user_app:login')


class customerDeleteView(LoginRequiredMixin,DeleteView):
    model = Customer
    success_url = reverse_lazy('customer_app:list_customer')
    login_url = reverse_lazy('user_app:login')


class customerUpdateView(LoginRequiredMixin,UpdateView):
    model = Customer
    form_class = BaseFormCustomer
    template_name = "customers/update_customer.html"
    success_url = reverse_lazy('customer_app:list_customer')
    login_url = reverse_lazy('user_app:login')
