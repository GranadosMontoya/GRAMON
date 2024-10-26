#import django
from django.http import HttpResponse
from rest_framework.response import Response
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.urls import reverse_lazy
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db import transaction
import json

#import rest_framework
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.viewsets import ModelViewSet

#import local
from .seralizer import SalesSerializer, SalesHistorySales
from ..models import Sales, SaleProduct
from .paginated import MediumPagination
from apps.cash_register.models import Caja


class SalesView(LoginRequiredMixin,APIView):
    login_url = reverse_lazy('user_app:login')

    def post(self, request):
        data = request.data.copy()
        data['user'] = request.user.id

        # Inicia una transacción atómica en la vista (opcional)
        with transaction.atomic():
            serializer = SalesSerializer(data=data)
            if serializer.is_valid():
                sale = serializer.save()
                return Response({'factura': sale.id})
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_424_FAILED_DEPENDENCY)
    
    def get(self, request):
        venta_id = request.GET.get('search')
        try:
            venta = Sales.objects.get(id=venta_id)
            sale_products = SaleProduct.objects.filter(sale=venta)
            productos_data = []
            for sale_product in sale_products:
                producto_data = {
                    'code': sale_product.code.code,
                    'name': sale_product.code.name,
                    'cantidad': sale_product.quantity,
                    'precio_unitario': sale_product.unit_price,
                    'valor_total': sale_product.full_value,
                }
                productos_data.append(producto_data)
            serializer = SalesHistorySales(venta)
            response_data = {
                'info_venta': serializer.data,
                'productos': productos_data
            }
            return Response(response_data)
        except Sales.DoesNotExist:
            return HttpResponse('Venta no encontrada')
        
class SalesApi(LoginRequiredMixin,ModelViewSet):
    serializer_class = SalesHistorySales
    queryset = Sales.objects.all()
    pagination_class = MediumPagination
    login_url = reverse_lazy('user_app:login')

    def get_queryset(self):
        queryset = self.queryset
        search = self.request.query_params.get('search', None)
        if search is not None:
            queryset = queryset.filter(
                Q(id__icontains = search)|
                Q(client__name__icontains = search)|
                Q(user__first_name__icontains = search)
            )
        return queryset
    
@login_required(login_url='/')
def new_sale(request):
    caja_abierta = Caja.caja_abierta_existe()  # Método que devuelve la caja abierta
    if not caja_abierta:
        return render(request, "sales/Error_de_caja_sale.html")
    return render(request, 'sales/new_sale.html')



@login_required(login_url='/')
def factura_sale(request):
    # Comprobar si los datos 'factura_sale' están en la solicitud GET
    if request.method == 'GET' and 'factura_sale' in request.GET:
        # Obtener los datos enviados como JSON y deserializarlos
        factura_sale_json = request.GET.get('factura_sale')
        factura_sale_data = json.loads(factura_sale_json)  # Deserializar JSON a diccionario

        # Ahora tienes un diccionario con los datos de la venta
        productos = factura_sale_data.get('productos')
        info_venta = factura_sale_data.get('info_venta')

        # Enviar productos e info_venta al contexto de la plantilla
        context = {
            'productos': productos,
            'info_venta': info_venta
        }

        # Renderizar la plantilla con los datos de la factura
        return render(request, 'sales/factura_sale.html', context)

    # En caso de que no se reciban datos, renderizar la plantilla habitual vacía
    return render(request, 'sales/factura_sale.html')