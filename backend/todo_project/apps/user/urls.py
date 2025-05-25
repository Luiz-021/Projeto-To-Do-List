from rest_framework.routers import DefaultRouter
from .controllers import UserViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = router.urls
