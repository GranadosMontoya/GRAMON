from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Products
from ..dashboard_products.models import Statistics_products

@receiver(post_save, sender=Products)
def create_statistics(sender, instance, created, **kwargs):
    """
    Este receptor se ejecuta después de guardar un nuevo producto.
    Crea automáticamente un registro de estadísticas asociado al producto.
    """
    print(f"Señal recibida para producto: {instance}")
    if created:
        Statistics_products.objects.create(code_statistics=instance, quantity_statistics=0, revenue = 0, sold_value = 0)
        print(f"Se ha creado una estadística para el producto: {instance}")