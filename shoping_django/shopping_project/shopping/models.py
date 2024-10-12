from django.contrib.auth.models import User
from django.db import models

class Family(models.Model):
    name = models.CharField(max_length=255)
    members = models.ManyToManyField(User)

class Cart(models.Model):
    family = models.ForeignKey(Family, on_delete=models.CASCADE)
    items = models.JSONField(default=list)

class Product(models.Model):
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
