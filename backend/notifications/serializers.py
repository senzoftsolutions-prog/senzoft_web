from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="public_id", read_only=True)
    application_id = serializers.CharField(source="application.public_id", read_only=True, allow_null=True)
    title = serializers.SerializerMethodField()
    message = serializers.SerializerMethodField()
    is_read = serializers.SerializerMethodField()

    def get_title(self, obj):
        return obj.payload.get("title") or obj.notification_type.replace("_", " ").title()

    def get_message(self, obj):
        return obj.payload.get("message", "")

    def get_is_read(self, obj):
        return obj.read_at is not None

    class Meta:
        model = Notification
        fields = ("id", "application_id", "notification_type", "channel", "status", "title", "message", "is_read", "read_at", "sent_at", "created_at")
