from rest_framework import serializers
from .models import AuditLog


class AuditLogSerializer(serializers.ModelSerializer):
    actor = serializers.CharField(source="actor.username", read_only=True)
    class Meta:
        model = AuditLog
        fields = "__all__"
        read_only_fields = fields
