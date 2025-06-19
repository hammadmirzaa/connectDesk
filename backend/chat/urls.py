from django.urls import path
from .views import MessageApiView, RegisterApiView, UserListApiView
from rest_framework_simplejwt.views import TokenObtainPairView
from .views import CreateRoomView, AddMemberView, RoomMessagesView, SendRoomMessageView, MyRoomsApiView, RoomMembersApiView

urlpatterns = [
    path('messages', MessageApiView.as_view(), name='messages'),
    path('register', RegisterApiView.as_view(), name='register'),
    path('login', TokenObtainPairView.as_view(), name='login'),
    path('users', UserListApiView.as_view(), name='user-list'),
    path('rooms/create', CreateRoomView.as_view(), name='create-room'),
    path('rooms/<int:room_id>/add', AddMemberView.as_view(), name='add-member'),
    path('rooms/<int:room_id>/messages', RoomMessagesView.as_view(), name='room-messages'),
    path('rooms/<int:room_id>/send', SendRoomMessageView.as_view(), name='send-room-message'),
    path('rooms/my-rooms', MyRoomsApiView.as_view(), name='view-rooms'),
     path('rooms/<int:room_id>/members/', RoomMembersApiView.as_view()),
]
