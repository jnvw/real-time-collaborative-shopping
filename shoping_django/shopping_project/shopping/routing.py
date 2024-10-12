from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/cart/<int:family_id>/', consumers.CartConsumer.as_asgi()),
]
