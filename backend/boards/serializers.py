from rest_framework import serializers
from .models import Board, Column, Task
from django.contrib.auth.models import User
from .models import Board, Workspace

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class UserListSerializer(serializers.ModelSerializer):
    admin = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'admin']
    def get_admin(self, obj):
        request = self.context.get('request')
        print("request.user:", getattr(request, "user", None))
        if request and request.user.is_authenticated and obj == request.user:
            return True
        return False

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

    def update(self, instance, validated_data):
        position = validated_data.get('position', None)
        if position is not None:
            instance.position = position
        return super().update(instance, validated_data)

class ColumnSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)

    class Meta:
        model = Column
        fields = '__all__'

    def update(self, instance, validated_data):
        position = validated_data.get('position', None)
        if position is not None:
            instance.position = position
        return super().update(instance, validated_data)

class BoardSerializer(serializers.ModelSerializer):
    columns = ColumnSerializer(many=True, read_only=True)
    members = UserListSerializer(many=True, read_only=True)
    member_ids = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), many=True, write_only=True, required=False
    )
    creator = UserSerializer(read_only=True)

    class Meta:
        model = Board
        fields = '__all__' 

    def create(self, validated_data):
        request = self.context['request']
        creator = request.user
          # Extract workspace name and lookup the workspace
        workspace_name = validated_data.pop('workspace', None)
        workspace = Workspace.objects.get(name=workspace_name)  # Look up workspace by name
        # Extract member_ids if provided
        members = validated_data.pop('member_ids', [])
        board = Board.objects.create(creator=creator, workspace=workspace, **validated_data)
        board.members.add(creator)
        if members:
            board.members.add(*members)
        return board

    def update(self, instance, validated_data):
        members = validated_data.pop('member_ids', None)
        instance = super().update(instance, validated_data)
        if members is not None:
            instance.members.set([instance.creator] + list(members))
        return instance

