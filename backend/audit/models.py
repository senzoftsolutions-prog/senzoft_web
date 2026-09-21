import uuid
from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models


class AuditLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    actor = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, on_delete=models.SET_NULL, related_name="audit_events")
    action = models.CharField(max_length=64, db_index=True)
    entity = models.CharField(max_length=120, db_index=True)
    entity_id = models.CharField(max_length=64, db_index=True)
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)
    metadata = models.JSONField(default=dict, blank=True)
    request_id = models.CharField(max_length=64, blank=True, db_index=True)

    class Meta:
        ordering = ("-timestamp",)

    def save(self, *args, **kwargs):
        if self.pk and AuditLog.objects.filter(pk=self.pk).exists():
            raise ValidationError("Audit logs are append-only.")
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        raise ValidationError("Audit logs are append-only.")
