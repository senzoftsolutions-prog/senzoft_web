import uuid

from django.conf import settings
from django.db import models

from core.models import TimeStampedModel, UUIDModel


class CookieCategory(TimeStampedModel):
    key = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=40)
    description = models.TextField()
    required = models.BooleanField(default=False)
    display_order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ("display_order",)


class CookieDefinition(TimeStampedModel):
    class Status(models.TextChoices):
        ACTIVE = "ACTIVE", "Active"
        INACTIVE = "INACTIVE", "Inactive"

    class StorageType(models.TextChoices):
        COOKIE = "COOKIE", "Cookie"
        LOCAL_STORAGE = "LOCAL_STORAGE", "Local storage"
        SESSION_STORAGE = "SESSION_STORAGE", "Session storage"

    name = models.CharField(max_length=120)
    category = models.ForeignKey(CookieCategory, on_delete=models.PROTECT, related_name="definitions")
    provider = models.CharField(max_length=120, default="SENZOFT")
    purpose = models.TextField()
    duration = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    storage_type = models.CharField(max_length=24, choices=StorageType.choices, default=StorageType.COOKIE)
    status = models.CharField(max_length=12, choices=Status.choices, default=Status.ACTIVE, db_index=True)

    class Meta:
        ordering = ("name",)
        constraints = [models.UniqueConstraint(fields=("name", "provider", "storage_type"), name="unique_consent_storage_definition")]


class ConsentPolicy(TimeStampedModel):
    version = models.CharField(max_length=32, unique=True)
    title = models.CharField(max_length=160)
    configuration = models.JSONField(default=dict, blank=True)
    is_published = models.BooleanField(default=False, db_index=True)
    effective_at = models.DateTimeField(null=True, blank=True)
    published_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name="published_consent_policies")

    class Meta:
        ordering = ("-effective_at", "-created_at")


class ConsentRecord(UUIDModel):
    consent_identifier = models.UUIDField(default=uuid.uuid4, db_index=True)
    policy = models.ForeignKey(ConsentPolicy, on_delete=models.PROTECT, related_name="records")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name="consent_records")
    necessary = models.BooleanField(default=True)
    functional = models.BooleanField(default=False)
    analytics = models.BooleanField(default=False)
    marketing = models.BooleanField(default=False)
    recorded_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ("-recorded_at",)

