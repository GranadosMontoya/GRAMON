#import django
from django.db.models import Q
from django.urls import reverse_lazy
from django.contrib.auth.mixins import LoginRequiredMixin

#import rest_framework
from rest_framework.viewsets import ModelViewSet

#import local
from .seralizer import customerSerializer
from ..models import Customer


class CustomerApi(LoginRequiredMixin,ModelViewSet):
    serializer_class = customerSerializer
    queryset = Customer.objects.all()
    login_url = reverse_lazy('user_app:login')

    def get_queryset(self):
        queryset = self.queryset
        search = self.request.GET['search']
        if search is not None:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(id__icontains=search) |
                Q(last_name__icontains=search)
            )
        return queryset