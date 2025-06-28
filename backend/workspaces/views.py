# views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Workspace, WorkspaceActivity
from .serializers import WorkspaceSerializer
from django.contrib.auth.models import User

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
