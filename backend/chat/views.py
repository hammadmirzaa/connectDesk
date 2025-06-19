from django.db.models import Q
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from .pusher import pusher_client
# Create your views here.
from .models import Message
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .pusher import pusher_client
from .models import ChatRoom, Message
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView

class RegisterApiView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        if not username or not password:
            return Response({'error': 'Please provide both username and password.'}, status=400)
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists.'}, status=400)
        user = User.objects.create_user(username=username, password=password)
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'username': user.username,
        })


# User List API (for contacts)
class UserListApiView(APIView):
    def get(self, request):
        users = User.objects.values('id', 'username')
        return Response(list(users))

class MessageApiView(APIView):
    def post(self, request):
        sender_username = request.data['sender']
        receiver_username = request.data['receiver']
        content = request.data['message']

        sender = User.objects.get(username=sender_username)
        receiver = User.objects.get(username=receiver_username)

        # Save message in DB
        msg = Message.objects.create(sender=sender, receiver=receiver, content=content)

        # Optionally trigger Pusher (include sender/receiver)
        pusher_client.trigger('chat', 'message', {
            'sender': sender.username,
            'receiver': receiver.username,
            'message': content,
            'timestamp': msg.timestamp.isoformat(),
        })

        return Response({'id': msg.id})

    def get(self, request):
        # ?user1=ali&user2=hamad
        user1 = request.GET.get('user1')
        user2 = request.GET.get('user2')
        if not user1 or not user2:
            return Response({'error': 'Need both user1 and user2 in query params'}, status=400)
        u1 = User.objects.get(username=user1)
        u2 = User.objects.get(username=user2)
        msgs = Message.objects.filter(
            Q(sender=u1, receiver=u2) | Q(sender=u2, receiver=u1)
        ).order_by('timestamp')
        return Response([
            {
                'id': m.id,
                'sender': m.sender.username,
                'receiver': m.receiver.username,
                'message': m.content,
                'timestamp': m.timestamp,
            }
            for m in msgs
        ])
    


class CreateRoomView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        name = request.data.get("name")
        members = request.data.get("members", [])  # list of usernames or IDs
        if not name:
            return Response({"error": "Room name required"}, status=400)
        room = ChatRoom.objects.create(name=name, created_by=request.user)
        room.members.add(request.user)
        # Add other members if provided
        for username in members:
            try:
                user = User.objects.get(username=username)
                room.members.add(user)
            except User.DoesNotExist:
                continue
        return Response({"id": room.id, "name": room.name})

class AddMemberView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, room_id):
        usernames = request.data.get("members", [])
        try:
            room = ChatRoom.objects.get(id=room_id)
        except ChatRoom.DoesNotExist:
            return Response({"error": "Room not found"}, status=404)
        # Only the creator or a member can add
        if request.user not in room.members.all():
            return Response({"error": "No permission"}, status=403)
        for username in usernames:
            try:
                user = User.objects.get(username=username)
                room.members.add(user)
            except User.DoesNotExist:
                continue
        return Response({"status": "added"})

class RoomMessagesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, room_id):
        try:
            room = ChatRoom.objects.get(id=room_id)
        except ChatRoom.DoesNotExist:
            return Response({"error": "Room not found"}, status=404)
        if request.user not in room.members.all():
            return Response({"error": "Not a member"}, status=403)
        msgs = room.messages.all().order_by("timestamp")
        return Response([
            {
                "id": m.id,
                "sender": m.sender.username,
                "content": m.content,
                "timestamp": m.timestamp,
            } for m in msgs
        ])

class SendRoomMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, room_id):
        content = request.data.get("message")
        try:
            room = ChatRoom.objects.get(id=room_id)
        except ChatRoom.DoesNotExist:
            return Response({"error": "Room not found"}, status=404)
        if request.user not in room.members.all():
            return Response({"error": "Not a member"}, status=403)
        msg = Message.objects.create(sender=request.user, room=room, content=content)
        
        # --- Pusher trigger here ---
        pusher_client.trigger(
            f'room_{room.id}',   # <--- unique channel per room
            'message',
            {
                "id": msg.id,
                "sender": msg.sender.username,
                "content": msg.content,
                "timestamp": msg.timestamp.isoformat(),
            }
        )
        # --------------------------
        return Response({
            "id": msg.id,
            "sender": msg.sender.username,
            "content": msg.content,
            "timestamp": msg.timestamp
        })

class MyRoomsApiView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        rooms = request.user.chatrooms.all()
        return Response([
            {"id": r.id, "name": r.name} for r in rooms
        ])
    
class RoomMembersApiView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, room_id):
        try:
            room = ChatRoom.objects.get(id=room_id)
        except ChatRoom.DoesNotExist:
            return Response({"error": "Room not found"}, status=404)
        if request.user not in room.members.all():
            return Response({"error": "Not a member"}, status=403)
        members = room.members.all().values('id', 'username')
        return Response(list(members))
