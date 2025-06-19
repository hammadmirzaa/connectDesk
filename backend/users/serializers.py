from rest_framework import serializers
from django.contrib.auth.models import User

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
    
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
