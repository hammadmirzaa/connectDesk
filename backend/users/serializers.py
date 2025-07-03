from rest_framework import serializers
from django.contrib.auth.models import User

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    full_name = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'full_name']

    def create(self, validated_data):
        full_name = validated_data.pop('full_name')
        first_name, last_name = self.split_full_name(full_name)

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=first_name,
            last_name=last_name
        )
        return user

    def split_full_name(self, full_name):
        parts = full_name.strip().split(' ', 1)
        first_name = parts[0]
        last_name = parts[1] if len(parts) > 1 else ''
        return first_name, last_name
    
class UserListSerializer(serializers.ModelSerializer):
    admin = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id','full_name', 'username', 'email', 'admin', ]

    def get_admin(self, obj):
        request = self.context.get('request')
        return request and request.user.is_authenticated and obj == request.user

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()
