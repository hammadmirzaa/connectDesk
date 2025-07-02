from django.contrib import admin

# Register your models here.

from .models import Workspace, WorkspaceActivity

admin.site.register(Workspace)
admin.site.register(WorkspaceActivity)