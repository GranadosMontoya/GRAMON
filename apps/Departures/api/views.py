from django.http import HttpResponse
from rest_framework.viewsets import ModelViewSet
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from ..models import Departures
from .serializer import DeparturesSerializer, DeparturesSerializer2
from .paginated import MediumPagination
from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response


class DeparturesApi(LoginRequiredMixin, ModelViewSet):
    serializer_class = DeparturesSerializer
    queryset = Departures.objects.all()
    pagination_class = MediumPagination
    login_url = reverse_lazy('user_app:login')

    def perform_create(self, serializer):
        # Asigna el usuario logueado al campo user
        serializer.save(user=self.request.user)

    def get_queryset(self):
        queryset = self.queryset
        search = self.request.query_params.get('search', None)
        if search is not None:
            queryset = queryset.filter(
                Q(id__icontains = search)|
                Q(name__icontains = search)
            )
        return queryset

class DeparturesView(LoginRequiredMixin, APIView):
    def get(self, request):
        salida_id = request.GET.get('search')

        try:
            salida = Departures.objects.get(id=salida_id)  # Obtiene una única salida
            # Serializa la salida
            serializer = DeparturesSerializer2(salida) 

            # Recolecta los datos
            salidas_data = {
                'id': serializer.data['id'],                      # ID de la salida
                'name': serializer.data['name'],                  # Nombre de la salida
                'created_at': serializer.data['created_at'],      # Fecha de creación
                'exit_price': serializer.data['exit_price'],
                'user_full_name': serializer.data['user_full_name']
            }

            return Response({
                'info_salida': salidas_data
            }, status=200)
            
        except Departures.DoesNotExist:
            return HttpResponse('Salida no encontrada', status=404)

