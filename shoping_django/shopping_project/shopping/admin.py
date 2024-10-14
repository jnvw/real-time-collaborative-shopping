from django.contrib import admin
from .models import Product,Family,Cart,Order,Shipping
# Register your models here.
admin.site.register(Product)
admin.site.register(Family)
admin.site.register(Cart)
admin.site.register(Order)
admin.site.register(Shipping)