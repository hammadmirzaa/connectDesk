from rest_framework import viewsets, permissions, status
from .models import Board, Column, Task
from .serializers import BoardSerializer, ColumnSerializer, TaskSerializer
from django.db import models
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings


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
    try:
        board = Board.objects.get(id=board_id)
    except Board.DoesNotExist:
        return Response({"error": "Board not found."}, status=status.HTTP_404_NOT_FOUND)

    if board.creator != request.user:
        return Response({"error": "Only the creator can invite members."}, status=status.HTTP_403_FORBIDDEN)

    email = request.data.get('email')
    if not email:
        return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

    # Try to add as member if user exists
    try:
        user = User.objects.get(email=email)
        if user not in board.members.all():
            board.members.add(user)
    except User.DoesNotExist:
        # User does not exist: still send invite email
        pass

    board_url = f"{request.scheme}://{request.get_host()}/boards/{board.id}/"

    send_mail(
        subject='You have been invited to a board!',
        message=(
            f'You have been invited to join the board "{board.title}".\n\n'
            f'If you do not have an account, sign up first then use this link:\n{board_url}'
        ),
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[email],
        fail_silently=False,
    )

    return Response({
        "message": f"Invite sent to {email}. If the user exists, they were added as a member."
    }, status=status.HTTP_200_OK)