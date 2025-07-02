from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BoardViewSet, ColumnViewSet, TaskViewSet, invite_member_view, AddBoardMember, update_column_position, update_task_position, TrackOperationAPI, WorkspaceActivityFeed

router = DefaultRouter()
router.register(r'boards', BoardViewSet)
router.register(r'columns', ColumnViewSet)
router.register(r'tasks', TaskViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('boards/<uuid:board_id>/invite-member/', invite_member_view, name='invite-member'),
    path('boards/<uuid:board_id>/add-member/', AddBoardMember.as_view(), name='add_board_member'),
    path('boards/<uuid:board_id>/update-column-positions/', update_column_position, name='update-column-positions'),
    path('columns/<uuid:column_id>/update-task-positions/', update_task_position, name='update-task-positions'), 
    path('track-operation/<uuid:board_id>/', TrackOperationAPI.as_view(), name='track-operation'),
    path('workspaces/<int:workspace_id>/activity/', WorkspaceActivityFeed.as_view(), name='workspace-activity-feed'),

]

