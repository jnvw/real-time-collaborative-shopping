import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Cart

class CartConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.family_id = self.scope['url_route']['kwargs']['family_id']
        self.family_group_name = f'family_{self.family_id}'

        # Join family group
        await self.channel_layer.group_add(
            self.family_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave family group
        await self.channel_layer.group_discard(
            self.family_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data['action']
        cart = Cart.objects.get(family_id=self.family_id)

        if action == 'add_item':
            cart.items.append(data['item'])
            cart.save()

            # Send updated cart to group
            await self.channel_layer.group_send(
                self.family_group_name,
                {
                    'type': 'cart_update',
                    'cart': cart.items,
                }
            )

    async def cart_update(self, event):
        cart = event['cart']

        # Send updated cart to WebSocket
        await self.send(text_data=json.dumps({
            'cart': cart
        }))
