# views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Workspace, WorkspaceActivity
from .serializers import WorkspaceSerializer
from django.contrib.auth.models import User

from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from .models import Workspace
from .serializers import WorkspaceSerializer

class CreateWorkspaceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        name = request.data.get("name")
        description = request.data.get("description")
        members = request.data.get("members", [])  # List of usernames
        
        # Create workspace
        workspace = Workspace.objects.create(
            name=name, description=description, created_by=request.user
        )
        
        # Add members to the workspace
        workspace.members.add(request.user)  # Creator is added by default
        for username in members:
            try:
                user = User.objects.get(username=username)
                workspace.members.add(user)
            except User.DoesNotExist:
                continue
        
        # Log workspace creation activity
        activity = WorkspaceActivity.objects.create(
            workspace=workspace,
            message=f"Workspace '{name}' created by {request.user.username}",
            by=request.user
        )

        return Response(WorkspaceSerializer(workspace).data, status=status.HTTP_201_CREATED)


class WorkspaceListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        workspaces = Workspace.objects.filter(members=request.user)
        return Response(WorkspaceSerializer(workspaces, many=True).data)


class AddMemberToWorkspaceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, **kwargs):  # Accepts workspace_id via kwargs
        workspace_id = kwargs.get("workspace_id")
        user_id = request.data.get("user_id")

        try:
            workspace = Workspace.objects.get(pk=workspace_id)
            user = User.objects.get(pk=user_id)
            workspace.members.add(user)

            WorkspaceActivity.objects.create(
                workspace=workspace,
                message=f"{user.username} added to workspace.",
                by=request.user
            )

            return Response({"detail": "Member added"}, status=200)
        except (Workspace.DoesNotExist, User.DoesNotExist):
            return Response({"error": "Workspace or user not found"}, status=404)


class RemoveMemberFromWorkspaceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, **kwargs):
        workspace_id = kwargs.get("workspace_id")
        user_id = request.data.get("user_id")

        try:
            workspace = Workspace.objects.get(pk=workspace_id)
            user = User.objects.get(pk=user_id)
            workspace.members.remove(user)

            WorkspaceActivity.objects.create(
                workspace=workspace,
                message=f"{user.username} removed from workspace.",
                by=request.user
            )

            return Response({"detail": "Member removed"}, status=200)
        except (Workspace.DoesNotExist, User.DoesNotExist):
            return Response({"error": "Workspace or user not found"}, status=404)


