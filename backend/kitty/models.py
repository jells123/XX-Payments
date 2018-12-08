from django.db import models
from django.core.validators import MinValueValidator
import datetime

class Kitty(models.Model):
    amount = models.FloatField(validators=[MinValueValidator(0.0)])
    created = models.DateTimeField(default=datetime.datetime.utcnow)
    owner = models.ForeignKey('auth.User', related_name='kitties', on_delete=models.CASCADE)

    class Meta:
        ordering = ('created', )
