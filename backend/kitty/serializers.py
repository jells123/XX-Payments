from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Kitty


class KittySerializer(serializers.HyperlinkedModelSerializer):
    created = serializers.DateTimeField(read_only=True)
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Kitty
        fields = ('url', 'id', 'amount', 'created', 'owner')


class UserSerializer(serializers.HyperlinkedModelSerializer):
    kitties = serializers.HyperlinkedRelatedField(many=True, view_name='kitty-detail', read_only=True)

    class Meta:
        model = User
        fields = ('url', 'id', 'username', 'first_name', 'last_name', 'kitties')
