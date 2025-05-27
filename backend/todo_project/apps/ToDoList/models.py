from django.db import models
from django.contrib.auth import get_user_model


User = get_user_model()

class Base(models.Model):
    create = models.DateField(auto_now_add=True)
    update = models.DateTimeField(auto_now=True)



class Task(Base):
    title = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField()
    completed = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='todos')

    def __str__(self):
        return self.title
