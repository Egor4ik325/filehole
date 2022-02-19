from rest_framework import status
from rest_framework.mixins import (
    CreateModelMixin,
    DestroyModelMixin,
    ListModelMixin,
    RetrieveModelMixin,
)
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet


class PurgeModelMixin:
    """Mixing for destroying all listed queryset."""

    def purge(self, *args, **kwargs):
        # Filter queryset by query string
        queryset = self.filter_queryset(self.get_queryset())

        # Perform queryset delete
        queryset.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)


class NotUpdatableViewSet(
    CreateModelMixin,
    DestroyModelMixin,
    ListModelMixin,
    RetrieveModelMixin,
    PurgeModelMixin,
    GenericViewSet,
):
    pass
