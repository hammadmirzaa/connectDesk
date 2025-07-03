

from django.db.models.signals import post_save, post_delete, m2m_changed, pre_delete
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Board, Column, Task, BoardActivity
from workspaces.models import Workspace

from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Board, Column, Task, BoardActivity

# @receiver(post_save, sender=Task)
# def on_task_save(sender, instance, created, **kwargs):
#     user = getattr(instance, '_activity_user', None)
#     if not user:
#         return
#     op = 'Created' if created else 'Updated'
#     BoardActivity.objects.create(
#         user=user,
#         operation='update_task' if not created else 'create_task',
#         workspace=instance.columnId.board.workspace,
#         board=instance.columnId.board,
#         column=instance.columnId,
#         task=instance,
#         details=f"{op} the Task {instance.title}"
#     )

# @receiver(post_save, sender=Column)
# def on_column_save(sender, instance, created, **kwargs):
#     user = getattr(instance, '_activity_user', None)
#     if not user:
#         return
#     op = 'Created' if created else 'Updated'
#     BoardActivity.objects.create(
#         user=user,
#         operation='update_column' if not created else 'create_column',
#         workspace=instance.board.workspace,
#         board=instance.board,
#         column=instance,
#         details=f"{op} the Column {instance.title}"
#     )

# Utility function
def log_activity(user, operation, workspace, board=None, column=None, task=None, details=None):
    BoardActivity.objects.create(
        user=user,
        operation=operation,
        workspace=workspace,
        board=board,
        column=column,
        task=task,
        details=details,
    )

# --- Board signals ---
@receiver(post_save, sender=Board)
def board_saved(sender, instance, created, **kwargs):
    user = getattr(instance, '_activity_user', None) or instance.creator

    if created:
        operation = 'create_board'
        details = f"Board '{instance.title}' created."
    else:
        if hasattr(instance, '_previous_title') and instance._previous_title != instance.title:
            details = f"Board '{instance._previous_title}' updated to '{instance.title}'"
        else:
            details = f"Board '{instance.title}' updated."
        operation = 'update_board'

    log_activity(user, operation, instance.workspace, board=instance, details=details)


@receiver(post_delete, sender=Board)
def board_deleted(sender, instance, **kwargs):
    user = instance.creator
    details = f"Board '{instance.title}' deleted."
    log_activity(user, 'delete_board', instance.workspace, board=instance, details=details)

# --- Column signals ---
@receiver(post_save, sender=Column)
def column_saved(sender, instance, created, **kwargs):
    user = getattr(instance, '_activity_user', None)
    board = instance.board
    workspace = board.workspace

    if created:
        log_activity(
            user,
            'create_column',
            workspace,
            board=board,
            column=instance,
            details=f"A new column '{instance.title}' was created in board '{board.title}'."
        )
    else:
        if hasattr(instance, '_previous_title') and instance._previous_title != instance.title:
            log_activity(
                user,
                'update_column',
                workspace,
                board=board,
                column=instance,
                details=f"In board '{board.title}', column name was updated from '{instance._previous_title}' to '{instance.title}'."
            )
        else:
            log_activity(
                user,
                'update_column',
                workspace,
                board=board,
                column=instance,
                details=f"Column '{instance.title}' was updated in board '{board.title}'."
            )

@receiver(post_save, sender=Task)
def task_saved(sender, instance, created, **kwargs):
    user = getattr(instance, '_activity_user', None)

    column = instance.columnId
    board = column.board
    workspace = board.workspace

    if created:
        log_activity(
            user,
            'create_task',
            workspace,
            board=board,
            column=column,
            task=instance,
            details=f"A new task '{instance.title}' was created in column '{column.title}'."
        )
    else:
        # Title changed
        if hasattr(instance, '_previous_title') and instance._previous_title != instance.title:
            log_activity(
                user,
                'update_task',
                workspace,
                board=board,
                column=column,
                task=instance,
                details=f"In column '{column.title}', a task's name was updated from '{instance._previous_title}' to '{instance.title}'."
            )
        else:
            log_activity(
                user,
                'update_task',
                workspace,
                board=board,
                column=column,
                task=instance,
                details=f"Task '{instance.title}' was updated in column '{column.title}'."
            )

        # Completion status change
        if hasattr(instance, '_previous_completed') and instance._previous_completed != instance.completed:
            status = "completed" if instance.completed else "incompleted"
            log_activity(
                user,
                f"{status}_task",
                workspace,
                board=board,
                column=column,
                task=instance,
                details=f"Task '{instance.title}' was marked as {status} in column '{column.title}'."
            )


@receiver(pre_delete, sender=Task)
def task_deleted(sender, instance, **kwargs):
    user = getattr(instance, '_activity_user', None)
    column = instance.columnId
    board = column.board if column else None
    workspace = board.workspace if board else None

    if not (workspace and board and column):
        return  # avoid logging incomplete/invalid entries

    details = f"Task '{instance.title}' deleted."
    log_activity(user, 'delete_task', workspace, board=board, column=column, task=None, details=details)


# --- Track Board Member Add/Remove ---
@receiver(m2m_changed, sender=Board.members.through)
def board_members_changed(sender, instance, action, pk_set, **kwargs):
    if action == "post_add":
        for user_id in pk_set:
            user = User.objects.get(id=user_id)
            log_activity(
                user=user,
                operation='add_member',
                workspace=instance.workspace,
                board=instance,
                details=f"User '{user.username}' added as member."
            )
    elif action == "post_remove":
        for user_id in pk_set:
            user = User.objects.get(id=user_id)
            log_activity(
                user=user,
                operation='remove_member',
                workspace=instance.workspace,
                board=instance,
                details=f"User '{user.username}' removed as member."
            )
