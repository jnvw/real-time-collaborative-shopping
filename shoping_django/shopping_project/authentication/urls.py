from django.urls import path
from .views import RegisterView, TokenView, LoginView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', TokenView.as_view(), name='token'),
    path('login/', LoginView.as_view(), name='login'),
]
