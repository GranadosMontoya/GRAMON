#import django
import json
from django.db.models import Q
from django.shortcuts import render
from django.urls import reverse_lazy
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.decorators import login_required


#import rest_framework
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework import status

#import local
from .seralizer import ProductsSerializer, UpdateProductSerializer, SupplySerializer
from ..models import Products


class ProductsApi(LoginRequiredMixin,ModelViewSet):
    serializer_class = ProductsSerializer
    queryset = Products.objects.all()
    login_url = reverse_lazy('user_app:login')


    def get_queryset(self):
        queryset = self.queryset
        search = self.request.query_params.get('search', None)
        if search is not None:
            queryset = queryset.filter(
                Q(code__icontains = search)|
                Q(name__icontains = search)
                )
        queryset = queryset.order_by('name')
        return queryset


class ProductUpdateView(LoginRequiredMixin,APIView):

    login_url = reverse_lazy('user_app:login')


    def put(self, request):
        product_data = request.data
        producto = Products.objects.get(code=product_data['code'])
        serializer = UpdateProductSerializer(producto, data=product_data)
        if serializer.is_valid():
            serializer.save()
            return Response({'response':'Producto actualizado correctamente'})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request):
        product_data = request.data
        producto = Products.objects.filter(code=product_data['codigo'])
        if producto:
            producto.delete()
            return Response({'mensaje':'Producto eliminado con exito'})
        else:
            return Response({'mensaje':'No existe el producto'})
        
    def post(self, request):
        product_data = request.data
        producto = Products.objects.get(code=product_data['code'])
        serializer = SupplySerializer(producto, data=product_data)
        if serializer.is_valid():
            cantidad_recibida = int(product_data.get('amount', 0))
            producto.amount += cantidad_recibida
            producto.save()
            return Response({'response':'Producto surtido correctamente'})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SupplyProduct(LoginRequiredMixin,ModelViewSet):
    serializer_class = SupplySerializer
    queryset = Products.objects.all()
    login_url = reverse_lazy('user_app:login')

@login_required(login_url='/')
def ModalSupplyProduct(request):
    return render(request, 'products/supply_product.html')

@login_required(login_url='/')
def ModalAddProduct(request):
    return render(request, 'products/Form_add_product.html') 

@login_required(login_url='/')
def ModalInfoProduct(request):
    if request.method == 'GET':
        product_info_json = request.GET.get('product_info', None)
        if product_info_json:
            product_info = json.loads(product_info_json)
    context = {
        'product_info': product_info
    }
    return render(request, 'products/DetailProduct.html', context)

@login_required(login_url='/')
def ModalDeleteProduct(request):
    product_code = request.GET.get('codigo')
    prod = Products.objects.get(code=product_code)
    context = {
        'name': prod.name,
        'amount': prod.amount
    }
    return render(request, 'products/Delete_product.html', context)

@login_required(login_url='/')
def ModalUpdateProduct(request):
    product_info_json = request.GET.get('product_info', None)
    if product_info_json:
        product_info = json.loads(product_info_json)
        context = {
            'product_info': product_info
        }
    else:
        print('Ocurrio un errror al obtener al información')
    return render(request, 'products/Form_update_product.html', context)