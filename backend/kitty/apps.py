from django.apps import AppConfig


class KittyConfig(AppConfig):
    name = 'kitty'

    def ready(self):
        import kitty.signals
