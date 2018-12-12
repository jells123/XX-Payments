from django.contrib import admin
from .models import Kitty, Transaction
from .models import Profile, Contact

admin.site.register(Profile)
admin.site.register(Contact)
admin.site.register(Kitty)
admin.site.register(Transaction)
