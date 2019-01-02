from django.contrib.auth.models import User
from .models import Profile, Contact, Kitty, Transaction, UserEvent

from rest_framework import generics, permissions, renderers, viewsets
from rest_framework.decorators import api_view, detail_route
from rest_framework.response import Response
from rest_framework.reverse import reverse

from .permissions import IsOwnerOrReadOnly
from .serializers import KittySerializer, TransactionSerializer
from .serializers import ProfileSerializer, UserSerializer, LoginUserSerializer, ContactSerializer, UserEventSerializer
from rest_framework.decorators import action

from rest_framework.views import APIView

class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data

        # add this LOG IN event to event-log-table
        login_event = UserEvent.objects.create(user=user, event_type=UserEvent.LOGIN)

        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data
        })

class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

class CreateUserAPIView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

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
        # simply delete the token to force a login
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
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,
                          IsOwnerOrReadOnly,)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

class UserEventViewSet(viewsets.ModelViewSet):
    queryset = UserEvent.objects.all()
    serializer_class = UserEventSerializer
