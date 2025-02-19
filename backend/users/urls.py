from django.urls import path
from .views import (
    UserListView, UpdateUserView, 
    PartialUpdateUserView, DeleteUserView, register_view, login_view, base
) 

from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

# Swagger API Documentation
schema_view = get_schema_view(
    openapi.Info(
        title="User API",
        default_version='v1',
        description="User Management API",
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('api/users/', UserListView.as_view(), name='user-list'),      
    path('api/users/<int:user_id>/', UpdateUserView.as_view(), name='update-user'),  
    path('api/users/<int:user_id>/patch/', PartialUpdateUserView.as_view(), name='patch-user'), 
    path('api/users/<int:user_id>/delete/', DeleteUserView.as_view(), name='delete-user'), 
    path('api/register/', register_view.as_view(), name="register"),
    path('api/login/', login_view , name="login"),
    path('base', base , name="base"),
    
    # Swagger Docs
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
]
