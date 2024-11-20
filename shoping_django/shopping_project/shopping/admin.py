from django.contrib import admin
from .models import Product,Family,Order,Shipping,CartItem
# Register your models here.
admin.site.register(Product)
admin.site.register(Family)
admin.site.register(Order)
admin.site.register(Shipping)
admin.site.register(CartItem)
