from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, CartViewSet,AddToCartView

# Initialize the router
router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'cart', CartViewSet, basename='cart')

urlpatterns = [
    # Include all viewset routes
    path('', include(router.urls)),

    # Additional specific routes (if needed)
    # path('cart/add/<int:product_id>/', CartViewSet.as_view({'post': 'add_to_cart'}), name='add_to_cart'),
    # path('cart/add/<int:product_id>/',CartViewSet.as_view(), name='add_to_cart'),
     
   
    # path('cart/remove_from_cart/', CartViewSet.as_view({'post': 'remove_from_cart'}), name='remove_from_cart'),
    # path('cart/update_quantity/', CartViewSet.as_view({'patch': 'update_quantity'}), name='update_quantity'),
]
