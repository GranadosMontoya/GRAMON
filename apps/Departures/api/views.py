from rest_framework.viewsets import ModelViewSet
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from ..models import Departures
from .serializer import DeparturesSerializer
from .paginated import MediumPagination

class DeparturesApi(LoginRequiredMixin, ModelViewSet):
    serializer_class = DeparturesSerializer
    queryset = Departures.objects.all()
    pagination_class = MediumPagination
    login_url = reverse_lazy('user_app:login')
