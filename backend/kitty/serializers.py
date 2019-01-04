from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Kitty, Transaction
from .models import Profile, Contact
from .models import UserEvent

from django.contrib.auth import authenticate


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

class KittyParticipantSerializer(serializers.ModelSerializer):
    username = serializers.SlugRelatedField(many=False, source='participant', slug_field="username", queryset=User.objects.all())

    class Meta:
        model = Transaction
        fields = ("username", "amount")

class KittySerializer(serializers.HyperlinkedModelSerializer):
    created = serializers.DateTimeField(read_only=True)
    owner = serializers.ReadOnlyField(source='owner.username')
    participants = KittyParticipantSerializer(many=True, source='transactions')

    # participants = serializers.SlugRelatedField(many=True, source='transactions', read_only=True, slug_field='amount')

    class Meta:
        model = Kitty
        fields = ('amount', 'created', 'owner', 'participants')

    def create(self, validated_data):

        # 'participants' in request (response) -> 'transactions' in models
        participants_data = validated_data.pop('transactions')
        kitty = Kitty.objects.create(**validated_data)

        new_transactions = []
        transactions_sum = 0
        for p in participants_data:
            transaction = Transaction(kitty=kitty, amount=p['amount'], participant=p['participant'])
            transactions_sum += transaction.amount
            new_transactions.append(transaction)

        if kitty.amount == transactions_sum:
            Transaction.objects.bulk_create(new_transactions)
            print("Created transactions!")
        else:
            raise serializers.ValidationError("Kitties' amounts don't match")

        return kitty


class UserSerializer(serializers.HyperlinkedModelSerializer):
    profile = ProfileSerializer(many=False, read_only=True, required=False)
    kitties = serializers.HyperlinkedRelatedField(many=True, read_only=True, view_name='kitty-detail', required=False)
    transactions = serializers.HyperlinkedRelatedField(many=True, read_only=True, view_name='transaction-detail', required=False)

    def create(self, validated_data):
        user = super().create(validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user

    class Meta:
        model = User
        #fields = ('url', 'id', 'username', 'password', 'first_name', 'last_name', 'email', 'kitties', 'profile', 'transactions')
        fields = ('url', 'id', 'username', 'password', 'kitties', 'profile', 'transactions')
        write_only_fields = ('password')
        read_only_fields = ('is_staff', 'is_superuser', 'is_active',)


class ActiveUserSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = User
        fields = ('url', 'id', 'username', 'first_name', 'last_name')


class LoginUserSerializer(serializers.HyperlinkedModelSerializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Unable to log in with provided credentials.")

    class Meta:
        model = User
        fields = ('username', 'password')


class TransactionSerializer(serializers.HyperlinkedModelSerializer):
    kitty = serializers.HyperlinkedRelatedField(many=False, view_name='kitty-detail', queryset=Kitty.objects.all())
    participant = serializers.HyperlinkedRelatedField(many=False, view_name='user-detail', queryset=User.objects.all())

    class Meta:
        model = Transaction
        fields = ("kitty", "participant", "amount", "state")

class UserEventSerializer(serializers.HyperlinkedModelSerializer):
    date = serializers.DateTimeField(format='%d.%m.%Y %H:%M:%S', read_only=True)

    class Meta:
        model = UserEvent
        fields = ('id', 'user', 'event_type', 'date')
        read_only_fields = ('date',)
