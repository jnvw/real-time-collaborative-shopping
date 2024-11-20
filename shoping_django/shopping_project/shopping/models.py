from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone
from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
import uuid
from django.db import models

# models.py
from django.db import models
from django.contrib.auth.models import User  # Or your custom user model

class Family(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='families')
    invite_code = models.CharField(max_length=100, unique=True,null=True)

    def __str__(self):
        return f"{self.owner}'s family group"







class Product(models.Model):
    class Category(models.TextChoices):
        MEN = 'men', 'Men'
        WOMEN = 'women', 'Women'
        KIDS = 'kids', 'Kids'
        ELECTRONICS = 'electronics', 'Electronics'
        HOME_APPLIANCES = 'home_appliances', 'Home Appliances'
        BEAUTY = 'beauty', 'Beauty'
        SPORTS = 'sports', 'Sports'
        TOYS = 'toys', 'Toys'


    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='images/', null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    
    category = models.CharField(
        max_length=20,
        choices=Category.choices,
        default=Category.MEN,  # Set default category if needed
    )
    
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name



class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}'s Cart"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"


class Order(models.Model):
    class PaymentMethod(models.TextChoices):
        CREDIT_CARD = 'credit_card', 'Credit Card'
        PAYPAL = 'paypal', 'PayPal'
        BANK_TRANSFER = 'bank_transfer', 'Bank Transfer'
        CASH_ON_DELIVERY = 'cash_on_delivery', 'Cash on Delivery'

    class OrderStatus(models.TextChoices):
        PENDING = 'pending', 'Pending'
        PROCESSING = 'processing', 'Processing'
        COMPLETED = 'completed', 'Completed'
        CANCELLED = 'cancelled', 'Cancelled'
        REFUNDED = 'refunded', 'Refunded'

    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    products = models.ManyToManyField(Product)
    payment_method = models.CharField(
        max_length=20,
        choices=PaymentMethod.choices,
        default=PaymentMethod.CREDIT_CARD,
    )
    status = models.CharField(
        max_length=20,
        choices=OrderStatus.choices,
        default=OrderStatus.PENDING,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Order #{self.id} by {self.user.username}'


class Shipping(models.Model):
    class ShippingMethod(models.TextChoices):
        STANDARD = 'standard', 'Standard Shipping'
        EXPRESS = 'express', 'Express Shipping'
        OVERNIGHT = 'overnight', 'Overnight Shipping'

    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    shipping_method = models.CharField(
        max_length=20,
        choices=ShippingMethod.choices,
        default=ShippingMethod.STANDARD,
    )
    tracking_number = models.CharField(max_length=255, blank=True, null=True)
    shipped_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f'Shipping for Order #{self.order.id}'

