from rest_framework.permissions import AllowAny

from ..mixins import NotUpdatableViewSet
from .models import File
from .serializers import FileSerializer


class FileViewSet(NotUpdatableViewSet):
    """ViewSet for file model."""

    # Queryset and serialization
    queryset = File.objects.all()
    serializer_class = FileSerializer  # For 400 or 404 responses

    # URLconf
    lookup_field = "id"
    lookup_url_kwarg = "id"
    lookup_value_regex = r"[^/.]+"

    # Authentication and authorization
    authentication_classes = []
    permission_classes = [AllowAny]

    def get_queryset(self):
        """Return queryset used in `list`, `retrive`, `update`, `destroy` and `purge` actions."""
        return self.queryset
