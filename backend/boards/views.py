from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Board, TaskList, Task
from .serializers import BoardSerializer, TaskSerializer
from django.db import models
from rest_framework.permissions import IsAuthenticatedOrReadOnly

class BoardViewSet(viewsets.ModelViewSet):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        board = serializer.save(created_by=self.request.user)
        board.members.add(self.request.user)

    @action(detail=True, methods=['post'])
    def add_member(self, request, pk=None):
        board = self.get_object()
        if board.created_by != request.user:
            return Response({'detail': 'Only board creator can add members.'}, status=status.HTTP_403_FORBIDDEN)

        user_id = request.data.get('user_id')
        try:
            user = User.objects.get(id=user_id)
            board.members.add(user)
            return Response({'detail': f'{user.username} added to board.'})
        except User.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'])
    def transfer_authority(self, request, pk=None):
        board = self.get_object()
        if board.created_by != request.user:
            return Response({'detail': 'Only the current author can transfer authority.'}, status=status.HTTP_403_FORBIDDEN)

        new_author_id = request.data.get('user_id')
        try:
            new_author = User.objects.get(id=new_author_id)
            board.created_by = new_author
            board.save()
            return Response({'detail': f'Authority transferred to {new_author.username}.'})
        except User.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'])
    def leave_board(self, request, pk=None):
        board = self.get_object()
        if request.user == board.created_by:
            return Response({'detail': 'Owner must transfer authority before leaving.'}, status=status.HTTP_403_FORBIDDEN)

        board.members.remove(request.user)
        return Response({'detail': 'You have left the board.'})

    @action(detail=True, methods=['post'])
    def close_board(self, request, pk=None):
        board = self.get_object()
        if board.created_by != request.user:
            return Response({'detail': 'Only the board creator can close the board.'}, status=status.HTTP_403_FORBIDDEN)

        board.is_closed = True
        board.save()
        return Response({'detail': 'Board has been closed.'})

    def get_queryset(self):
        # Filters: public boards or those the user is part of
        return Board.objects.filter(models.Q(is_public=True) | models.Q(members=self.request.user)).distinct()


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by('-created_at')
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]