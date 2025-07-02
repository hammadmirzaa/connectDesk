# serializers.py

from rest_framework import serializers
from .models import Workspace, WorkspaceActivity
from django.contrib.auth.models import User

class WorkspaceActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkspaceActivity
        fields = '__all__'


class WorkspaceSerializer(serializers.ModelSerializer):
    activities = WorkspaceActivitySerializer(many=True, read_only=True)
    members = serializers.StringRelatedField(many=True)  # Shows the username

    class Meta:
        model = Workspace
        fields = ['id', 'name', 'description', 'created_by', 'members', 'activities']
