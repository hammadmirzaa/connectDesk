import uuid
from django.db import models


class Board(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    background_image = models.URLField(max_length=1000, blank=True, null=True) 
    created_at = models.DateTimeField(auto_now_add=True)


class Column(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    board = models.ForeignKey(Board, related_name='columns', on_delete=models.CASCADE)  
    title = models.CharField(max_length=255, blank=True, null=True)


class Task(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    columnId = models.ForeignKey(Column, related_name='tasks', on_delete=models.CASCADE)
    title = models.TextField(  blank=True, null=True)
