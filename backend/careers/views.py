from django.conf import settings
from django.db.models import Count
from django.utils import timezone
from rest_framework import generics, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.views import APIView

from core.permissions import IsCandidate, IsRecruitmentStaff
from audit.services import write_audit
from applications.serializers import ApplicationSerializer
from .models import CandidateProfile, Job
from .serializers import CandidateProfileSerializer, JobAdminSerializer, PublicJobSerializer


class PublicJobListView(generics.ListAPIView):
    serializer_class = PublicJobSerializer
    permission_classes = [permissions.AllowAny]
    filterset_fields = ("location", "department", "employment_type", "work_mode", "experience_level")
    search_fields = ("title", "description", "required_skills")
    ordering_fields = ("published_at", "title", "application_deadline")

    def get_queryset(self):
        return Job.objects.filter(status=Job.Status.PUBLISHED).order_by("-published_at")


class PublicJobDetailView(generics.RetrieveAPIView):
    serializer_class = PublicJobSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "public_id"
    lookup_url_kwarg = "job_id"

    def get_queryset(self):
        return Job.objects.filter(status=Job.Status.PUBLISHED)


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
