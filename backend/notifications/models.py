from django.db import models

from applications.models import Application
from careers.models import CandidateProfile
from core.ids import notification_id
from core.models import UUIDModel


class Notification(UUIDModel):
    class Channel(models.TextChoices):
        EMAIL = "EMAIL", "Email"
        IN_APP = "IN_APP", "In-app"
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        PROCESSING = "PROCESSING", "Processing"
        SENT = "SENT", "Sent"
        FAILED = "FAILED", "Failed"
        CANCELLED = "CANCELLED", "Cancelled"

    public_id = models.CharField(max_length=20, unique=True, editable=False, default=notification_id)
    candidate = models.ForeignKey(CandidateProfile, on_delete=models.PROTECT, related_name="notifications")
    application = models.ForeignKey(Application, null=True, blank=True, on_delete=models.PROTECT, related_name="notifications")
    notification_type = models.CharField(max_length=64, db_index=True)
    channel = models.CharField(max_length=16, choices=Channel.choices)
    recipient = models.CharField(max_length=320)
    payload = models.JSONField(default=dict)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.PENDING, db_index=True)
    attempts = models.PositiveSmallIntegerField(default=0)
    sent_at = models.DateTimeField(null=True, blank=True)
    read_at = models.DateTimeField(null=True, blank=True)
    failure_reason = models.TextField(blank=True)
    provider_message_id = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [models.Index(fields=("status", "created_at"))]
