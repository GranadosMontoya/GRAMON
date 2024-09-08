#import django
from django.db import models

#import local
from ..products_app.models import Products
from ..adminusers_app.models import User
from ..customers_app.models import Customer
from apps.cash_register.models import Transaccion, Caja
# Create your models here.


class Sales(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    client = models.ForeignKey(Customer, on_delete=models.CASCADE)
    products = models.ManyToManyField(Products,through='SaleProduct')
    created_at = models.DateTimeField(auto_now_add=True)
    valor_final = models.DecimalField(max_digits=99, decimal_places=2)
    pay = models.DecimalField(max_digits=99, decimal_places=0)
    change = models.DecimalField(max_digits=99, decimal_places=0,default=0)

    def __str__(self):
        return 'N° factura: ' + str(self.id)
    
    def save(self, *args, **kwargs):
        # Guardar la venta
        super(Sales, self).save(*args, **kwargs)
    
class SaleProduct(models.Model):
    sale = models.ForeignKey(Sales, on_delete=models.CASCADE)
    code = models.ForeignKey(Products, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    unit_price  = models.DecimalField(max_digits=50, decimal_places=2)
    full_value = models.DecimalField(max_digits=50, decimal_places=2)

    def __str__(self):
        return 'Producto de venta'