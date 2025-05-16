from django.db import models
from django.contrib.auth.models import User



class Board(models.Model):
    name = models.CharField(max_length=255)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_boards')
    members = models.ManyToManyField(User, related_name='boards')
    is_public = models.BooleanField(default=False)
    is_closed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class TaskList(models.Model):
    board = models.ForeignKey(Board, on_delete=models.CASCADE, related_name='task_lists')
    title = models.CharField(max_length=255)

    def __str__(self):
        return self.title

class Task(models.Model):
    task_list = models.ForeignKey(TaskList, on_delete=models.CASCADE, related_name='tasks')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    completed = models.BooleanField(default=False)
    assigned_users = models.ManyToManyField(User, related_name='tasks', blank=True)

    def __str__(self):
        return self.name
