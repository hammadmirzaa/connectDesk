from django.db import transaction
from rest_framework import viewsets, permissions, status
from .models import Board, Column, Task
from .serializers import BoardSerializer, ColumnSerializer, TaskSerializer
from django.db import models
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings
import re

from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Board, Workspace
from rest_framework.permissions import IsAuthenticated
from uuid import UUID


class AddBoardMember(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, board_id):
        # Get the board object
        board = get_object_or_404(Board, id=board_id)
        
        # Get the user ID from the request
        user_id = request.data.get("user_id")
        
        if not user_id:
            return Response({"error": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the user exists
        user = get_object_or_404(User, id=user_id)

        # Ensure that the user is part of the workspace before adding to board members
        if user not in board.workspace.members.all():
            return Response({"error": f"User {user.username} is not a member of the workspace."}, status=status.HTTP_400_BAD_REQUEST)

        # Add the user to the board members if they are part of the workspace
        board.members.add(user)
        return Response({"message": f"User {user.username} added to the board."}, status=status.HTTP_200_OK)



class BoardViewSet(viewsets.ModelViewSet):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Board.objects.filter(
            models.Q(creator=user) | models.Q(members=user)
        ).distinct()


class ColumnViewSet(viewsets.ModelViewSet):
    queryset = Column.objects.all()
    serializer_class = ColumnSerializer


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def invite_member_view(request, board_id):
    """
    Invite a user to a board by email. Only the creator can send invites.
    """
    try:
        board = Board.objects.get(id=board_id)
    except Board.DoesNotExist:
        return Response({"error": "Board not found."}, status=status.HTTP_404_NOT_FOUND)

    # Only the creator can invite members to the board
    if board.creator != request.user:
        return Response({"error": "Only the creator can invite members."}, status=status.HTTP_403_FORBIDDEN)

    email = request.data.get('email')
    if not email:
        return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

    # Validate email format
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return Response({"error": "Invalid email format."}, status=status.HTTP_400_BAD_REQUEST)

    # Try to add the user as a member if they exist
    user = None
    try:
        user = User.objects.get(email=email)
        if user not in board.members.all():
            board.members.add(user)
    except User.DoesNotExist:
        # If the user doesn't exist, we proceed to send the invite anyway
        pass

    # Construct the board URL where the user can access the board
    board_url = f"{request.scheme}://{request.get_host()}/boards/{board.id}/"

    # Send email invite
    send_mail(
        subject='You have been invited to a board!',
        message=(
            f'You have been invited to join the board "{board.title}".\n\n'
            f'If you do not have an account, sign up first and then use this link to access the board:\n{board_url}'
        ),
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[email],
        fail_silently=False,
    )

    # Respond with success message
    if user:
        return Response({
            "message": f"Invite sent to {email}. The user was added as a member if they exist."
        }, status=status.HTTP_200_OK)

    return Response({
        "message": f"Invite sent to {email}. If the user exists, they were added as a member."
    }, status=status.HTTP_200_OK)





@api_view(['POST'])
def update_column_position(request, board_id):
    """
    Update the position of columns in a board.
    """
    board = get_object_or_404(Board, id=board_id)
    positions = request.data.get('positions', [])  # Expecting an array of {'column_id': 'position'}
    
    if not positions:
        return Response({"error": "Positions data is required."}, status=status.HTTP_400_BAD_REQUEST)
    
    for position_data in positions:
        column_id = position_data.get('column_id')
        position = position_data.get('position')
        
        if not column_id or position is None:
            return Response({"error": "Each column must have a 'column_id' and 'position'."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            column = board.columns.get(id=column_id)
            column.position = position
            column.save()
        except Column.DoesNotExist:
            return Response({"error": f"Column with id {column_id} not found."}, status=status.HTTP_404_NOT_FOUND)
    
    return Response({"message": "Column positions updated successfully."}, status=status.HTTP_200_OK)


from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Task, Column

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_task_position(request, column_id):
    """
    Update task's column_id with the provided column_id.
    """
    try:
        # Retrieve the positions data (task_id and column_id)
        positions_data = request.data.get('positions', [])
        
        if not positions_data:
            return Response(
                {"error": "No positions data provided"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Process each task
        for pos in positions_data:
            task_id = pos.get('task_id')
            new_column_id = pos.get('column_id')
            
            if not task_id or not new_column_id:
                return Response(
                    {"error": "Each position must have 'task_id' and 'column_id'."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Retrieve the task
            try:
                task = Task.objects.get(id=task_id)
            except Task.DoesNotExist:
                return Response(
                    {"error": f"Task with id {task_id} not found."},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Retrieve the new column
            try:
                new_column = Column.objects.get(id=new_column_id)
            except Column.DoesNotExist:
                return Response(
                    {"error": f"Column with id {new_column_id} not found."},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Update the task's column_id
            task.columnId = new_column
            task.save()

        return Response({"message": "Task column updated successfully."}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {"error": f"Server error: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# Track operation endpoint (optional, you can directly trigger via signals)
class TrackOperationAPI(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        operation = request.data.get('operation')  # create, update, or delete
        object_type = request.data.get('object_type')  # task or column
        object_id = request.data.get('object_id')

        if not operation or not object_type or not object_id:
            return Response({"error": "Missing required fields."}, status=status.HTTP_400_BAD_REQUEST)

        # Depending on the object type (task or column), retrieve the object
        if object_type == "task":
            obj = get_object_or_404(Task, id=object_id)
        elif object_type == "column":
            obj = get_object_or_404(Column, id=object_id)
        else:
            return Response({"error": "Invalid object type."}, status=status.HTTP_400_BAD_REQUEST)

        # Assuming you have signal handlers for tasks and columns for CRUD operations
        message = ""
        if operation == "create":
            if object_type == "task":
                message = f"User {request.user.username} created a task with title '{obj.title}'."
            elif object_type == "column":
                message = f"User {request.user.username} created a column with title '{obj.title}'."
        elif operation == "update":
            if object_type == "task":
                message = f"User {request.user.username} updated a task with title '{obj.title}'."
            elif object_type == "column":
                message = f"User {request.user.username} updated a column with title '{obj.title}'."
        elif operation == "delete":
            if object_type == "task":
                message = f"User {request.user.username} deleted a task with title '{obj.title}'."
            elif object_type == "column":
                message = f"User {request.user.username} deleted a column with title '{obj.title}'."
        else:
            return Response({"error": "Invalid operation."}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": message}, status=status.HTTP_200_OK)





