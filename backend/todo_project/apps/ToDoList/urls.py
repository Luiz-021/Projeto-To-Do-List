from django.urls import path
from . import views

urlpatterns = [
    path('task/', views.TaskListCreateView.as_view(), name='task-create-list'),
    path('task/<int:pk>/', views.TaskRetrieveUpdateDestroyView.as_view(), name='task-detail'),
    path('task/user/', views.TaskUserView.as_view(), name='task-user-list'),
]