# urls.py

from django.urls import path
from .views import CreateWorkspaceView, WorkspaceListView, AddMemberToWorkspaceView, RemoveMemberFromWorkspaceView

urlpatterns = [
    path('workspaces/', WorkspaceListView.as_view(), name='workspace-list'),
    path('workspaces/create/', CreateWorkspaceView.as_view(), name='create-workspace'),
    path('workspaces/<int:workspace_id>/add-member/', AddMemberToWorkspaceView.as_view(), name='add-workspace-member'),
    path('workspaces/<int:workspace_id>/remove-member/', RemoveMemberFromWorkspaceView.as_view(), name='remove-workspace-member'),

]
