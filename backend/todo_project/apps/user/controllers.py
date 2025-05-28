from rest_framework import viewsets, permissions
from .models import User
from .serializers import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if self.action in ['list', 'retrieve', 'destroy', 'update', 'partial_update'] and not user.is_superuser:
            return User.objects.filter(pk=user.pk)
        return super().get_queryset()