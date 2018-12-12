from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Kitty, Transaction
from .models import Profile, Contact


class ContactSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Contact
        fields = ('url', 'id', 'profile_1', 'profile_2')


class ProfileSerializer(serializers.HyperlinkedModelSerializer):
    #user = serializers.HyperlinkedRelatedField(many=False, view_name='user-detail', read_only=True)
    contacts = serializers.HyperlinkedRelatedField(many=True, view_name='contact-detail', queryset=Contact.objects.all())

    class Meta:
        model = Profile
        fields = ('url', 'id', 'phone_number', 'contacts')


class KittySerializer(serializers.HyperlinkedModelSerializer):
    created = serializers.DateTimeField(read_only=True)
    owner = serializers.ReadOnlyField(source='owner.username')
    transactions = serializers.SlugRelatedField(many=True, read_only=True, slug_field='amount')

    class Meta:
        model = Kitty
        fields = ('url', 'id', 'amount', 'created', 'owner', 'transactions')


class UserSerializer(serializers.HyperlinkedModelSerializer):
    profile = ProfileSerializer(many=False, read_only=True)
    kitties = serializers.HyperlinkedRelatedField(many=True, view_name='kitty-detail', read_only=True)
    transactions = serializers.HyperlinkedRelatedField(many=True, view_name='transaction-detail', read_only=True)

    class Meta:
        model = User
        fields = ('url', 'id', 'username', 'first_name', 'last_name', 'kitties', 'profile', 'transactions')


class TransactionSerializer(serializers.HyperlinkedModelSerializer):
    kitty = serializers.HyperlinkedRelatedField(many=False, view_name='kitty-detail', queryset=Kitty.objects.all())
    participant = serializers.HyperlinkedRelatedField(many=False, view_name='user-detail', queryset=User.objects.all())

    class Meta:
        model = Transaction
        fields = '__all__'
