#import django
from django.db import models

#import local
from .managers_products import ProductsManager
# Create your models here.

class Products(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=50, primary_key=True)
    amount = models.IntegerField(default=0)
    entry_price = models.DecimalField(max_digits=10, decimal_places=0)
    exit_price = models.DecimalField(max_digits=10, decimal_places=0)
    image = models.ImageField(upload_to='products', height_field=None, width_field=None, max_length=None, blank=True , default='products/default/default-img.jpg')

    objects = ProductsManager()

    def save(self, *args, **kwargs):
        self.name = self.name.title()
        super().save(*args, **kwargs)

    def __str__(self):
        return str(self.code)