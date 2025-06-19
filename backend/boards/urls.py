from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BoardViewSet, ColumnViewSet, TaskViewSet, invite_member_view

router = DefaultRouter()
router.register(r'boards', BoardViewSet)
router.register(r'columns', ColumnViewSet)
router.register(r'tasks', TaskViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('boards/<uuid:board_id>/invite-member/', invite_member_view, name='invite-member'),
]
