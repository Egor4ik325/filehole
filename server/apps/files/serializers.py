from rest_framework import serializers

from .models import File


class FileSerializer(serializers.ModelSerializer):
    """Serializer and deserializer for file model."""

    url = serializers.FileField(source="file", use_url=True, read_only=True)

    class Meta:
        model = File
        fields = ["id", "url", "name", "root_name", "size", "created", "file"]
        extra_kwargs = {"file": {"write_only": True}}
