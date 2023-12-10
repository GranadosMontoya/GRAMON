from django.contrib import admin
from .models import Sales, SaleProduct


class SaleProductInline(admin.TabularInline):
    model = SaleProduct
    extra = 0

@admin.register(Sales)
class SalesAdmin(admin.ModelAdmin):
    inlines = [SaleProductInline,]
