from django.utils import timezone
from rest_framework.viewsets import ModelViewSet
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from ..models import Caja
from .serializer import BoxSerializer
from .paginated import MediumPagination
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status

class BoxApi(LoginRequiredMixin, ModelViewSet):
    serializer_class = BoxSerializer
    queryset = Caja.objects.filter(estado='Abierta')
    pagination_class = MediumPagination
    login_url = reverse_lazy('user_app:login')

    def put(self, request, *args, **kwargs):
        box_id = request.data.get('box_id')  # Obtiene el ID de la caja desde los datos del formulario
        
        # Obtiene el objeto de la caja utilizando el ID proporcionado
        caja = get_object_or_404(Caja, id=box_id)

        # Asegúrate de que solo puedes cerrar la caja si está abierta
        if caja.estado != 'Abierta':
            return Response({"error": "La caja ya está cerrada."}, status=status.HTTP_400_BAD_REQUEST)

        # Actualiza los campos necesarios
        caja.saldo_final = request.data.get('saldo_final', caja.saldo_final)
        caja.fecha_cierre = timezone.now()  # Usa la fecha actual para el cierre
        caja.estado = 'Cerrada'
        caja.save()  # Guarda los cambios

        return Response(BoxSerializer(caja).data, status=status.HTTP_200_OK)
