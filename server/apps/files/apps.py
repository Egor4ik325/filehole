from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class FilesConfig(AppConfig):
    """Application config for files."""

    name = "apps.files"
    verbose_name = _("Files")
    label = "files"
