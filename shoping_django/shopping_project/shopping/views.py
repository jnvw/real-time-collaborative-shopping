# shopping/views.py
from rest_framework import viewsets, permissions
from rest_framework.permissions import IsAuthenticated
from .models import Cart, Product
from .serializers import CartSerializer, ProductSerializer
# shopping/views.py
from .permissions import IsCartOwner
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken


from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

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


class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated, IsCartOwner]

    def get_queryset(self):
        user = self.request.user
        family_ids = Family.objects.filter(members=user).values_list('id', flat=True)
        return Cart.objects.filter(family_id__in=family_ids)

    def perform_create(self, serializer):
        user = self.request.user
        family = Family.objects.filter(members=user).first()
        serializer.save(family=family)

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Ensure users can only access their own carts
        user = self.request.user
        family_ids = Family.objects.filter(members=user).values_list('id', flat=True)
        return Cart.objects.filter(family_id__in=family_ids)

    def perform_create(self, serializer):
        # Automatically set the family for the cart based on the user's family
        user = self.request.user
        family = Family.objects.filter(members=user).first()
        serializer.save(family=family)
