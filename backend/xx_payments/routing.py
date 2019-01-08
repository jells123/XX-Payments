from django.conf.urls import url

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

#https://channels.readthedocs.io/en/latest/topics/routing.html
channel_routing = {}

application = ProtocolTypeRouter({
    # "websocket": AuthMiddlewareStack(
    #     URLRouter()
    # ),
})