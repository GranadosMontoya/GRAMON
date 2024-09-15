from django.db import models
from django.core.exceptions import ValidationError
from django.db.models import Sum

from django.db import models
from django.utils import timezone

class Caja(models.Model):
    id = models.CharField(max_length=12, primary_key=True, editable=False)  # ID personalizado
    fecha_apertura = models.DateTimeField(default=timezone.now)
    saldo_inicial = models.DecimalField(max_digits=10, decimal_places=2)
    saldo_final = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    fecha_cierre = models.DateTimeField(null=True, blank=True)
    estado = models.CharField(max_length=10, choices=[('Abierta', 'Abierta'), ('Cerrada', 'Cerrada')], default='Abierta')

    @staticmethod
    def caja_abierta_existe():
        """Verifica si ya existe una caja abierta"""
        return Caja.objects.filter(estado='Abierta').exists()

    @classmethod
    def get_caja_abierta(cls):
        try:
            return cls.objects.get(estado='Abierta')
        except cls.DoesNotExist:
            return None  # No hay una caja abierta

    def save(self, *args, **kwargs):
        # Generar el identificador si no está definido
        if not self.id:
            ahora = timezone.now()
            self.id = ahora.strftime('%Y%m%d%H%M')  # Formato: AñoMesDíaHoraMinuto

        super(Caja, self).save(*args, **kwargs)
    
    def __str__(self):
        return 'N° de caja: ' + str(self.id)


class Transaccion(models.Model):
    caja = models.ForeignKey(Caja, on_delete=models.CASCADE, related_name='transacciones')
    tipo = models.CharField(max_length=10, choices=[('entrada', 'Entrada'), ('salida', 'Salida')])
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_transaccion = models.DateTimeField(default=timezone.now)
    descripcion = models.TextField()

    def save(self, *args, **kwargs):
        # Verificar si hay una caja abierta
        caja_abierta = Caja.get_caja_abierta()
        if not caja_abierta:
            raise ValidationError("No se pueden registrar transacciones sin una caja abierta.")
        # Asociar la transacción con la caja abierta
        self.caja = caja_abierta
        # Guardar la transacción
        super(Transaccion, self).save(*args, **kwargs)

    def __str__(self):
        return 'N° de transaccion: ' + str(self.id)