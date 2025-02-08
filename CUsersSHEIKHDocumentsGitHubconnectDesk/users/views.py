from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
# from rest_framework.permissions import IsAuthenticated, AllowAny

from rest_framework.generics import GenericAPIView

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from django.shortcuts import get_object_or_404


class UserListView(APIView):
    """ Get a list of users (GET) """
    def get(self, request):
        users = User.objects.values("id", "username")
        return Response({"users": list(users)}, status=status.HTTP_200_OK)


class RegisterView(APIView):

    @swagger_auto_schema(
        operation_description="Register a new user",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=["username", "password"],
            properties={
                "username": openapi.Schema(type=openapi.TYPE_STRING, description="Username"),
                "password": openapi.Schema(type=openapi.TYPE_STRING, description="Password"),
            },
        ),
        responses={
            201: openapi.Response("User registered successfully"),
            400: openapi.Response("Invalid request"),
        },
    )


    # """ Register a new user (POST) """
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response({"error": "Username and password required"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({"error": "User already exists"}, status=status.HTTP_400_BAD_REQUEST)

        User.objects.create_user(username=username, password=password)
        return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)


class UpdateUserView(APIView):

    @swagger_auto_schema(
        operation_description="Update user profile",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "username": openapi.Schema(type=openapi.TYPE_STRING, description="New username"),
                "password": openapi.Schema(type=openapi.TYPE_STRING, description="New password"),
            },
        ),
        responses={
            200: openapi.Response("User updated successfully"),
            400: openapi.Response("Invalid request"),
            401: openapi.Response("Unauthorized"),
        },
    )


    def get(self, request, user_id):
        """ Retrieve a user by ID (GET) """
        user = get_object_or_404(User, id=user_id)
        return Response({"id": user.id, "username": user.username}, status=status.HTTP_200_OK)
    

    # """ Update an existing user completely (PUT) """
    def put(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            user.username = request.data.get("username", user.username)
            user.set_password(request.data.get("password", user.password))
            user.save()
            return Response({"message": "User updated successfully"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


class PartialUpdateUserView(APIView):

    @swagger_auto_schema(
        operation_description="Update user profile",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "username": openapi.Schema(type=openapi.TYPE_STRING, description="New username"),
                "password": openapi.Schema(type=openapi.TYPE_STRING, description="New password"),
            },
        ),
        responses={
            200: openapi.Response("User updated successfully"),
            400: openapi.Response("Invalid request"),
            401: openapi.Response("Unauthorized"),
        },
    )


    # """ Partially update a user (PATCH) """
    def patch(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            if "username" in request.data:
                user.username = request.data["username"]
            if "password" in request.data:
                user.set_password(request.data["password"])
            user.save()
            return Response({"message": "User partially updated"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


class DeleteUserView(APIView):
    """ Delete a user (DELETE) """
    def delete(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            user.delete()
            return Response({"message": "User deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


# class ProtectedView(APIView):
#     """ Protected API that only authenticated users can access """
#     permission_classes = [AllowAny]

#     def get(self, request):
#         return Response({"message": "This is a protected view"}, status=status.HTTP_200_OK)


# Your Token: b5d94b349d1acf85f2f55679356c7f7e3b9c9b4f