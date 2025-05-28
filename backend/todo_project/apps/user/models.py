from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    def authenticate(self, raw_password):
        return self.check_password(raw_password)

    def __str__(self):
        return self.username
