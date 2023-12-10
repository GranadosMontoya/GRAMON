from django.db import models

# Create your models here.
class Customer(models.Model):
    id = models.PositiveIntegerField(primary_key=True)
    name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(max_length=254,blank=True)
    adress = models.CharField(max_length=50, blank=True)
    number = models.IntegerField()
    full_name = models.CharField(max_length=100, default="", editable=False)
    
    def save(self, *args, **kwargs):
        self.name = self.name.title()
        self.last_name = self.last_name.title()
        self.full_name = f"{self.name} {self.last_name}"
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name +' '+self.last_name