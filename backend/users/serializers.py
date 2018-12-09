from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Profile, Contact


class ContactSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Contact
        fields = ('url', 'id', 'profile_1', 'profile_2')


class ProfileSerializer(serializers.HyperlinkedModelSerializer):
    #user = serializers.HyperlinkedRelatedField(many=False, view_name='user-detail', read_only=True)
    contacts = serializers.HyperlinkedRelatedField(many=False, view_name='contact-detail', read_only=True)

    class Meta:
        model = Profile
        fields = ('url', 'id', 'phone_number', 'contacts')#, 'user')


class UserSerializer(serializers.HyperlinkedModelSerializer):
    profile = ProfileSerializer(many=False, read_only=True)

    class Meta:
        model = User
        fields = ('url', 'id', 'username', 'first_name', 'last_name', 'profile')
