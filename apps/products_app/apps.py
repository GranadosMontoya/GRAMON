from django.apps import AppConfig


class ProductsAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.products_app'

    def ready(self):
        import apps.products_app.signals