from django.urls import path
from .views import (
    UserListView, RegisterView, UpdateUserView, 
    PartialUpdateUserView, DeleteUserView
)

from django.urls import re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
   openapi.Info(
      title="API's",
      default_version='v1',
      description="ConnectDesk",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="contact@xyz.local"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('api/users/', UserListView.as_view(), name='user-list'),         # GET all users
    path('api/register/', RegisterView.as_view(), name='register'),       # POST register user
    path('api/users/<int:user_id>/', UpdateUserView.as_view(), name='update-user'),  # PUT update user
    path('api/users/<int:user_id>/patch/', PartialUpdateUserView.as_view(), name='patch-user'),  # PATCH user
    path('api/users/<int:user_id>/delete/', DeleteUserView.as_view(), name='delete-user'),  # DELETE user
    # path('api/protected/', ProtectedView.as_view(), name='protected-view'),  # Protected route



    
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    

]
