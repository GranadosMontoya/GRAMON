from django.db.models import Q
from django.db import models

class ProductsManager(models.Manager):
    
    def listar_productos(self, palabra):
        consulta = self.filter(
            Q(code__icontains = palabra) | 
            Q(name__icontains = palabra)).order_by('code')
        return consulta