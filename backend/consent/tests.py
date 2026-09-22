import uuid

from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from accounts.models import User
from audit.models import AuditLog
from .models import ConsentPolicy, ConsentRecord, CookieCategory, CookieDefinition


class ConsentApiTests(TestCase):
    def setUp(self):
        self.category = CookieCategory.objects.get(key="necessary")
        ConsentPolicy.objects.update(is_published=False)
        self.policy = ConsentPolicy.objects.create(version="test-1", title="Test policy", is_published=True, effective_at=timezone.now())
        self.identifier = uuid.uuid4()

    def test_public_config_and_minimal_record(self):
        client = APIClient()
        self.assertEqual(client.get("/api/v1/consent/config/").status_code, 200)
        response = client.post("/api/v1/consent/", {"consent_identifier": str(self.identifier), "functional": False, "analytics": True, "marketing": False}, format="json")
        self.assertEqual(response.status_code, 201)
        record = ConsentRecord.objects.get()
        self.assertTrue(record.necessary)
        self.assertIsNone(record.user)

    def test_history_requires_matching_identifier(self):
        ConsentRecord.objects.create(consent_identifier=self.identifier, policy=self.policy)
        client = APIClient()
        self.assertEqual(client.get("/api/v1/consent/history/").data, [])
        response = client.get("/api/v1/consent/history/", HTTP_X_CONSENT_IDENTIFIER=str(self.identifier))
        self.assertEqual(len(response.data), 1)

    def test_only_superadmin_manages_definitions_and_changes_are_audited(self):
        admin = User.objects.create_user(username="admin", email="admin@example.com", password="test-password", role=User.Role.ADMIN)
        superadmin = User.objects.create_superuser(username="owner", email="owner@example.com", password="test-password")
        payload = {"name": "test-storage", "category": str(self.category.id), "provider": "SENZOFT", "purpose": "Test", "duration": "Session", "storage_type": "SESSION_STORAGE", "status": "ACTIVE"}
        client = APIClient(); client.force_authenticate(admin)
        self.assertEqual(client.post("/api/v1/admin/cookie-definitions/", payload, format="json").status_code, 403)
        client.force_authenticate(superadmin)
        self.assertEqual(client.post("/api/v1/admin/cookie-definitions/", payload, format="json").status_code, 201)
        self.assertTrue(AuditLog.objects.filter(action="COOKIE_DEFINITION_CREATED").exists())
