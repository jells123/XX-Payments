from django.urls import path, include
from . import views
from rest_framework import renderers
from rest_framework.routers import DefaultRouter

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'profiles', views.ProfileViewSet)
router.register(r'users', views.UserViewSet)
router.register(r'contacts', views.ContactViewSet)

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('profile/', include(router.urls)),
]
