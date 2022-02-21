import re
from pathlib import Path

from django.core.files.storage import default_storage
from django.db import models
from django.utils.translation import gettext_lazy as _
from shortuuid.django_fields import ShortUUIDField


class File(models.Model):
    """Model representing file object."""

    id = ShortUUIDField(
        verbose_name=_("ID"), max_length=40, length=16, primary_key=True
    )
    file = models.FileField(
        verbose_name=_("file"),
        upload_to="files",
        storage=default_storage,
        max_length=255,
    )
    created = models.DateTimeField(verbose_name=_("created"), auto_now_add=True)

    @property
    def name(self) -> str:
        """Return filename stem."""
        return Path(self.file.name).name

    @property
    def root_name(self) -> str:
        """Return initial non-unique file root name."""
        match = re.match(r"(.+)_.{7}\.(.+)", self.name)
        if match is None:
            return self.name

        file_root, extension = match[1], match[2]
        return f"{file_root}.{extension}"

    @property
    def size(self) -> str:
        """Return file size in bytes."""
        return self.file.size

    class Meta:
        verbose_name = _("File")
        verbose_name_plural = _("Files")
        ordering = ["-created"]

    def clean(self) -> None:
        """Field-wide validation of file instance. Will be run even if field-level validation fails."""
        pass

    def save(self, *args, **kwargs) -> None:
        """Object create/update fields saving process."""
        self.full_clean()

        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.name

    # def get_absolute_url(self) -> str:
    #     """Return detail URL for object."""
    #     return reverse("api:file-detail", kwargs={"id": self.id})
