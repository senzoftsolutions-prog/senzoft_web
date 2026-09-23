from django.test import TestCase
from rest_framework.test import APIClient

from accounts.models import User
from .models import CandidateProfile, Job


class JobApiTests(TestCase):
    def setUp(self):
        self.recruiter = User.objects.create_user(username="recruiter", email="recruiter@example.com", password="safe-test-password", role=User.Role.RECRUITER)

    def create_job(self, slug, status):
        return Job.objects.create(title=slug.replace("-", " ").title(), slug=slug, department="Engineering", location="Bengaluru", work_mode=Job.WorkMode.ONSITE, employment_type="FULL_TIME", description="Description", status=status, created_by=self.recruiter, updated_by=self.recruiter)

    def test_only_published_jobs_are_public(self):
        published = self.create_job("published-role", Job.Status.PUBLISHED)
        draft = self.create_job("draft-role", Job.Status.DRAFT)
        client = APIClient()
        response = client.get("/api/v1/jobs/")
        ids = [item["id"] for item in response.data["results"]]
        self.assertIn(published.public_id, ids)
        self.assertNotIn(draft.public_id, ids)

    def test_recruiter_can_create_job_and_candidate_cannot(self):
        payload = {"title": "API Engineer", "slug": "api-engineer", "department": "Engineering", "location": "Bengaluru", "work_mode": "HYBRID", "employment_type": "FULL_TIME", "description": "Build APIs", "responsibilities": [], "required_skills": []}
        client = APIClient()
        client.force_authenticate(self.recruiter)
        self.assertEqual(client.post("/api/v1/admin/jobs/", payload, format="json").status_code, 201)
        candidate = User.objects.create_user(username="candidate", email="candidate@example.com", password="safe-test-password")
        client.force_authenticate(candidate)
        self.assertEqual(client.post("/api/v1/admin/jobs/", {**payload, "slug": "blocked"}, format="json").status_code, 403)

    def test_job_lifecycle_actions_and_server_filters(self):
        job = self.create_job("lifecycle-role", Job.Status.DRAFT)
        client = APIClient()
        client.force_authenticate(self.recruiter)
        self.assertEqual(client.post(f"/api/v1/admin/jobs/{job.public_id}/publish/").status_code, 200)
        self.assertEqual(client.get("/api/v1/admin/jobs/?status=PUBLISHED&search=lifecycle").data["count"], 1)
        self.assertEqual(client.post(f"/api/v1/admin/jobs/{job.public_id}/pause/").status_code, 200)
        self.assertEqual(client.post(f"/api/v1/admin/jobs/{job.public_id}/close/").status_code, 200)
        self.assertEqual(client.post(f"/api/v1/admin/jobs/{job.public_id}/archive/").status_code, 200)
        job.refresh_from_db()
        self.assertEqual(job.status, Job.Status.ARCHIVED)

    def test_candidate_profile_normalizes_skills_and_validates_history(self):
        candidate_user = User.objects.create_user(username="profile", email="profile@example.com", password="safe-test-password")
        CandidateProfile.objects.create(user=candidate_user, name="Profile Candidate", email=candidate_user.email)
        client = APIClient()
        client.force_authenticate(candidate_user)
        valid = client.patch("/api/v1/candidates/me/", {"skills": ["Python", " python ", "Django"], "experience": [{"company": "SENZOFT", "role": "Engineer"}], "education": [{"degree": "B.Tech", "institution": "University"}]}, format="json")
        self.assertEqual(valid.status_code, 200)
        self.assertEqual(valid.data["skills"], ["Python", "Django"])
        invalid = client.patch("/api/v1/candidates/me/", {"experience": [{"company": "SENZOFT"}]}, format="json")
        self.assertEqual(invalid.status_code, 400)
