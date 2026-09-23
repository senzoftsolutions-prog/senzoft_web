from datetime import timedelta
from django.core.cache import cache
from django.test import TestCase
from django.utils import timezone
from unittest.mock import patch
from rest_framework.test import APIClient

from audit.models import AuditLog
from .models import LoginVerification, User


class AdminAuthenticationTests(TestCase):
    def setUp(self):
        cache.clear()
        self.admin = User.objects.create_user(username="admin", email="admin@example.com", password="safe-test-password", role=User.Role.ADMIN)
        self.superadmin = User.objects.create_superuser(username="owner", email="owner@example.com", password="safe-test-password")
        self.candidate = User.objects.create_user(username="candidate", email="candidate@example.com", password="safe-test-password")

    def test_valid_and_invalid_login(self):
        client = APIClient()
        response = client.post("/api/v1/auth/login/", {"username": "admin", "password": "safe-test-password"})
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data["verification_required"])
        self.assertEqual(client.post("/api/v1/auth/login/", {"username": "admin", "password": "wrong-password"}).status_code, 401)
        self.assertEqual(client.post("/api/v1/auth/login/", {"username": "admin@example.com", "password": "safe-test-password"}).status_code, 200)

    @patch("accounts.verification.secrets.randbelow", return_value=123456)
    def test_non_superuser_verifies_email_code_before_tokens(self, _random):
        login = APIClient().post("/api/v1/auth/login/", {"username": "candidate", "password": "safe-test-password"}, format="json")
        self.assertNotIn("access", login.data)
        verified = APIClient().post("/api/v1/auth/verify-code/", {"challenge_id": login.data["challenge_id"], "code": "123456"}, format="json")
        self.assertEqual(verified.status_code, 200)
        self.assertIn("access", verified.data)
        self.candidate.refresh_from_db()
        self.assertTrue(self.candidate.is_email_verified)

    @patch("accounts.views.issue_login_challenge")
    def test_verified_non_superuser_can_request_passwordless_code(self, issue_challenge):
        self.candidate.is_email_verified = True
        self.candidate.save(update_fields=("is_email_verified",))
        issue_challenge.return_value = LoginVerification.objects.create(
            user=self.candidate,
            code_digest="test",
            expires_at=timezone.now() + timedelta(minutes=10),
        )
        response = APIClient().post("/api/v1/auth/request-code/", {"email": self.candidate.email, "portal": "candidate"}, format="json")
        self.assertEqual(response.status_code, 200)
        issue_challenge.assert_called_once_with(self.candidate, enforce_cooldown=True)

    def test_superadmin_cannot_use_passwordless_code(self):
        response = APIClient().post("/api/v1/auth/request-code/", {"email": self.superadmin.email, "portal": "admin"}, format="json")
        self.assertEqual(response.status_code, 400)

    def test_missing_candidate_login_uses_candidate_only_message(self):
        response = APIClient().post("/api/v1/auth/request-code/", {"email": "missing@example.com", "portal": "candidate"}, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["error"]["message"], "This candidate account doesn't exist. Create a new account.")
        self.assertNotIn("Admin", response.data["error"]["message"])

    def test_superuser_bypasses_email_code(self):
        response = APIClient().post("/api/v1/auth/login/", {"username": self.superadmin.username, "password": "safe-test-password"}, format="json")
        self.assertIn("access", response.data)
        self.assertNotIn("verification_required", response.data)

    def test_candidate_cannot_access_dashboard(self):
        client = APIClient()
        client.force_authenticate(self.candidate)
        self.assertEqual(client.get("/api/v1/admin/dashboard/").status_code, 403)

    def test_django_admin_is_superuser_only(self):
        client = APIClient()
        client.force_login(self.admin)
        self.assertEqual(client.get("/django-admin/").status_code, 302)
        superuser = User.objects.create_superuser(username="maintenance", email="maintenance@example.com", password="safe-test-password")
        client.force_login(superuser)
        self.assertEqual(client.get("/django-admin/").status_code, 200)

    def test_admin_cannot_manage_users_or_view_audit(self):
        client = APIClient()
        client.force_authenticate(self.admin)
        role_response = client.post(f"/api/v1/admin/users/{self.candidate.id}/role/", {"role": User.Role.INTERVIEWER}, format="json")
        self.assertEqual(role_response.status_code, 403)
        self.assertEqual(client.get("/api/v1/admin/audit/").status_code, 403)

    def test_admin_is_limited_to_recruitment_operations(self):
        client = APIClient()
        client.force_authenticate(self.admin)
        self.assertEqual(client.get("/api/v1/admin/jobs/").status_code, 200)
        self.assertEqual(client.get("/api/v1/admin/applications/").status_code, 200)
        self.assertEqual(client.get("/api/v1/admin/documents/").status_code, 403)
        self.assertEqual(client.get("/api/v1/admin/blogs/").status_code, 403)

    def test_superadmin_changes_role_and_status_with_audit(self):
        client = APIClient()
        client.force_authenticate(self.superadmin)
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
        client.force_authenticate(self.superadmin)
        self.assertEqual(client.post("/api/v1/admin/audit/", {"action": "INVALID"}, format="json").status_code, 405)

    def test_candidate_registration_creates_profile_with_phone(self):
        response = APIClient().post("/api/v1/auth/register/", {"username": "new@example.com", "email": "new@example.com", "password": "safe-test-password", "first_name": "New", "last_name": "Candidate", "phone": "9999999999", "phone_country": "IN"}, format="json")
        self.assertEqual(response.status_code, 201)
        profile = User.objects.get(email="new@example.com").candidate_profile
        self.assertEqual(profile.phone, "+919999999999")

    def test_registration_rejects_invalid_country_phone(self):
        response = APIClient().post("/api/v1/auth/register/", {"username": "bad@example.com", "email": "bad@example.com", "password": "safe-test-password", "first_name": "Bad", "last_name": "Phone", "phone": "1234567890", "phone_country": "IN"}, format="json")
        self.assertEqual(response.status_code, 400)
