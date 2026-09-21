from .models import AuditLog

SENSITIVE_KEYS = {"password", "token", "secret", "authorization", "document_content"}


def write_audit(*, actor, action, entity, entity_id, metadata=None, request_id=""):
    safe_metadata = {key: value for key, value in (metadata or {}).items() if key.lower() not in SENSITIVE_KEYS}
    return AuditLog.objects.create(actor=actor, action=action, entity=entity, entity_id=str(entity_id), metadata=safe_metadata, request_id=request_id)
