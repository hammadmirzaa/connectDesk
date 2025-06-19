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
                httponly=True,
                secure=False,  # Set to True in production
                samesite='Lax'
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
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logout successful"}, status=status.HTTP_205_RESET_CONTENT)
        except KeyError:
            return Response({"error": "Refresh token required"}, status=status.HTTP_400_BAD_REQUEST)
        except TokenError:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
