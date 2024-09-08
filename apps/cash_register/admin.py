from django.contrib import admin
from apps.cash_register.models import Transaccion, Caja

# Register your models here.

admin.site.register(Transaccion)
admin.site.register(Caja)
