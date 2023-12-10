#import django
from django.db import models
from django.contrib.auth.models import AbstractUser

#import local
from .managers import USerManager
# Create your models here.

class User(AbstractUser):
    """
    Modelo usuarios con campos extras a los que se tienen por defecto
    """
    GENDER_CHOICES = (
        ('Masculino', 'Masculino'),
        ('Femenino', 'Femenino')
    )
    gender = models.CharField(max_length=10, blank=True, choices=GENDER_CHOICES)

    email = models.EmailField(("email address"), unique=True)

    REQUIRED_FIELDS = ['first_name', 'last_name', 'email','is_superuser']

    full_name = models.CharField(max_length=100, default="", editable=False)
    
    objects = USerManager()

    def save(self, *args, **kwargs):
        self.first_name = self.first_name.title()
        self.last_name = self.last_name.title()
        self.full_name = f"{self.first_name} {self.last_name}"
        super().save(*args, **kwargs)


    def __str__(self):
        return self.email
