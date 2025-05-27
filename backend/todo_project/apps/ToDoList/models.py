from django.db import models

class Base(models.Model):
    create = models.DateField(auto_now_add=True)
    update = models.DateTimeField(auto_now=True)



class Task(Base):
    title = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField()
    completed = models.BooleanField(default=False)

    def __str__(self):
        return self.title
