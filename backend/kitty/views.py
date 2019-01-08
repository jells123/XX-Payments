from django.contrib.auth.models import User
from .models import Profile, Contact, Kitty, Transaction, UserEvent

from rest_framework import generics, permissions, renderers, viewsets
from rest_framework.decorators import api_view, detail_route
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework import status

from .permissions import IsOwnerOrReadOnly, IsOwner
from .serializers import KittySerializer, TransactionSerializer, ActiveUserSerializer, TransactionForParticipantSerializer
from .serializers import ProfileSerializer, UserSerializer, LoginUserSerializer, ContactSerializer, UserEventSerializer
from rest_framework.decorators import action

from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken

from rest_framework import serializers
import datetime

class LoginAPI(ObtainAuthToken):

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        # add this LOG IN event to event-log-table
        login_event = UserEvent.objects.create(user=user, event_type=UserEvent.LOGIN)

        token, created = Token.objects.get_or_create(user=user)

        return Response({
            'token': token.key,
            "user": UserSerializer(user, context=serializer.context).data
        })


class ActiveUsersViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ActiveUserSerializer
    queryset = User.objects.all()

    def get_queryset(self):
        now = datetime.datetime.now() + datetime.timedelta(minutes = 10)
        # jest jakis dziwny poslizg drobny, trzeba dodac 10 min zeby miec pewnosc ze od razu po zalogowaniu sie ktos pojawi
        now_minus_10 = datetime.datetime.now() - datetime.timedelta(minutes = 10)
        active_users_ids = UserEvent.objects.filter(date__range=[now_minus_10, now]).values_list('user', flat=True)
        active_users = User.objects.filter(pk__in=active_users_ids)

        # return active_users.exclude(id=self.request.user.id)
        return active_users


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

class CreateUserAPIView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        # We create a token than will be used for future auth
        token = Token.objects.create(user=serializer.instance)
        token_data = {"token": token.key}
        return Response(
            {**serializer.data, **token_data},
            status=status.HTTP_201_CREATED,
            headers=headers
        )

class LogoutUserAPIView(APIView):
    queryset = User.objects.all()

    def get(self, request, format=None):
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

    def perform_create(self, serializer):
        serializer.is_valid()
        second_contact = Contact(profile_1=serializer.validated_data['profile_2'],
            profile_2=serializer.validated_data['profile_1'])
        second_contact.save()
        serializer.save()

class KittyViewSet(viewsets.ModelViewSet):
    queryset = Kitty.objects.all()
    serializer_class = KittySerializer
    permission_classes = (IsOwner,)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def create(self, request, *args, **kwargs):

        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)

            headers = self.get_success_headers(serializer.data)

        except serializers.ValidationError as ve:
            print(ve)
            return Response(
                {"error_message" : ve.detail},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionForParticipantSerializer

    def get_queryset(self):
        not_owner = Transaction.objects.exclude(kitty_owner=self.request.user.id)
        my_transactions = not_owner.filter(participant=self.request.user.id)
        return my_transactions.filter(state='OP').order_by('-id')

    def update(self, request, *args, **kwargs):
        print("Transaction Update!")
        return super(TransactionViewSet, self).update(request, *args, **kwargs)

class UserEventViewSet(viewsets.ModelViewSet):
    queryset = UserEvent.objects.all()
    serializer_class = UserEventSerializer
