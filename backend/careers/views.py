from django.conf import settings
from django.db.models import Count
from django.utils import timezone
from rest_framework import generics, permissions, serializers, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.views import APIView
from rest_framework.throttling import ScopedRateThrottle

from .hrms_bridge import HRMSBridgeError, list_hrms_jobs, submit_hrms_application

from core.permissions import IsCandidate, IsRecruitmentStaff
from audit.services import write_audit
from applications.serializers import ApplicationSerializer
from .models import CandidateProfile, Job
from applications.models import Application, Document
from applications.storage import bucket_name, storage_client
import hmac
from .serializers import CandidateProfileSerializer, JobAdminSerializer, PublicJobSerializer


def public_hrms_job(job):
    minimum = int(job.get("experienceMinYears") or 0)
    maximum = job.get("experienceMaxYears")
    skills = job.get("skills") or []
    requirements = str(job.get("requirements") or "")
    responsibilities = job.get("responsibilities") or []
    if isinstance(responsibilities, str):
        responsibilities = [item.strip() for item in responsibilities.splitlines() if item.strip()]
    work_mode = {"OFFICE": "ONSITE", "REMOTE": "REMOTE", "HYBRID": "HYBRID"}.get(job.get("workMode"), "ONSITE")
    return {
        "id": str(job["id"]),
        "title": job["title"],
        "slug": str(job.get("code") or job["id"]).lower(),
        "department": job.get("department") or "SENZOFT",
        "business_unit": "",
        "location": job.get("location") or "India",
        "additional_locations": [],
        "work_mode": work_mode,
        "employment_type": job.get("type") or "FULL_TIME",
        "experience_level": f"{minimum}+ years" if maximum is None else f"{minimum}-{maximum} years",
        "minimum_experience": minimum,
        "maximum_experience": maximum,
        "description": str(job.get("description") or ""),
        "responsibilities": responsibilities if isinstance(responsibilities, list) else [],
        "required_skills": skills if isinstance(skills, list) else [],
        "preferred_skills": [],
        "qualifications": [item.strip() for item in requirements.splitlines() if item.strip()],
        "benefits": [],
        "reporting_to": "",
        "travel_requirement": "",
        "hiring_eligibility": "",
        "relocation_assistance": "",
        "about_company": "",
        "number_of_openings": int(job.get("openings") or 1),
        "application_deadline": None,
        "published_at": job.get("publishedAt"),
    }


class PublicJobListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        local_jobs = list(PublicJobSerializer(Job.objects.filter(status=Job.Status.PUBLISHED).order_by("-published_at"), many=True).data)
        try:
            remote_jobs = [public_hrms_job(job) for job in list_hrms_jobs()]
        except HRMSBridgeError:
            remote_jobs = []
        jobs = remote_jobs + local_jobs
        query = request.query_params.get("search", "").strip().casefold()
        location = request.query_params.get("location", "").strip().casefold()
        experience = request.query_params.get("experience", "").strip().casefold()
        if query:
            jobs = [job for job in jobs if query in f"{job['title']} {job['description']} {' '.join(job['required_skills'])}".casefold()]
        if location:
            jobs = [job for job in jobs if location in job["location"].casefold()]
        if experience:
            jobs = [job for job in jobs if experience in job["experience_level"].casefold()]
        ordering = request.query_params.get("ordering", "-published_at")
        if ordering in ("title", "-title"):
            jobs.sort(key=lambda job: str(job.get("title", "")).casefold(), reverse=ordering.startswith("-"))
        else:
            jobs.sort(key=lambda job: str(job.get("published_at") or ""), reverse=ordering.startswith("-"))
        try:
            page = max(int(request.query_params.get("page", "1")), 1)
        except ValueError:
            page = 1
        page_size = 20
        start = (page - 1) * page_size
        page_jobs = jobs[start:start + page_size]
        next_url = request.build_absolute_uri(f"?page={page + 1}") if start + page_size < len(jobs) else None
        previous_url = request.build_absolute_uri(f"?page={page - 1}") if page > 1 else None
        return Response({"count": len(jobs), "next": next_url, "previous": previous_url, "results": page_jobs})


class PublicJobDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, job_id):
        try:
            jobs = list_hrms_jobs()
        except HRMSBridgeError:
            jobs = []
        job = next((item for item in jobs if str(item.get("id")) == job_id), None)
        if job:
            return Response(public_hrms_job(job))
        local_job = Job.objects.filter(status=Job.Status.PUBLISHED, public_id=job_id).first()
        if local_job:
            return Response(PublicJobSerializer(local_job).data)
        return Response({"detail": "Position not found."}, status=status.HTTP_404_NOT_FOUND)


class PublicHRMSApplicationSerializer(serializers.Serializer):
    source_reference = serializers.UUIDField()
    job_id = serializers.UUIDField()
    candidate_name = serializers.CharField(min_length=2, max_length=200, trim_whitespace=True)
    candidate_email = serializers.EmailField(max_length=254)
    candidate_phone = serializers.CharField(max_length=20, allow_blank=True, required=False)
    cover_letter = serializers.CharField(max_length=5000, allow_blank=True, required=False)
    linkedin_url = serializers.URLField(max_length=500, allow_blank=True, required=False)
    portfolio_url = serializers.URLField(max_length=500, allow_blank=True, required=False)
    current_role = serializers.CharField(max_length=200, allow_blank=True, required=False)
    current_company = serializers.CharField(max_length=200, allow_blank=True, required=False)
    resume_url = serializers.URLField(max_length=500, allow_blank=True, allow_null=True, required=False)
    resume_file = serializers.FileField(required=False, allow_empty_file=False, max_length=255)
    website = serializers.CharField(max_length=0, allow_blank=True, required=False)

    def validate_resume_file(self, value):
        if value.size > 3 * 1024 * 1024:
            raise serializers.ValidationError("Resume files must be 3 MB or smaller.")
        extension = value.name.rsplit(".", 1)[-1].lower() if "." in value.name else ""
        mime_by_extension = {
            "pdf": "application/pdf",
            "doc": "application/msword",
            "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        }
        expected = mime_by_extension.get(extension)
        if not expected or value.content_type not in (None, "", "application/octet-stream", expected):
            raise serializers.ValidationError("Upload a PDF or Word resume.")
        return value


class PublicHRMSApplicationView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "careers_apply"

    def post(self, request):
        serializer = PublicHRMSApplicationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        if data.get("website"):
            return Response({"detail": "Application could not be submitted."}, status=status.HTTP_400_BAD_REQUEST)
        payload = {
            "sourceReference": f"website:{data['source_reference']}",
            "jobId": str(data["job_id"]),
            "candidateName": data["candidate_name"],
            "candidateEmail": data["candidate_email"],
            "candidatePhone": data.get("candidate_phone") or None,
            "coverLetter": data.get("cover_letter") or None,
            "linkedinUrl": data.get("linkedin_url") or None,
            "portfolioUrl": data.get("portfolio_url") or None,
            "currentRole": data.get("current_role") or None,
            "currentCompany": data.get("current_company") or None,
            "resumeUrl": data.get("resume_url") or None,
        }
        try:
            result, response_status = submit_hrms_application(payload, data.get("resume_file"))
        except HRMSBridgeError as exc:
            return Response({"detail": str(exc)}, status=exc.status)
        return Response(result, status=response_status)


def hrms_integration_authorized(request):
    expected = settings.HRMS_INTEGRATION_TOKEN
    authorization = request.headers.get("Authorization", "")
    supplied = authorization[7:].strip() if authorization.lower().startswith("bearer ") else ""
    return bool(expected and supplied and hmac.compare_digest(expected, supplied))


class HRMSLegacySnapshotView(APIView):
    """Private, paginated read-only export of website jobs and applications."""
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        if not hrms_integration_authorized(request):
            return Response({"detail": "Integration credentials are missing or invalid."}, status=status.HTTP_403_FORBIDDEN)

        resource = request.query_params.get("resource", "jobs")
        if resource not in {"jobs", "applications"}:
            return Response({"detail": "Unknown snapshot resource."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            page = max(int(request.query_params.get("page", "1")), 1)
        except ValueError:
            page = 1
        page_size = 100
        queryset = Job.objects.all().order_by("pk") if resource == "jobs" else Application.objects.select_related("candidate", "job").prefetch_related("status_history").order_by("pk")
        total = queryset.count()
        rows = queryset[(page - 1) * page_size:page * page_size]
        if resource == "jobs":
            results = [{
                "id": str(job.public_id), "title": job.title, "code": job.slug,
                "department": job.department, "location": job.location,
                "type": job.employment_type, "workMode": job.work_mode,
                "status": job.status, "description": job.description,
                "requirements": "\n".join(job.qualifications or []),
                "responsibilities": "\n".join(job.responsibilities or []),
                "skills": job.required_skills or [], "growthOpportunities": [],
                "benefits": "\n".join(job.benefits or []), "openings": job.number_of_openings,
                "experienceMinYears": job.minimum_experience,
                "experienceMaxYears": job.maximum_experience,
                "publishedAt": job.published_at, "updatedAt": job.updated_at,
            } for job in rows]
        else:
            results = [{
                "id": str(app.public_id), "jobId": str(app.job.public_id),
                "candidateName": app.candidate.name, "candidateEmail": app.candidate.email,
                "candidatePhone": app.candidate.phone, "status": app.current_status,
                "source": app.source, "appliedAt": app.applied_at,
                "resumeVersion": app.resume_version, "profileSnapshot": app.profile_snapshot,
                "candidateProfile": {
                    "location": app.candidate.location, "addressLine1": app.candidate.address_line1,
                    "addressLine2": app.candidate.address_line2, "city": app.candidate.city,
                    "state": app.candidate.state, "postalCode": app.candidate.postal_code,
                    "country": app.candidate.country, "professionalSummary": app.candidate.professional_summary,
                    "currentRole": app.candidate.current_role, "yearsOfExperience": app.candidate.years_of_experience,
                    "skills": app.candidate.skills, "experience": app.candidate.experience,
                    "education": app.candidate.education, "certifications": app.candidate.certifications,
                    "resumeMetadata": app.candidate.resume_metadata, "linkedinUrl": app.candidate.linkedin_url,
                    "portfolioUrl": app.candidate.portfolio_url,
                },
                "statusHistory": [{
                    "previousStatus": row.previous_status, "status": row.new_status,
                    "changedAt": row.timestamp, "reason": row.reason,
                } for row in app.status_history.all()],
            } for app in rows]
        return Response(
            {"results": results, "page": page, "nextPage": page + 1 if page * page_size < total else None, "total": total},
            headers={"Cache-Control": "private, no-store"},
        )


class HRMSLegacyResumeView(APIView):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        if not hrms_integration_authorized(request):
            return Response({"detail": "Integration credentials are missing or invalid."}, status=status.HTTP_403_FORBIDDEN)
        document_id = request.query_params.get("documentId", "")[:20]
        document = Document.objects.filter(public_id=document_id, document_type=Document.Type.RESUME).first()
        if not document or document.upload_status not in (Document.UploadStatus.UPLOADED, Document.UploadStatus.REVIEWED):
            return Response({"detail": "Resume not found."}, status=status.HTTP_404_NOT_FOUND)
        try:
            url = storage_client().generate_presigned_url(
                "get_object",
                Params={
                    "Bucket": bucket_name(),
                    "Key": document.storage_key,
                    "ResponseContentDisposition": f'attachment; filename="{document.file_name}"',
                },
                ExpiresIn=300,
            )
        except Exception:
            return Response({"detail": "Resume storage is temporarily unavailable."}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        return Response({"url": url}, headers={"Cache-Control": "private, no-store"})

class CandidateMeView(generics.RetrieveUpdateAPIView):
    serializer_class = CandidateProfileSerializer
    permission_classes = [IsCandidate]

    def get_object(self):
        try:
            return self.request.user.candidate_profile
        except CandidateProfile.DoesNotExist as exc:
            raise NotFound("Candidate profile could not be found.") from exc

    def perform_update(self, serializer):
        profile = serializer.save()
        name_parts = profile.name.strip().split(None, 1)
        self.request.user.first_name = name_parts[0] if name_parts else ""
        self.request.user.last_name = name_parts[1] if len(name_parts) > 1 else ""
        self.request.user.save(update_fields=("first_name", "last_name"))


class CandidateDashboardView(APIView):
    permission_classes = [IsCandidate]

    def get(self, request):
        from applications.models import Application, BackgroundVerification, Document, Interview
        from notifications.models import Notification

        profile = request.user.candidate_profile
        applications = Application.objects.filter(candidate=profile)
        latest = applications.select_related("job", "candidate").prefetch_related("status_history").order_by("-updated_at").first()
        next_interview = Interview.objects.filter(application__candidate=profile, status__in=[Interview.Status.CREATED, Interview.Status.READY, Interview.Status.SCHEDULED], scheduled_at__gte=timezone.now()).select_related("application__job").order_by("scheduled_at").first()
        bgv = BackgroundVerification.objects.filter(candidate=profile).select_related("application__job").order_by("-updated_at").first()
        profile_values = [profile.name, profile.email, profile.phone, profile.location,
                          profile.address_line1, profile.city, profile.state, profile.postal_code, profile.country, profile.current_role,
                          profile.years_of_experience is not None, profile.skills, profile.professional_summary,
                          profile.education, profile.experience, profile.resume_metadata]
        completed = sum(bool(value) for value in profile_values)
        return Response({
            "profile_completion": round(completed / len(profile_values) * 100),
            "active_applications": applications.exclude(current_status__in=Application.TERMINAL).count(),
            "upcoming_interviews": Interview.objects.filter(application__candidate=profile, status=Interview.Status.SCHEDULED, scheduled_at__gte=timezone.now()).count(),
            "pending_documents": Document.objects.filter(candidate=profile, upload_status__in=[Document.UploadStatus.PENDING, Document.UploadStatus.REJECTED]).count(),
            "unread_notifications": Notification.objects.filter(candidate=profile, read_at__isnull=True).count(),
            "latest_application": ApplicationSerializer(latest).data if latest else None,
            "next_interview": ({"id": next_interview.public_id, "job_title": next_interview.application.job.title, "interview_type": next_interview.interview_type, "status": next_interview.status, "scheduled_at": next_interview.scheduled_at} if next_interview else None),
            "documents_enabled": bool(bgv and bgv.status != BackgroundVerification.Status.NOT_STARTED),
            "bgv_id": bgv.public_id if bgv and bgv.status != BackgroundVerification.Status.NOT_STARTED else None,
            "bgv_status": bgv.status if bgv else None,
            "recruitment_email": settings.RECRUITMENT_EMAIL,
            "recent_updates": list(applications.select_related("job").order_by("-updated_at").values("public_id", "job__title", "current_status", "updated_at")[:5]),
        })


class AdminJobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.annotate(applications_count=Count("applications")).all().order_by("-created_at")
    serializer_class = JobAdminSerializer
    permission_classes = [IsRecruitmentStaff]
    lookup_field = "public_id"
    filterset_fields = ("status", "department", "location", "employment_type", "work_mode", "experience_level")
    search_fields = ("public_id", "title", "department", "location")
    ordering_fields = ("created_at", "updated_at", "title", "status", "applications_count")

    def perform_create(self, serializer):
        job = serializer.save(created_by=self.request.user, updated_by=self.request.user)
        write_audit(actor=self.request.user, action="JOB_CREATED", entity="Job", entity_id=job.public_id)

    def perform_update(self, serializer):
        job = serializer.save(updated_by=self.request.user)
        write_audit(actor=self.request.user, action="JOB_UPDATED", entity="Job", entity_id=job.public_id)

    def perform_destroy(self, instance):
        instance.status = Job.Status.ARCHIVED
        instance.updated_by = self.request.user
        instance.save(update_fields=("status", "updated_by", "updated_at"))
        write_audit(actor=self.request.user, action="JOB_CLOSED", entity="Job", entity_id=instance.public_id, metadata={"status": "ARCHIVED"})

    @action(detail=True, methods=("post",))
    def publish(self, request, public_id=None):
        job = self.get_object()
        job.publish()
        job.updated_by = request.user
        job.save(update_fields=("status", "published_at", "updated_by", "updated_at"))
        write_audit(actor=request.user, action="JOB_PUBLISHED", entity="Job", entity_id=job.public_id)
        return Response(self.get_serializer(job).data)

    @action(detail=True, methods=("post",))
    def close(self, request, public_id=None):
        job = self.get_object()
        job.status, job.closed_at, job.updated_by = Job.Status.CLOSED, timezone.now(), request.user
        job.save(update_fields=("status", "closed_at", "updated_by", "updated_at"))
        write_audit(actor=request.user, action="JOB_CLOSED", entity="Job", entity_id=job.public_id)
        return Response(self.get_serializer(job).data)

    @action(detail=True, methods=("post",))
    def pause(self, request, public_id=None):
        job = self.get_object()
        if job.status != Job.Status.PUBLISHED:
            from rest_framework.exceptions import ValidationError
            raise ValidationError({"status": "Only a published job can be paused."})
        job.status, job.updated_by = Job.Status.PAUSED, request.user
        job.save(update_fields=("status", "updated_by", "updated_at"))
        write_audit(actor=request.user, action="JOB_UPDATED", entity="Job", entity_id=job.public_id, metadata={"status": "PAUSED"})
        return Response(self.get_serializer(job).data)

    @action(detail=True, methods=("post",))
    def archive(self, request, public_id=None):
        job = self.get_object()
        job.status, job.updated_by = Job.Status.ARCHIVED, request.user
        job.save(update_fields=("status", "updated_by", "updated_at"))
        write_audit(actor=request.user, action="JOB_UPDATED", entity="Job", entity_id=job.public_id, metadata={"status": "ARCHIVED"})
        return Response(self.get_serializer(job).data)
