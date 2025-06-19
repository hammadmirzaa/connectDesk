from django.db import models
from django.contrib.auth.models import User

class ChatRoom(models.Model):
    name = models.CharField(max_length=100)
    members = models.ManyToManyField(User, related_name="chatrooms")
    created_by = models.ForeignKey(User, related_name="created_chatrooms", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Message(models.Model):
    sender = models.ForeignKey(User, related_name='sent_messages', on_delete=models.CASCADE)
    room = models.ForeignKey(ChatRoom, related_name="messages", on_delete=models.CASCADE, null= True)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
