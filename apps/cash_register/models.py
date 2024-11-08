from django.db import models
from django.core.exceptions import ValidationError
from django.db.models import Sum

from django.db import models
from django.utils import timezone

class Caja(models.Model):
    id = models.CharField(max_length=12, primary_key=True, editable=False)
    fecha_apertura = models.DateTimeField(default=timezone.now)
    saldo_inicial = models.DecimalField(max_digits=10, decimal_places=2)
    saldo_final = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    total_entradas = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_salidas = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    valor_esperado = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    diferencia = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    fecha_cierre = models.DateTimeField(null=True, blank=True)
    estado = models.CharField(max_length=10, choices=[('Abierta', 'Abierta'), ('Cerrada', 'Cerrada')], default='Abierta')

    @staticmethod
    def caja_abierta_existe():
        """Verifica si ya existe una caja abierta"""
        return Caja.objects.filter(estado='Abierta').exists()
    
    @staticmethod
    def obtener_caja_abierta():
        """Verifica si ya existe una caja abierta"""
        return Caja.objects.filter(estado='Abierta').first()

    def actualizar_totales(self):
        """Actualiza el total de entradas y salidas de la caja"""
        self.total_entradas = self.transacciones.filter(tipo='entrada').aggregate(Sum('monto'))['monto__sum'] or 0
        self.total_salidas = self.transacciones.filter(tipo='salida').aggregate(Sum('monto'))['monto__sum'] or 0
        self.valor_esperado = self.saldo_inicial + self.total_entradas - self.total_salidas
        self.save()

    def cerrar_caja(self):
        """Cierra la caja y calcula la diferencia"""
        self.fecha_cierre = timezone.now()
        self.estado = 'Cerrada'
        self.actualizar_totales()
        self.diferencia = self.valor_esperado - self.saldo_final if self.saldo_final is not None else None
        self.save()

    def save(self, *args, **kwargs):
        if not self.id:
            ahora = timezone.now()
            self.id = ahora.strftime('%Y%m%d%H%M')
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
        # Obtener la caja abierta
        caja_abierta = Caja.obtener_caja_abierta()
        if not caja_abierta:
            raise ValidationError("No se pueden registrar transacciones sin una caja abierta.")
        # Asociar la transacción con la caja abierta
        self.caja = caja_abierta
        # Guardar la transacción
        super(Transaccion, self).save(*args, **kwargs)
        # Actualizar totales de la caja
        self.caja.actualizar_totales()


    def __str__(self):
        return 'N° de transaccion: ' + str(self.id)
