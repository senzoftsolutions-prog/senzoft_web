from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.test import TestCase
from rest_framework.test import APIClient
from unittest.mock import MagicMock, patch

from accounts.models import User
from careers.models import CandidateProfile, Job
from .models import Application, ApplicationStatusHistory, BackgroundVerification, Document, Interview, Joining, Offer
from notifications.models import Notification


class RecruitmentFoundationTests(TestCase):
    def setUp(self):
        self.candidate_user = User.objects.create_user(username="candidate", email="candidate@example.com", password="safe-test-password")
        self.recruiter = User.objects.create_user(username="recruiter", email="recruiter@example.com", password="safe-test-password", role=User.Role.RECRUITER)
        self.candidate = CandidateProfile.objects.create(user=self.candidate_user, name="Candidate", email="candidate@example.com")
        self.job = Job.objects.create(title="Backend Engineer", slug="backend-engineer", department="Engineering", location="Bengaluru", work_mode=Job.WorkMode.HYBRID, employment_type="FULL_TIME", description="Build dependable services.", status=Job.Status.PUBLISHED, created_by=self.recruiter, updated_by=self.recruiter)

    def test_public_ids_are_non_sequential_and_prefixed(self):
        self.assertTrue(self.candidate.public_id.startswith("CAN-"))
        self.assertTrue(self.job.public_id.startswith("JOB-"))

    def test_duplicate_application_is_prevented(self):
        Application.objects.create(candidate=self.candidate, job=self.job)
        with self.assertRaises(IntegrityError):
            Application.objects.create(candidate=self.candidate, job=self.job)

    def test_transition_creates_history_and_rejects_illegal_transition(self):
        application = Application.objects.create(candidate=self.candidate, job=self.job)
        application.transition_to(Application.Status.TALENT_REVIEW, self.recruiter, "Review started")
        self.assertEqual(application.status_history.count(), 1)
        with self.assertRaises(ValidationError):
            application.transition_to(Application.Status.JOINED, self.recruiter)

    def test_candidate_can_only_read_own_application(self):
        application = Application.objects.create(candidate=self.candidate, job=self.job)
        client = APIClient()
        client.force_authenticate(self.candidate_user)
        response = client.get(f"/api/v1/applications/{application.public_id}/")
        self.assertEqual(response.status_code, 200)
        other = User.objects.create_user(username="other", email="other@example.com", password="safe-test-password")
        CandidateProfile.objects.create(user=other, name="Other", email="other@example.com")
        client.force_authenticate(other)
        self.assertEqual(client.get(f"/api/v1/applications/{application.public_id}/").status_code, 404)

    def test_candidate_cannot_access_admin_jobs(self):
        client = APIClient()
        client.force_authenticate(self.candidate_user)
        self.assertEqual(client.get("/api/v1/admin/jobs/").status_code, 403)

    def test_application_api_creates_initial_history(self):
        client = APIClient()
        client.force_authenticate(self.candidate_user)
        response = client.post("/api/v1/applications/", {"job_id": self.job.public_id, "resume_version": {}}, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(ApplicationStatusHistory.objects.filter(application__public_id=response.data["id"]).count(), 1)

    def test_admin_transition_endpoint_and_unauthorized_transition(self):
        application = Application.objects.create(candidate=self.candidate, job=self.job)
        client = APIClient()
        client.force_authenticate(self.recruiter)
        response = client.post(f"/api/v1/admin/applications/{application.public_id}/transition/", {"status": "TALENT_REVIEW", "reason": "Initial review"}, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["current_status"], "TALENT_REVIEW")
        illegal = client.post(f"/api/v1/admin/applications/{application.public_id}/transition/", {"status": "JOINED"}, format="json")
        self.assertEqual(illegal.status_code, 400)
        client.force_authenticate(self.candidate_user)
        self.assertEqual(client.post(f"/api/v1/admin/applications/{application.public_id}/transition/", {"status": "SHORTLISTED"}, format="json").status_code, 403)

    def test_dashboard_uses_real_counts(self):
        Application.objects.create(candidate=self.candidate, job=self.job)
        client = APIClient()
        client.force_authenticate(self.recruiter)
        response = client.get("/api/v1/admin/dashboard/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["counts"]["jobs"], 1)
        self.assertEqual(response.data["counts"]["applications"], 1)

    def test_candidate_portal_resources_are_owned_and_dashboard_is_real(self):
        application = Application.objects.create(candidate=self.candidate, job=self.job)
        Interview.objects.create(application=application, interview_type=Interview.Type.TECHNICAL)
        Document.objects.create(candidate=self.candidate, application=application, document_type=Document.Type.IDENTITY, file_name="identity.pdf", file_size=10, mime_type="application/pdf", storage_key="test/identity.pdf")
        BackgroundVerification.objects.create(candidate=self.candidate, application=application)
        offer = Offer.objects.create(candidate=self.candidate, application=application, status=Offer.Status.ISSUED, created_by=self.recruiter, updated_by=self.recruiter)
        Joining.objects.create(candidate=self.candidate, application=application, offer=offer, joining_date="2027-01-10", location="Chennai", department="Engineering")
        notification = Notification.objects.create(candidate=self.candidate, application=application, notification_type="APPLICATION_SUBMITTED", channel=Notification.Channel.IN_APP, recipient=self.candidate.email)
        client = APIClient()
        client.force_authenticate(self.candidate_user)
        self.assertEqual(client.get("/api/v1/candidates/me/dashboard/").data["active_applications"], 1)
        self.assertEqual(client.get("/api/v1/candidates/me/interviews/").data["count"], 1)
        self.assertEqual(client.get("/api/v1/candidates/me/documents/").data["count"], 0)
        self.assertEqual(client.get("/api/v1/candidates/me/background-verifications/").data["count"], 1)
        self.assertEqual(client.get("/api/v1/candidates/me/offers/").data["count"], 1)
        self.assertEqual(client.get("/api/v1/candidates/me/joining/").data["count"], 1)
        self.assertEqual(client.post(f"/api/v1/candidates/me/notifications/{notification.public_id}/read/").status_code, 200)
        notification.refresh_from_db()
        self.assertIsNotNone(notification.read_at)

    def test_dashboard_enables_documents_only_after_bgv_starts(self):
        application = Application.objects.create(candidate=self.candidate, job=self.job)
        bgv = BackgroundVerification.objects.create(candidate=self.candidate, application=application)
        client = APIClient()
        client.force_authenticate(self.candidate_user)
        self.assertFalse(client.get("/api/v1/candidates/me/dashboard/").data["documents_enabled"])
        bgv.status = BackgroundVerification.Status.REQUESTED
        bgv.save(update_fields=("status", "updated_at"))
        response = client.get("/api/v1/candidates/me/dashboard/")
        self.assertTrue(response.data["documents_enabled"])
        self.assertEqual(response.data["bgv_status"], BackgroundVerification.Status.REQUESTED)

    def test_application_list_includes_latest_interview(self):
        application = Application.objects.create(candidate=self.candidate, job=self.job)
        interview = Interview.objects.create(application=application, interview_type=Interview.Type.HR, status=Interview.Status.SCHEDULED)
        client = APIClient()
        client.force_authenticate(self.candidate_user)
        item = client.get("/api/v1/candidates/me/applications/").data["results"][0]
        self.assertEqual(item["latest_interview"]["id"], interview.public_id)
        self.assertEqual(item["latest_interview"]["status"], Interview.Status.SCHEDULED)

    @patch("applications.views.storage_client")
    def test_bgv_documents_are_hidden_until_requested_and_can_be_uploaded(self, storage_client):
        application = Application.objects.create(candidate=self.candidate, job=self.job)
        bgv = BackgroundVerification.objects.create(candidate=self.candidate, application=application)
        storage = MagicMock()
        storage.generate_presigned_post.return_value = {"url": "https://storage.example/upload", "fields": {"key": "test"}}
        storage.head_object.return_value = {"ContentLength": 1024}
        storage_client.return_value = storage
        client = APIClient()
        client.force_authenticate(self.candidate_user)
        payload = {"file_name": "identity.pdf", "file_size": 1024, "mime_type": "application/pdf", "document_type": "IDENTITY"}
        self.assertEqual(client.post("/api/v1/candidates/me/bgv-documents/upload-request/", payload, format="json").status_code, 403)
        self.assertEqual(client.get("/api/v1/candidates/me/documents/").data["count"], 0)
        bgv.status = BackgroundVerification.Status.REQUESTED
        bgv.save(update_fields=("status", "updated_at"))
        requested = client.post("/api/v1/candidates/me/bgv-documents/upload-request/", payload, format="json")
        self.assertEqual(requested.status_code, 200)
        completed = client.post("/api/v1/candidates/me/bgv-documents/complete/", {"document_id": requested.data["document_id"]}, format="json")
        self.assertEqual(completed.status_code, 200)
        self.assertEqual(client.get("/api/v1/candidates/me/documents/").data["count"], 1)

    @patch("applications.views.storage_client")
    def test_candidate_resume_upload_request_and_completion(self, storage_client):
        storage = MagicMock()
        storage.generate_presigned_post.return_value = {"url": "https://storage.example/upload", "fields": {"key": "test"}}
        storage.head_object.return_value = {"ContentLength": 512}
        storage_client.return_value = storage
        client = APIClient()
        client.force_authenticate(self.candidate_user)
        requested = client.post("/api/v1/candidates/me/resume/upload-request/", {"file_name": "resume.pdf", "file_size": 512, "mime_type": "application/pdf"}, format="json")
        self.assertEqual(requested.status_code, 200)
        completed = client.post("/api/v1/candidates/me/resume/complete/", {"document_id": requested.data["document_id"]}, format="json")
        self.assertEqual(completed.status_code, 200)
        self.candidate.refresh_from_db()
        self.assertEqual(self.candidate.resume_metadata["file_name"], "resume.pdf")

    @patch("applications.views.storage_client")
    def test_resume_upload_rejects_invalid_type_and_is_owner_scoped(self, storage_client):
        client = APIClient()
        client.force_authenticate(self.candidate_user)
        invalid = client.post("/api/v1/candidates/me/resume/upload-request/", {"file_name": "resume.exe", "file_size": 50, "mime_type": "application/octet-stream"}, format="json")
        self.assertEqual(invalid.status_code, 400)
        other = User.objects.create_user(username="resume-other", email="resume-other@example.com", password="safe-test-password")
        other_profile = CandidateProfile.objects.create(user=other, name="Other", email=other.email)
        document = Document.objects.create(candidate=other_profile, document_type=Document.Type.RESUME, file_name="other.pdf", file_size=10, mime_type="application/pdf", storage_key="other/resume.pdf")
        denied = client.post("/api/v1/candidates/me/resume/complete/", {"document_id": document.public_id}, format="json")
        self.assertEqual(denied.status_code, 404)

    def test_candidate_cannot_access_another_candidates_resources(self):
        application = Application.objects.create(candidate=self.candidate, job=self.job)
        interview = Interview.objects.create(application=application, interview_type=Interview.Type.HR)
        offer = Offer.objects.create(candidate=self.candidate, application=application, status=Offer.Status.ISSUED, created_by=self.recruiter, updated_by=self.recruiter)
        other = User.objects.create_user(username="other-portal", email="other-portal@example.com", password="safe-test-password")
        CandidateProfile.objects.create(user=other, name="Other", email=other.email)
        client = APIClient()
        client.force_authenticate(other)
        self.assertEqual(client.get(f"/api/v1/candidates/me/interviews/{interview.public_id}/").status_code, 404)
        self.assertEqual(client.get(f"/api/v1/candidates/me/offers/{offer.public_id}/").status_code, 404)
        self.assertEqual(client.post(f"/api/v1/candidates/me/offers/{offer.public_id}/accept/").status_code, 404)

    def test_candidate_can_accept_issued_offer(self):
        application = Application.objects.create(candidate=self.candidate, job=self.job, current_status=Application.Status.OFFER_ISSUED)
        offer = Offer.objects.create(candidate=self.candidate, application=application, status=Offer.Status.ISSUED, created_by=self.recruiter, updated_by=self.recruiter)
        client = APIClient()
        client.force_authenticate(self.candidate_user)
        response = client.post(f"/api/v1/candidates/me/offers/{offer.public_id}/accept/")
        self.assertEqual(response.status_code, 200)
        application.refresh_from_db()
        self.assertEqual(application.current_status, Application.Status.OFFER_ACCEPTED)

    def test_ai_interview_complete_mock_workflow(self):
        application = Application.objects.create(candidate=self.candidate, job=self.job, current_status=Application.Status.AI_INTERVIEW_INVITED)
        interview = Interview.objects.create(application=application, interview_type=Interview.Type.AI_SCREENING, status=Interview.Status.READY, configuration={"minimum_questions": 2, "maximum_questions": 3})
        client = APIClient()
        client.force_authenticate(self.candidate_user)
        started = client.post(f"/api/v1/candidates/me/interviews/{interview.public_id}/start/")
        self.assertEqual(started.status_code, 200)
        self.assertEqual(started.data["status"], Interview.Status.IN_PROGRESS)
        for question in started.data["questions"][:2]:
            response = client.post(f"/api/v1/candidates/me/interviews/{interview.public_id}/responses/", {"question_id": question["id"], "transcript": "I solved a production problem by measuring the issue, collaborating with the team, and validating the result with monitoring."}, format="json")
            self.assertEqual(response.status_code, 201)
        event = client.post(f"/api/v1/candidates/me/interviews/{interview.public_id}/integrity-events/", {"event_type": "TAB_HIDDEN", "severity": "WARNING"}, format="json")
        self.assertEqual(event.status_code, 201)
        completed = client.post(f"/api/v1/candidates/me/interviews/{interview.public_id}/complete/")
        self.assertEqual(completed.status_code, 200)
        self.assertEqual(completed.data["status"], Interview.Status.COMPLETED)
        self.assertTrue(completed.data["evaluation_summary"]["structured_result"]["requires_human_review"])

    def test_ai_interview_rejects_duplicate_response_and_cross_candidate_access(self):
        application = Application.objects.create(candidate=self.candidate, job=self.job)
        interview = Interview.objects.create(application=application, interview_type=Interview.Type.AI_SCREENING, status=Interview.Status.READY, configuration={"minimum_questions": 1, "maximum_questions": 1})
        client = APIClient()
        client.force_authenticate(self.candidate_user)
        started = client.post(f"/api/v1/candidates/me/interviews/{interview.public_id}/start/")
        question_id = started.data["questions"][0]["id"]
        payload = {"question_id": question_id, "transcript": "A sufficiently detailed answer for deterministic evaluation and review."}
        self.assertEqual(client.post(f"/api/v1/candidates/me/interviews/{interview.public_id}/responses/", payload, format="json").status_code, 201)
        self.assertEqual(client.post(f"/api/v1/candidates/me/interviews/{interview.public_id}/responses/", payload, format="json").status_code, 409)
        other = User.objects.create_user(username="interview-other", email="interview-other@example.com", password="safe-test-password")
        CandidateProfile.objects.create(user=other, name="Other", email=other.email)
        client.force_authenticate(other)
        self.assertEqual(client.get(f"/api/v1/candidates/me/interviews/{interview.public_id}/session/").status_code, 404)

    def test_candidate_cannot_start_expired_interview(self):
        from django.utils import timezone
        from datetime import timedelta
        application = Application.objects.create(candidate=self.candidate, job=self.job)
        interview = Interview.objects.create(application=application, interview_type=Interview.Type.AI_SCREENING, status=Interview.Status.READY, expires_at=timezone.now() - timedelta(minutes=1))
        client = APIClient()
        client.force_authenticate(self.candidate_user)
        self.assertEqual(client.post(f"/api/v1/candidates/me/interviews/{interview.public_id}/start/").status_code, 410)
