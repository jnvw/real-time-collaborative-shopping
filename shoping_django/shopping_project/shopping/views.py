# shopping/views.py
from rest_framework import viewsets, permissions
from rest_framework.permissions import IsAuthenticated
from .models import  Product,Family
from .serializers import  ProductSerializer
from django.shortcuts import get_object_or_404
# shopping/views.py
from rest_framework import viewsets, filters  # Import filters from DRF


from .permissions import IsCartOwner
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken # type: ignore

from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.decorators import api_view
# views.py
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.mail import send_mail
from .models import Family

from django.core.mail import send_mail
import random
import string



from rest_framework.decorators import action

# views.py

# class InviteFamilyMemberView(generics.CreateAPIView):
#     permission_classes = [IsAuthenticated]
    
#     def post(self, request):
#         email = request.data.get('email')
#         family = request.user.family  # Assume the cart owner has a family
        
#         # Create and save the invite
#         invite = FamilyInvite.objects.create(email=email, family=family)
        
#         # Send invite code via email
#         send_mail(
#             'You are invited to join a family cart',
#             f'Your invite code is: {invite.code}',
#             'from@example.com',  # Update with your email config
#             [email],
#             fail_silently=False,
#         )
        
#         return Response({"message": f"Invite sent to {email}"}, status=status.HTTP_201_CREATED)



from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action


# shopping/views.py

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import  CartItem, Product
from .serializers import CartItemSerializer


 

@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already taken'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({'error': 'Email already registered'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)
    user.save()

    return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)

class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)


# class CartViewSet(viewsets.ModelViewSet):
#     serializer_class = CartSerializer
#     permission_classes = [IsAuthenticated, IsCartOwner]

#     def get_queryset(self):
#         user = self.request.user
#         family_ids = Family.objects.filter(members=user).values_list('id', flat=True)
#         return Cart.objects.filter(family_id__in=family_ids)

#     def perform_create(self, serializer):
#         user = self.request.user
#         family = Family.objects.filter(members=user).first()
#         serializer.save(family=family)
# # Custom permission to allow only superusers to create products
class IsSuperUser(permissions.BasePermission):
    def has_permission(self, request, view):
        # Allow read permissions for any authenticated user
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        # Write permissions are only allowed to superusers
        return request.user.is_authenticated and request.user.is_superuser
        
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-created_at')  # Newest products first
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, IsSuperUser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]  # Enable filters
    filterset_fields = ['category']  # Filtering by category
    search_fields = ['name', 'category'] 
    def create(self, request, *args, **kwargs):
        # Only allow superusers to create products
        if not request.user.is_superuser:
            return Response({'error': 'Only superusers can add products.'}, status=status.HTTP_403_FORBIDDEN)
        return super().create(request, *args, **kwargs)

# class CartViewSet(viewsets.ModelViewSet):
#     serializer_class = CartSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         # Ensure users can only access their own carts
#         user = self.request.user
#         family_ids = Family.objects.filter(members=user).values_list('id', flat=True)
#         return Cart.objects.filter(family_id__in=family_ids)

#     def perform_create(self, serializer):
#         # Automatically set the family for the cart based on the user's family
#         user = self.request.user
#         family = Family.objects.filter(members=user).first()
#         serializer.save(family=family)








from .models import Product, Cart, CartItem
from .serializers import CartSerializer

class CartViewSet(viewsets.ViewSet):
    def list(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def add_to_cart(self, request):
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)
        product = get_object_or_404(Product, id=product_id)

        cart, _ = Cart.objects.get_or_create(user=request.user)

        # Check if item already in cart
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            cart_item.quantity += int(quantity)
            cart_item.save()

        return Response({"message": "Product added to cart"}, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'])
    def remove_from_cart(self, request):
        product_id = request.data.get('product_id')
        product = get_object_or_404(Product, id=product_id)

        cart = Cart.objects.filter(user=request.user).first()
        if not cart:
            return Response({"message": "Cart is empty"}, status=status.HTTP_404_NOT_FOUND)

        cart_item = CartItem.objects.filter(cart=cart, product=product).first()
        if cart_item:
            cart_item.delete()
            return Response({"message": "Product removed from cart"}, status=status.HTTP_200_OK)

        return Response({"message": "Product not in cart"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['patch'])
    def update_quantity(self, request):
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity')

        if not quantity or int(quantity) < 1:
            return Response(
                {"message": "Quantity must be at least 1"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        product = get_object_or_404(Product, id=product_id)
        cart = Cart.objects.filter(user=request.user).first()

        if not cart:
            return Response({"message": "Cart is empty"}, status=status.HTTP_404_NOT_FOUND)

        cart_item = CartItem.objects.filter(cart=cart, product=product).first()
        if cart_item:
            cart_item.quantity = int(quantity)
            cart_item.save()
            return Response({"message": "Cart item quantity updated"}, status=status.HTTP_200_OK)

        return Response({"message": "Product not in cart"}, status=status.HTTP_404_NOT_FOUND)
class AddToCartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, product_id):
        user = request.user
        quantity = request.data.get('quantity', 1)

        # Get or create the user's cart
        cart, created = Cart.objects.get_or_create(user=user)

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

        # Check if the product is already in the cart
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)

        if not created:
            # If the product is already in the cart, update the quantity
            cart_item.quantity += int(quantity)
        else:
            cart_item.quantity = quantity

        cart_item.save()

        return Response({"message": "Product added to cart successfully"}, status=status.HTTP_200_OK)
    
class CartItemsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            cart = CartItem.objects.get(user=user)
            cart_items = cart.items.all()
            items_data = [{
                "product": {
                    "id": item.product.id,
                    "name": item.product.name,
                    "price": item.product.price,
                    "image": item.product.image if item.product.image else None
                },
                "quantity": item.quantity
            } for item in cart_items]

            return Response({"items": items_data}, status=200)
        except Exception as e:
            return Response({"error":e},status=404)