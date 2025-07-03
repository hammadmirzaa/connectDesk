# serializers.py

from rest_framework import serializers
from .models import Workspace, WorkspaceActivity
from django.contrib.auth.models import User

class WorkspaceActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkspaceActivity
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class WorkspaceSerializer(serializers.ModelSerializer):
    activities = WorkspaceActivitySerializer(many=True, read_only=True)
    members = UserSerializer(many=True, read_only=True)
    board_count = serializers.SerializerMethodField()

    class Meta:
        model = Workspace
        fields = ['id', 'name', 'description', 'created_by', 'members', 'activities', 'board_count']

    def get_board_count(self, obj):
        return obj.boards.count()