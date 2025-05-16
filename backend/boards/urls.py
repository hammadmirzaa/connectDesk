from django.urls import path, include
from rest_framework.routers import DefaultRouter
from boards.views import BoardViewSet, TaskViewSet

from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

router = DefaultRouter()
router.register(r'boards', BoardViewSet)
router.register(r'tasks', TaskViewSet, basename='tasks')

schema_view = get_schema_view(
   openapi.Info(
      title="ConnextDesk API",
      default_version='v1',
      description="API docs for ConnextDesk",
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [

    path('api/', include(router.urls)),
    path('api/', include(router.urls)),


    path('swagger(<format>\.json|\.yaml)', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
