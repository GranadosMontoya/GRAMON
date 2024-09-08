from django.db import models

# Create your models here.


class Departures(models.Model):
    name = models.CharField(max_length=100)
    exit_price = models.DecimalField(max_digits=10, decimal_places=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(str(self.id) + ' ' + self.name)