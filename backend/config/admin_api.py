from django.core.exceptions import ValidationError as DjangoValidationError
from django.db.models import Count, Max, OuterRef, Subquery
from django.utils import timezone
from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import User
from accounts.serializers import AdminUserSerializer, UserRoleSerializer, UserStatusSerializer
from applications.models import Application, BackgroundVerification, Document, Interview, Joining, Offer
from applications.serializers import ApplicationAdminSerializer, BackgroundVerificationAdminSerializer, DocumentAdminSerializer, InterviewAdminSerializer, JoiningAdminSerializer, OfferAdminSerializer, TransitionSerializer
from audit.services import write_audit
from audit.models import AuditLog
from audit.serializers import AuditLogSerializer
from careers.models import CandidateProfile, Job
from careers.serializers import CandidateAdminSerializer, JobAdminSerializer
from core.permissions import HasModuleRole, IsAdminPanelUser, IsAdminRole
from notifications.models import Notification
from notifications.serializers import NotificationSerializer


def model_serializer(model, excluded=()):
    meta = type("Meta", (), {"model": model, "exclude": excluded})
    return type(f"{model.__name__}AdminSerializer", (serializers.ModelSerializer,), {"Meta": meta})


RECRUITMENT_ROLES = ("RECRUITER", "HIRING_MANAGER", "HR", "ADMIN", "SUPER_ADMIN")
INTERVIEW_ROLES = ("RECRUITER", "HIRING_MANAGER", "INTERVIEWER", "HR", "ADMIN", "SUPER_ADMIN")
HR_ROLES = ("HR", "ADMIN", "SUPER_ADMIN")


class ProtectedModelViewSet(viewsets.ModelViewSet):
    permission_classes = [HasModuleRole]
    allowed_roles = RECRUITMENT_ROLES
    lookup_field = "public_id"


class CandidateAdminViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CandidateAdminSerializer
    permission_classes = [HasModuleRole]
    allowed_roles = INTERVIEW_ROLES
    lookup_field = "public_id"
    search_fields = ("public_id", "name", "email", "skills")
    ordering_fields = ("name", "created_at", "applications_count", "latest_application_at")

    def get_queryset(self):
        latest = Application.objects.filter(candidate=OuterRef("pk")).order_by("-applied_at")
        return CandidateProfile.objects.select_related("user").annotate(
            applications_count=Count("applications", distinct=True),
            latest_application_at=Max("applications__applied_at"),
            latest_status=Subquery(latest.values("current_status")[:1]),
        ).order_by("-created_at")


class ApplicationAdminViewSet(ProtectedModelViewSet):
    queryset = Application.objects.select_related("candidate", "job").prefetch_related("status_history").all().order_by("-applied_at")
    serializer_class = ApplicationAdminSerializer
    filterset_fields = ("current_status", "job__public_id", "candidate__public_id", "recruiter", "hiring_manager")
    search_fields = ("public_id", "candidate__name", "candidate__email", "job__title")
    ordering_fields = ("applied_at", "updated_at", "current_status")

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.request.user.role == User.Role.HIRING_MANAGER:
            queryset = queryset.filter(hiring_manager=self.request.user)
        return queryset

    @action(detail=True, methods=("post",))
    def transition(self, request, public_id=None):
        application = self.get_object()
        serializer = TransitionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            application.transition_to(serializer.validated_data["status"], request.user, serializer.validated_data.get("reason", ""))
        except DjangoValidationError as exc:
            raise serializers.ValidationError({"status": exc.messages}) from exc
        write_audit(actor=request.user, action="APPLICATION_STATUS_CHANGED", entity="Application", entity_id=application.public_id, metadata={"status": application.current_status})
        return Response(self.get_serializer(application).data)


class InterviewAdminViewSet(ProtectedModelViewSet):
    queryset = Interview.objects.select_related("application__candidate", "application__job", "interviewer").prefetch_related("questions", "responses", "integrity_events").all().order_by("-created_at")
    serializer_class = InterviewAdminSerializer
    allowed_roles = INTERVIEW_ROLES
    filterset_fields = ("interview_type", "status", "interviewer", "application__public_id", "application__job__public_id")
    search_fields = ("public_id", "application__candidate__name", "application__job__title")
    ordering_fields = ("scheduled_at", "created_at", "status")

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.request.user.role == User.Role.INTERVIEWER:
            queryset = queryset.filter(interviewer=self.request.user)
        elif self.request.user.role == User.Role.HIRING_MANAGER:
            queryset = queryset.filter(application__hiring_manager=self.request.user)
        return queryset

    def perform_create(self, serializer):
        interview = serializer.save(status=Interview.Status.CREATED)
        write_audit(actor=self.request.user, action="INTERVIEW_CREATED", entity="Interview", entity_id=interview.public_id)

    def perform_update(self, serializer):
        interview = serializer.save()
        write_audit(actor=self.request.user, action="INTERVIEW_CONFIGURED", entity="Interview", entity_id=interview.public_id)


class DocumentAdminViewSet(ProtectedModelViewSet):
    queryset = Document.objects.select_related("candidate", "application", "reviewed_by").all().order_by("-created_at")
    serializer_class = DocumentAdminSerializer
    allowed_roles = HR_ROLES
    filterset_fields = ("document_type", "upload_status", "candidate__public_id", "application__public_id")
    search_fields = ("public_id", "candidate__name", "file_name")
    ordering_fields = ("created_at", "uploaded_at", "reviewed_at")


class BGVAdminViewSet(ProtectedModelViewSet):
    queryset = BackgroundVerification.objects.select_related("candidate", "application", "reviewer").all().order_by("-created_at")
    serializer_class = BackgroundVerificationAdminSerializer
    allowed_roles = HR_ROLES
    filterset_fields = ("status", "candidate__public_id", "application__public_id")
    search_fields = ("public_id", "candidate__name")
    ordering_fields = ("created_at", "requested_at", "completed_at")


class OfferAdminViewSet(ProtectedModelViewSet):
    queryset = Offer.objects.select_related("candidate", "application__job").all().order_by("-created_at")
    serializer_class = OfferAdminSerializer
    allowed_roles = HR_ROLES
    filterset_fields = ("status", "candidate__public_id", "application__public_id")
    search_fields = ("public_id", "candidate__name", "application__job__title")
    ordering_fields = ("created_at", "issued_at", "expires_at", "joining_date")


class JoiningAdminViewSet(ProtectedModelViewSet):
    queryset = Joining.objects.select_related("candidate", "application__job", "offer").all().order_by("-created_at")
    serializer_class = JoiningAdminSerializer
    allowed_roles = HR_ROLES
    filterset_fields = ("status", "candidate__public_id", "application__public_id", "department", "location")
    search_fields = ("public_id", "candidate__name", "application__job__title")
    ordering_fields = ("created_at", "joining_date", "status")


class NotificationAdminViewSet(ProtectedModelViewSet):
    queryset = Notification.objects.all().order_by("-created_at")
    serializer_class = NotificationSerializer
    allowed_roles = HR_ROLES


class UserAdminViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all().order_by("username")
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdminRole]
    lookup_field = "id"
    filterset_fields = ("role", "is_active", "is_email_verified")
    search_fields = ("username", "email", "first_name", "last_name")
    ordering_fields = ("date_joined", "last_login", "username", "role")

    @action(detail=True, methods=("post",), url_path="role")
    def change_role(self, request, id=None):
        user = self.get_object()
        serializer = UserRoleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        previous = user.role
        user.role = serializer.validated_data["role"]
        user.save(update_fields=("role",))
        write_audit(actor=request.user, action="USER_ROLE_CHANGED", entity="User", entity_id=user.id, metadata={"previous_role": previous, "new_role": user.role})
        return Response(self.get_serializer(user).data)

    @action(detail=True, methods=("post",), url_path="status")
    def change_status(self, request, id=None):
        user = self.get_object()
        serializer = UserStatusSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user.is_active = serializer.validated_data["is_active"]
        user.save(update_fields=("is_active",))
        write_audit(actor=request.user, action="ADMIN_ACTION", entity="User", entity_id=user.id, metadata={"is_active": user.is_active})
        return Response(self.get_serializer(user).data)


class AuditAdminViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditLog.objects.select_related("actor").all()
    serializer_class = AuditLogSerializer
    permission_classes = [IsAdminRole]
    lookup_field = "id"
    filterset_fields = ("actor", "action", "entity")
    search_fields = ("action", "entity", "entity_id", "actor__username", "actor__email")
    ordering_fields = ("timestamp", "action", "entity")


class DashboardView(APIView):
    permission_classes = [IsAdminPanelUser]

    def get(self, request):
        applications = Application.objects.all()
        interviews = Interview.objects.all()
        if request.user.role == User.Role.HIRING_MANAGER:
            applications = applications.filter(hiring_manager=request.user)
            interviews = interviews.filter(application__hiring_manager=request.user)
        elif request.user.role == User.Role.INTERVIEWER:
            applications = applications.none()
            interviews = interviews.filter(interviewer=request.user)

        status_distribution = list(applications.values("current_status").annotate(count=Count("id")).order_by("current_status"))
        data = {
            "counts": {
                "jobs": Job.objects.count() if request.user.role != User.Role.INTERVIEWER else 0,
                "applications": applications.count(),
                "candidates": CandidateProfile.objects.count(),
                "interviews": interviews.count(),
                "pending_bgv": BackgroundVerification.objects.exclude(status__in=("COMPLETED", "FAILED")).count() if request.user.role in HR_ROLES else 0,
                "offers": Offer.objects.count() if request.user.role in HR_ROLES else 0,
            },
            "recent_applications": ApplicationAdminSerializer(applications.select_related("candidate", "job").order_by("-applied_at")[:5], many=True).data,
            "recent_jobs": JobAdminSerializer(Job.objects.annotate(applications_count=Count("applications")).order_by("-created_at")[:5], many=True).data if request.user.role != User.Role.INTERVIEWER else [],
            "upcoming_interviews": InterviewAdminSerializer(interviews.filter(scheduled_at__gte=timezone.now()).select_related("application__candidate", "application__job", "interviewer").order_by("scheduled_at")[:5], many=True).data,
            "status_distribution": status_distribution,
        }
        return Response(data)
