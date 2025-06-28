# models.py

from django.db import models
from django.contrib.auth.models import User

class Workspace(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    members = models.ManyToManyField(User, related_name="workspaces")
    created_by = models.ForeignKey(User, related_name="created_workspaces", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class WorkspaceActivity(models.Model):
    workspace = models.ForeignKey(Workspace, related_name="activities", on_delete=models.CASCADE)
    message = models.CharField(max_length=500)
    by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    date = models.DateTimeField(auto_now_add=True)
