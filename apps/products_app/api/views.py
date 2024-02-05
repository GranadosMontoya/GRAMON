#import django
import json
from django.db.models import Q
from django.shortcuts import render


#import rest_framework
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework import status

#import local
from .seralizer import ProductsSerializer, UpdateProductSerializer, Pre_sale_Serializer
from ..models import Products


class ProductsApi(ModelViewSet):
    serializer_class = ProductsSerializer
    queryset = Products.objects.all()

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

class Pre_venta(APIView):
    def put(self, request):
        data = request.data
        instance = Products.objects.get(code=data['code'])  # Obtén la instancia existente
        serializer = Pre_sale_Serializer(instance, data=data, partial=True)  #partial=True para permitir campos parciales
        if serializer.is_valid():
            cantidad_producto = serializer.validated_data.get('amount')
            instance.amount -= cantidad_producto
            instance.save()
            return Response({'mensaje': 'Datos recibidos y procesados correctamente'}, status=status.HTTP_200_OK)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

class Return_venta(APIView):
    def put(self, request):
        data = request.data
        instance = Products.objects.get(code=data['code'])  # Obtén la instancia existente
        serializer = Pre_sale_Serializer(instance, data=data, partial=True)  #partial=True para permitir campos parciales
        if serializer.is_valid():
            cantidad_producto = serializer.validated_data.get('amount')
            instance.amount += cantidad_producto
            instance.save()
            return Response({'mensaje': 'Sebas, segun ya se sumo'}, status=status.HTTP_200_OK)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class ProductUpdateView(APIView):
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
    
    def get(self, request):
        return Response ({'mensaje':'no sirvo'})


def ModalAddProduct(request):
    return render(request, 'products/Form_add_product.html') 

def ModalInfoProduct(request):
    if request.method == 'GET':
        product_info_json = request.GET.get('product_info', None)
        if product_info_json:
            product_info = json.loads(product_info_json)
    context = {
        'product_info': product_info
    }
    return render(request, 'products/DetailProduct.html', context)

def ModalDeleteProduct(request):
    product_code = request.GET.get('codigo')
    prod = Products.objects.get(code=product_code)
    context = {
        'name': prod.name,
        'amount': prod.amount
    }
    return render(request, 'products/Delete_product.html', context)

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