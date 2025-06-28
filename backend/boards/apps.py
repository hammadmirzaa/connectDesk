from django.apps import AppConfig


class BoardsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'boards'

class YourAppConfig(AppConfig):
    name = 'boards'

    def ready(self):
        import boards.signals