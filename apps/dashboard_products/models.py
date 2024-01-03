from django.db import models
from apps.products_app.models import Products

# Create your models here.

class Statistics_products(models.Model):
    code_statistics = models.ForeignKey(Products, on_delete=models.CASCADE)
    product_name_statistics = models.CharField(max_length=50, blank=True)
    product_image_statistics = models.ImageField(upload_to='stats_products', blank=True)
    quantity_statistics = models.PositiveIntegerField()
    sold_value = models.DecimalField(max_digits=10, decimal_places=0)
    revenue = models.DecimalField(max_digits=10, decimal_places=0)

    def save(self, *args, **kwargs):
        # Al guardar las estadísticas, actualiza automáticamente el nombre e imagen del producto
        self.product_name_statistics = self.code_statistics.name
        self.product_image_statistics = self.code_statistics.image
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.code_statistics.code} - {self.code_statistics.name}"