from django.test import TestCase
from rest_framework.test import APIClient

from audit.models import AuditLog
from .models import User


class AdminAuthenticationTests(TestCase):
    def setUp(self):
        self.admin = User.objects.create_user(username="admin", email="admin@example.com", password="safe-test-password", role=User.Role.ADMIN)
        self.candidate = User.objects.create_user(username="candidate", email="candidate@example.com", password="safe-test-password")

    def test_valid_and_invalid_login(self):
        client = APIClient()
        self.assertEqual(client.post("/api/v1/auth/login/", {"username": "admin", "password": "safe-test-password"}).status_code, 200)
        self.assertEqual(client.post("/api/v1/auth/login/", {"username": "admin", "password": "wrong-password"}).status_code, 401)
        self.assertEqual(client.post("/api/v1/auth/login/", {"username": "admin@example.com", "password": "safe-test-password"}).status_code, 200)

    def test_candidate_cannot_access_dashboard(self):
        client = APIClient()
        client.force_authenticate(self.candidate)
        self.assertEqual(client.get("/api/v1/admin/dashboard/").status_code, 403)

    def test_admin_changes_role_and_status_with_audit(self):
        client = APIClient()
        client.force_authenticate(self.admin)
        role_response = client.post(f"/api/v1/admin/users/{self.candidate.id}/role/", {"role": User.Role.INTERVIEWER}, format="json")
        self.assertEqual(role_response.status_code, 200)
        status_response = client.post(f"/api/v1/admin/users/{self.candidate.id}/status/", {"is_active": False}, format="json")
        self.assertEqual(status_response.status_code, 200)
        self.candidate.refresh_from_db()
        self.assertEqual(self.candidate.role, User.Role.INTERVIEWER)
        self.assertFalse(self.candidate.is_active)
        self.assertEqual(AuditLog.objects.filter(entity_id=str(self.candidate.id)).count(), 2)

    def test_audit_api_is_read_only(self):
        client = APIClient()
        client.force_authenticate(self.admin)
        self.assertEqual(client.post("/api/v1/admin/audit/", {"action": "INVALID"}, format="json").status_code, 405)

    def test_candidate_registration_creates_profile_with_phone(self):
        response = APIClient().post("/api/v1/auth/register/", {"username": "new@example.com", "email": "new@example.com", "password": "safe-test-password", "first_name": "New", "last_name": "Candidate", "phone": "+919999999999"}, format="json")
        self.assertEqual(response.status_code, 201)
        profile = User.objects.get(email="new@example.com").candidate_profile
        self.assertEqual(profile.phone, "+919999999999")
