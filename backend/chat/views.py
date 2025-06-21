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
from rest_framework.parsers import MultiPartParser, FormParser
import mimetypes
from PyPDF2 import PdfReader



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
        room = ChatRoom.objects.get(id=room_id)
        msgs = room.messages.all().order_by("timestamp")
        resp = []
        for m in msgs:
            file_url = request.build_absolute_uri(m.file.url) if m.file else None
            file_name = m.file.name.split('/')[-1] if m.file else None
            file_mime = mimetypes.guess_type(m.file.name)[0] if m.file else None
            file_size = m.file.size if m.file else None
            page_count = None

            # Get PDF page count if it's a PDF
            if file_mime == 'application/pdf' and m.file:
                try:
                    with m.file.open('rb') as f:
                        pdf = PdfReader(f)
                        page_count = len(pdf.pages)
                except Exception:
                    page_count = None

            resp.append({
                "id": m.id,
                "sender": m.sender.username,
                "content": m.content,
                "timestamp": m.timestamp,
                "file": file_url,
                "file_name": file_name,
                "file_mime": file_mime,
                "file_size": file_size,
                "pdf_pages": page_count,
            })
        return Response(resp)



class SendRoomMessageView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]  # <-- Add this

    def post(self, request, room_id):
        content = request.data.get("message", "")
        file = request.FILES.get("file")  # <-- Get uploaded file
        try:
            room = ChatRoom.objects.get(id=room_id)
        except ChatRoom.DoesNotExist:
            return Response({"error": "Room not found"}, status=404)
        if request.user not in room.members.all():
            return Response({"error": "Not a member"}, status=403)
        msg = Message.objects.create(
            sender=request.user,
            room=room,
            content=content,
            file=file  # <-- Store file
        )

        file_url = request.build_absolute_uri(msg.file.url) if msg.file else None
        file_name = msg.file.name.split('/')[-1] if msg.file else None
        file_mime = mimetypes.guess_type(file_name)[0] if file_name else None
        # Real-time push:
        pusher_client.trigger(
            f'room_{room.id}',
            'message',
            {
                "id": msg.id,
                "sender": msg.sender.username,
                "content": msg.content,
                "timestamp": msg.timestamp.isoformat(),
                "file": file_url,
                "file_name": file_name,
                "file_mime": file_mime,
            }
        )
        return Response({
            "id": msg.id,
            "sender": msg.sender.username,
            "content": msg.content,
            "timestamp": msg.timestamp,
            "file": file_url,
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
