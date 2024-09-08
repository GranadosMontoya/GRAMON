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
    estado = models.CharField(max_length=10, choices=[('abierta', 'Abierta'), ('cerrada', 'Cerrada')], default='abierta')

    @classmethod
    def get_caja_abierta(cls):
        try:
            return cls.objects.get(estado='abierta')
        except cls.DoesNotExist:
            return None  # No hay una caja abierta

    def cerrar_caja(self):
        # Verificar si la caja ya está cerrada
        if self.estado == 'cerrada':
            raise ValueError("Esta caja ya está cerrada.")

        # Obtener todas las transacciones relacionadas con esta caja
        transacciones = self.transacciones.all()

        # Calcular el total de entradas y salidas
        total_entradas = transacciones.filter(tipo='entrada').aggregate(Sum('monto'))['monto__sum'] or 0
        total_salidas = transacciones.filter(tipo='salida').aggregate(Sum('monto'))['monto__sum'] or 0

        # Calcular el saldo final
        self.saldo_final = self.saldo_inicial + total_entradas - total_salidas

        # Marcar la fecha y hora del cierre
        self.fecha_cierre = timezone.now()

        # Cambiar el estado de la caja a 'cerrada'
        self.estado = 'cerrada'

        # Guardar la caja con los nuevos valores
        self.save()

        return {
            'saldo_inicial': self.saldo_inicial,
            'total_entradas': total_entradas,
            'total_salidas': total_salidas,
            'saldo_final': self.saldo_final
        }
    
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