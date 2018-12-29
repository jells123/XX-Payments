from django.db import models
from django.core.validators import MinValueValidator
import datetime
from django.core.validators import RegexValidator


# https://simpleisbetterthancomplex.com/tutorial/2016/07/22/how-to-extend-django-user-model.html#onetoone
class Profile(models.Model):
    user = models.OneToOneField('auth.User', related_name='profile', on_delete=models.CASCADE)
    #image = models.ImageField(default='default.jpg', upload_to='profile_pics')

    phone_regex = RegexValidator(regex=r'^\+?1?\d{9,15}$', message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")
    phone_number = models.CharField(validators=[phone_regex], max_length=15, blank=True)

    def __str__(self):
        return f'{self.user.username} Profile'

    # def save(self, **kwargs):
    #     super().save()
    #
    #     img = Image.open(self.image.path)
    #
    #     if img.height > 300 or img.width > 300:
    #         output_size = (300, 300)
    #         img.thumbnail(output_size)
    #         img.save(self.image.path)

class Contact(models.Model):
    profile_1 = models.ForeignKey(Profile, related_name='contacts', on_delete=models.CASCADE)
    profile_2 = models.ForeignKey(Profile, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):

        if self.profile_1.id == self.profile_2.id:
            print("CONTACT: Cannot link profile to itself.")
            return
        else:
            super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.profile_1.phone_number} + {self.profile_2.phone_number} Contact'


class Kitty(models.Model):
    amount = models.FloatField(validators=[MinValueValidator(0.01)])
    created = models.DateTimeField(default=datetime.datetime.utcnow)
    owner = models.ForeignKey('auth.User', related_name='kitties', on_delete=models.CASCADE)
    # nie wiem czy nie lepiej zotawic polaczenia z userem bo wtedy latwiej go od razu sczytac z requesta...

    def __str__(self):
        return f'Owner: {self.owner.username} amount: {self.amount} Kitty'

    class Meta:
        ordering = ('created', )

class Transaction(models.Model):
    kitty = models.ForeignKey(Kitty, related_name='transactions', on_delete=models.CASCADE)
    amount = models.FloatField(validators=[MinValueValidator(0.01)])
    participant = models.ForeignKey('auth.User', related_name='transactions', on_delete=models.CASCADE)

    OPEN = 'OP'
    CLOSED = 'CL'

    KITTY_STATE_CHOICES = (
        (OPEN, 'Open'),
        (CLOSED, 'Closed'),
    )
    state = models.CharField(
        max_length=2,
        choices=KITTY_STATE_CHOICES,
        default=OPEN,
    )

    def __str__(self):
        return f'Participant: {self.participant.username} amount: {self.amount} Transaction'

class UserEvent(models.Model):

    LOGIN = 'L'; REGISTER = 'R'

    CREATE_KITTY = 'CK'
    ACCEPT_KITTY = 'AK'
    DECLINE_KITTY = 'DK'
    WAIT_KITTY = 'WK'

    EVENT_CHOICES = (
        (LOGIN, "User logged in"),
        (REGISTER, "User registered"),
        (CREATE_KITTY, "New kitty created"),
        (ACCEPT_KITTY, "User accepted joining the kitty"),
        (DECLINE_KITTY, "User declined joining the kitty"),
        (WAIT_KITTY, "User is watiting for kitty requests")
    )

    event_type = models.CharField(
        max_length=2, 
        choices=EVENT_CHOICES
    ) 
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.date} : {self.user.username} : {dict(self.EVENT_CHOICES)[self.event_type]}'
   