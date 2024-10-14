from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone
class Family(models.Model):
    name = models.CharField(max_length=255)
    members = models.ManyToManyField(User)

class Cart(models.Model):
    family = models.ForeignKey(Family, on_delete=models.CASCADE)
    items = models.JSONField(default=list)



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

