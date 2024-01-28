from django.db import models
from django.forms import ValidationError
from apps.products_app.models import Products

# Create your models here.

class Statistics_products(models.Model):
    code_statistics = models.ForeignKey(Products, on_delete=models.CASCADE)
    product_name_statistics = models.CharField(max_length=50, blank=True)
    product_image_statistics = models.ImageField(upload_to='stats_products', blank=True)
    quantity_statistics = models.PositiveIntegerField()
    sold_value = models.DecimalField(max_digits=99, decimal_places=0)
    revenue = models.DecimalField(max_digits=99, decimal_places=0)

    def save(self, *args, **kwargs):
        try:
            # Al guardar las estadísticas, actualiza automáticamente el nombre e imagen del producto
            self.product_name_statistics = self.code_statistics.name
            self.product_image_statistics = self.code_statistics.image
            super().save(*args, **kwargs)
        except Exception as e:
            # Si ocurre un error al realizar la operación decimal, muestra el mensaje de error y el valor problemático
            mensaje_error = "Error al realizar la operación decimal. Verifica los valores decimales."
            valor_problematico = getattr(self, 'algun_campo_decimal', None)
            print(f"{mensaje_error}: {str(e)}")
            print(f"Valor problemático: {valor_problematico}")
            # Puedes adaptar esta lógica según tus necesidades, como enviar un mensaje al usuario
            raise ValidationError(mensaje_error)

    def __str__(self):
        return f"{self.code_statistics.code} - {self.code_statistics.name}"