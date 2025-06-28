from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Task, Column
from rest_framework.response import Response
from rest_framework import status


# This signal will handle task creation, update, and deletion.
@receiver(post_save, sender=Task)
def task_created_or_updated(sender, instance, created, **kwargs):
    """
    Track task creation and update.
    """
    user = instance.creator if created else instance.last_modified_by  # Assuming you have a creator field
    operation = "created" if created else "updated"
    object_type = "task"
    message = f"User {user.username} {operation} a {object_type} with title '{instance.title}'"
    print(message)  # You can log this message or use a logging system to save it


@receiver(post_save, sender=Column)
def column_created_or_updated(sender, instance, created, **kwargs):
    """
    Track column creation and update.
    """
    user = instance.creator if created else instance.last_modified_by  # Assuming you have a creator field
    operation = "created" if created else "updated"
    object_type = "column"
    message = f"User {user.username} {operation} a {object_type} with title '{instance.title}'"
    print(message)  # You can log this message or use a logging system to save it


# This signal will handle task deletion.
@receiver(post_delete, sender=Task)
def task_deleted(sender, instance, **kwargs):
    """
    Track task deletion.
    """
    user = instance.creator  # Assuming you have a creator field on Task
    message = f"User {user.username} deleted a task with title '{instance.title}'"
    print(message)  # You can log this message or use a logging system to save it


# This signal will handle column deletion.
@receiver(post_delete, sender=Column)
def column_deleted(sender, instance, **kwargs):
    """
    Track column deletion.
    """
    user = instance.creator  # Assuming you have a creator field on Column
    message = f"User {user.username} deleted a column with title '{instance.title}'"
    print(message)  # You can log this message or use a logging system to save it
