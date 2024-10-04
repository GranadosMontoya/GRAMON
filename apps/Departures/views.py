import json
from django.views.generic import ListView
from django.urls import reverse_lazy
from django.contrib.auth.mixins import LoginRequiredMixin
from apps.cash_register.models import Caja


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


@login_required(login_url='/')
def ModalAddDeparture(request):
    caja_abierta = Caja.get_caja_abierta()  # Método que devuelve la caja abierta
    if not caja_abierta:
        return render(request, "departures/Error_departure.html")
    return render(request, 'departures/new_departure.html')


@login_required(login_url='/')
def factura_salida(request):
    # Comprobar si los datos 'factura_salida' están en la solicitud GET
    if request.method == 'GET' and 'factura_salida' in request.GET:
        # Obtener los datos enviados como JSON y deserializarlos
        factura_salida_json = request.GET.get('factura_salida')
        factura_salida_data = json.loads(factura_salida_json)  # Deserializar JSON a diccionario

        # Extraer la información de la salida
        info_salida = factura_salida_data.get('data_salida')

        # Enviar productos e info_salida al contexto de la plantilla
        context = {
            'salida_info': info_salida  # 'salida_info' será el diccionario en el template
        }

        print(context)
        
        # Renderizar la plantilla con los datos de la factura
        return render(request, 'departures/imprimir_salida.html', context)

    # En caso de que no se reciban datos, renderizar la plantilla habitual vacía
    return render(request, 'departures/imprimir_salida.html')
