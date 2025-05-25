from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """
    Herdamos AbstractUser para já ter:
      username, password(hash), email,
      first_name, last_name, is_active, is_staff,
      is_superuser, last_login, date_joined.
    """
    def authenticate(self, raw_password):
        return self.check_password(raw_password)

    def __str__(self):
        return self.username
