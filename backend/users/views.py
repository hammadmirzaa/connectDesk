from django.shortcuts import render

from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer, UserListSerializer
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework import status, permissions
from django.contrib.auth import authenticate
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from rest_framework.generics import ListAPIView
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import update_session_auth_hash


@method_decorator(ensure_csrf_cookie, name='dispatch')
class CustomLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(request, username=username, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)

            response = Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "username": user.username
            }, status=status.HTTP_200_OK)

            # Set HttpOnly cookie with access token (optional, frontend can also store manually)
            response.set_cookie(
                key="access_token",
                value=str(refresh.access_token),
                httponly=False,
                secure=True,
                samesite="None"
            )


            # Also send CSRF token in a cookie
            response.set_cookie(
                key="csrftoken",
                value=get_token(request),
                httponly=False,  # CSRF token must be accessible to JavaScript
                secure=False,
                samesite='Lax'
            )

            return response
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)




class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UserListView(ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserListSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class LogoutView(APIView):
    def post(self, request):
        response = Response({"message": "Logged out."}, status=200)
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token") 
        return response
        

class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        data = request.data

        full_name = data.get("full_name", "")
        if full_name:
            parts = full_name.strip().split(" ", 1)
            user.first_name = parts[0]
            user.last_name = parts[1] if len(parts) > 1 else ""

        user.username = data.get("username", user.username)
        user.email = data.get("email", user.email)
        user.save()
        return Response({"message": "Profile updated successfully"})

    

class UpdatePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")
        confirm_password = request.data.get("confirm_password")

        if not user.check_password(current_password):
            return Response({"error": "Incorrect current password"}, status=400)

        if new_password != confirm_password:
            return Response({"error": "New passwords do not match"}, status=400)

        user.set_password(new_password)
        user.save()
        update_session_auth_hash(request, user)
        return Response({"message": "Password updated successfully"})

