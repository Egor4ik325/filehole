from rest_framework import serializers

from .models import File


class FileSerializer(serializers.ModelSerializer):
    """Serializer and deserializer for file model."""

    url = serializers.ReadOnlyField(source="file")

    class Meta:
        model = File
        fields = ["id", "url", "name", "size", "created"]
        read_only_fields = []
        # TODO: check whether user field should be set to request.user
        extra_kwargs = {}
