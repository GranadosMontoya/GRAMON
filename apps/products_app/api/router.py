from rest_framework.routers import DefaultRouter
from django.urls import path,include,re_path
from .views import *

router = DefaultRouter()

router.register('api/products', ProductsApi, basename="prueba")

urlpatterns = [
    path('', include(router.urls)),
    re_path('api/v1/products/delete_update/', ProductUpdateView.as_view(), name='product-api'), 
    re_path('pre_venta/product/', Pre_venta.as_view()),
    re_path('return/product/', Return_venta.as_view()),
    re_path('add/product/', ModalAddProduct),
    re_path('update/product/', ModalUpdateProduct),
    re_path('info/product/',ModalInfoProduct),
    re_path('delete/product',ModalDeleteProduct),
]