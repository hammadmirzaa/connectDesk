import uuid
from django.db import models
from django.contrib.auth.models import User
from workspaces.models import Workspace  # Import Workspace model from the workspace app

class Board(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    background_image = models.URLField(max_length=1000, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    creator = models.ForeignKey(User, related_name='created_boards', on_delete=models.CASCADE, null=True, blank=True)
    workspace = models.ForeignKey(Workspace, related_name='boards', on_delete=models.CASCADE, null=True)  # Workspace reference
    members = models.ManyToManyField(User, related_name='boards', blank=True)  # Board members field

    def save(self, *args, **kwargs):
        # Ensure that only members of the workspace can be added as members of the board
        if not self.pk:  # Check if the board is being created (not updated)
            workspace_members = self.workspace.members.all()
            self.members.set(workspace_members)  # Set initial members to workspace members
        super(Board, self).save(*args, **kwargs)

    def add_member(self, user):
        # Ensure the user belongs to the workspace before adding them to the board
        if user in self.workspace.members.all():
            self.members.add(user)
        else:
            raise ValueError(f"User {user.username} is not a member of the workspace.")

    def remove_member(self, user):
        # Only remove the user if they are part of the board members
        if user in self.members.all():
            self.members.remove(user)
        else:
            raise ValueError(f"User {user.username} is not a member of the board.")

    def __str__(self):
        return self.title



# Column model remains the same
class Column(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    board = models.ForeignKey(Board, related_name='columns', on_delete=models.CASCADE)
    title = models.CharField(max_length=255, blank=True, null=True)
    position = models.IntegerField(default=0)  # Add position field to store the order

    class Meta:
        ordering = ['position']  # Ensure columns are ordered by position
    def save(self, *args, **kwargs):
        if self.pk and Column.objects.filter(pk=self.pk).exists():
            old = Column.objects.get(pk=self.pk)
            # You can compare or use `old` here
            # e.g., if old.name != self.name: do_something()
        super().save(*args, **kwargs)


    def __str__(self):
        return self.title


# Task model remains the same
class Task(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    columnId = models.ForeignKey(Column, related_name='tasks', on_delete=models.CASCADE)
    title = models.TextField(blank=True, null=True)
    completed = models.BooleanField(default=False)
    position = models.IntegerField(default=0)  # Add position field to store the order

    class Meta:
        ordering = ['position']  # Ensure tasks are ordered by position

    def save(self, *args, **kwargs):
        if self.pk and Task.objects.filter(pk=self.pk).exists():
            old = Task.objects.get(pk=self.pk)
            self._previous_title = old.title
            self._previous_completed = old.completed
        else:
            self._previous_title = None
            self._previous_completed = None
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
    


class BoardActivity(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    workspace = models.ForeignKey(Workspace, on_delete=models.CASCADE, related_name='board_activities')
    board = models.ForeignKey(Board, on_delete=models.CASCADE, related_name='activities', null=True, blank=True)
    column = models.ForeignKey(Column, on_delete=models.SET_NULL, null=True, blank=True, related_name='activities')
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="activities" , null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    operation = models.CharField(max_length=20)  # create, update, delete, complete, incomplete, add_member, etc.
    details = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
