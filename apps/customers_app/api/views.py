#import django
from django.shortcuts import render
from django.db.models import Q

#import rest_framework
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

#import local
from .seralizer import customerSerializer
from ..models import Customer


def pruebaajax(request):
    return render(request, 'esq.html')


class CustomerApi(ModelViewSet):
    serializer_class = customerSerializer
    queryset = Customer.objects.all()

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