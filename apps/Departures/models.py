from django.db import models
from apps.adminusers_app.models import User

# Create your models here.


class Departures(models.Model):
    name = models.CharField(max_length=100)
    exit_price = models.DecimalField(max_digits=10, decimal_places=0)
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return str(str(self.id) + ' ' + self.name)