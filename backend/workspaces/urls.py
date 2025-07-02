# urls.py

from django.urls import path
from .views import CreateWorkspaceView, WorkspaceListView

urlpatterns = [
    path('workspaces/', WorkspaceListView.as_view(), name='workspace-list'),
    path('workspaces/create/', CreateWorkspaceView.as_view(), name='create-workspace'),
]
