#Import django
from django.views.generic import ListView
from django.urls import reverse_lazy
from django.contrib.auth.mixins import LoginRequiredMixin

#import local
from .models import Sales

class salesListView(LoginRequiredMixin,ListView):
    model = Sales
    template_name = "sales/list_sale.html"
    context_object_name = 'history'
    ordering = ['-id']
    paginate_by = 15
    login_url = reverse_lazy('user_app:login')
