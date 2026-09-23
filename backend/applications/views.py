from django.db import IntegrityError, transaction
from django.utils import timezone
from uuid import uuid4
from rest_framework import generics, serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from core.permissions import IsCandidate
from .models import Application, BackgroundVerification, Document, Interview, Joining, Offer
from .serializers import ApplicationSerializer, BackgroundVerificationSerializer, DocumentSerializer, InterviewSerializer, JoiningSerializer, OfferSerializer
from .storage import bucket_name, storage_client
from audit.services import write_audit


class ApplicationCreateView(generics.CreateAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsCandidate]

    def perform_create(self, serializer):
        try:
            application = serializer.save()
            write_audit(actor=self.request.user, action="APPLICATION_CREATED", entity="Application", entity_id=application.public_id)
        except IntegrityError as exc:
            raise serializers.ValidationError({"job_id": "You have already applied for this job."}) from exc


class ApplicationDetailView(generics.RetrieveAPIView):
    serializer_class = ApplicationSerializer
    lookup_field = "public_id"
    lookup_url_kwarg = "application_id"
    permission_classes = [IsCandidate]

    def get_queryset(self):
        queryset = Application.objects.select_related("candidate", "job").prefetch_related("status_history")
        return queryset.filter(candidate__user=self.request.user)


class CandidateApplicationListView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsCandidate]
    def get_queryset(self):
        return Application.objects.filter(candidate__user=self.request.user).select_related("job", "candidate").prefetch_related("interviews").order_by("-applied_at")


class CandidateResumeUploadRequestView(APIView):
    permission_classes = [IsCandidate]
    allowed_types = {
        "application/pdf": ".pdf",
        "application/msword": ".doc",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
    }

    def post(self, request):
        file_name = str(request.data.get("file_name", "")).strip()
        mime_type = str(request.data.get("mime_type", "")).strip().lower()
        try:
            file_size = int(request.data.get("file_size", 0))
        except (TypeError, ValueError):
            file_size = 0
        suffix = self.allowed_types.get(mime_type)
        if not suffix or not file_name.lower().endswith(suffix):
            raise serializers.ValidationError({"file": "Upload a PDF, DOC, or DOCX résumé."})
        if file_size < 1 or file_size > 10 * 1024 * 1024:
            raise serializers.ValidationError({"file": "Résumés must be 10 MB or smaller."})
        profile = request.user.candidate_profile
        key = f"candidates/{profile.public_id}/resumes/{uuid4().hex}{suffix}"
        document = Document.objects.create(candidate=profile, document_type=Document.Type.RESUME, file_name=file_name[:255], file_size=file_size, mime_type=mime_type, storage_key=key)
        try:
            upload = storage_client().generate_presigned_post(
                Bucket=bucket_name(), Key=key,
                Fields={"Content-Type": mime_type},
                Conditions=[{"Content-Type": mime_type}, ["content-length-range", 1, 10 * 1024 * 1024]],
                ExpiresIn=600,
            )
        except Exception as exc:
            document.delete()
            raise serializers.ValidationError({"file": "Résumé storage is temporarily unavailable."}) from exc
        return Response({"document_id": document.public_id, "upload_url": upload["url"], "upload_fields": upload["fields"], "expires_in": 600})


class CandidateResumeView(APIView):
    permission_classes = [IsCandidate]

    def _document(self, request, document_id=None):
        profile = request.user.candidate_profile
        target = document_id or profile.resume_metadata.get("document_id")
        if not target:
            raise serializers.ValidationError({"resume": "No résumé is stored."})
        return generics.get_object_or_404(Document, candidate=profile, public_id=target, document_type=Document.Type.RESUME)

    def post(self, request):
        profile = request.user.candidate_profile
        document = self._document(request, request.data.get("document_id"))
        try:
            stored = storage_client().head_object(Bucket=bucket_name(), Key=document.storage_key)
        except Exception as exc:
            raise serializers.ValidationError({"resume": "The uploaded résumé could not be verified."}) from exc
        actual_size = int(stored.get("ContentLength", 0))
        if actual_size < 1 or actual_size > 10 * 1024 * 1024:
            raise serializers.ValidationError({"resume": "The uploaded résumé has an invalid size."})
        old_id = profile.resume_metadata.get("document_id")
        with transaction.atomic():
            document.file_size = actual_size
            document.upload_status = Document.UploadStatus.UPLOADED
            document.uploaded_at = timezone.now()
            document.save(update_fields=("file_size", "upload_status", "uploaded_at", "updated_at"))
            profile.resume_metadata = {"document_id": document.public_id, "file_name": document.file_name, "file_size": actual_size, "mime_type": document.mime_type, "uploaded_at": document.uploaded_at.isoformat()}
            profile.save(update_fields=("resume_metadata", "updated_at"))
        if old_id and old_id != document.public_id:
            old = Document.objects.filter(candidate=profile, public_id=old_id).first()
            if old:
                try: storage_client().delete_object(Bucket=bucket_name(), Key=old.storage_key)
                except Exception: pass
                old.delete()
        return Response(profile.resume_metadata)

    def get(self, request):
        document = self._document(request)
        url = storage_client().generate_presigned_url("get_object", Params={"Bucket": bucket_name(), "Key": document.storage_key, "ResponseContentDisposition": f'attachment; filename="{document.file_name}"'}, ExpiresIn=300)
        return Response({"download_url": url, "expires_in": 300})

    def delete(self, request):
        profile = request.user.candidate_profile
        document = self._document(request)
        try: storage_client().delete_object(Bucket=bucket_name(), Key=document.storage_key)
        except Exception: pass
        document.delete()
        profile.resume_metadata = {}
        profile.save(update_fields=("resume_metadata", "updated_at"))
        return Response(status=status.HTTP_204_NO_CONTENT)


class CandidateInterviewListView(generics.ListAPIView):
    serializer_class = InterviewSerializer
    permission_classes = [IsCandidate]
    def get_queryset(self):
        return Interview.objects.filter(application__candidate__user=self.request.user).select_related("application__job").order_by("-scheduled_at")


class CandidateInterviewDetailView(generics.RetrieveAPIView):
    serializer_class = InterviewSerializer
    permission_classes = [IsCandidate]
    lookup_field = "public_id"
    lookup_url_kwarg = "interview_id"

    def get_queryset(self):
        return Interview.objects.filter(application__candidate__user=self.request.user).select_related("application__job")


class CandidateDocumentListView(generics.ListAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [IsCandidate]
    def get_queryset(self):
        return Document.objects.filter(candidate__user=self.request.user).order_by("-created_at")


class CandidateBackgroundVerificationListView(generics.ListAPIView):
    serializer_class = BackgroundVerificationSerializer
    permission_classes = [IsCandidate]

    def get_queryset(self):
        return BackgroundVerification.objects.filter(candidate__user=self.request.user).select_related("application__job").order_by("-created_at")


class CandidateOfferListView(generics.ListAPIView):
    serializer_class = OfferSerializer
    permission_classes = [IsCandidate]

    def get_queryset(self):
        return Offer.objects.filter(candidate__user=self.request.user).select_related("application__job").order_by("-created_at")


class CandidateOfferDetailView(generics.RetrieveAPIView):
    serializer_class = OfferSerializer
    permission_classes = [IsCandidate]
    lookup_field = "public_id"
    lookup_url_kwarg = "offer_id"

    def get_queryset(self):
        return Offer.objects.filter(candidate__user=self.request.user).select_related("application__job")


class CandidateOfferDecisionView(APIView):
    permission_classes = [IsCandidate]
    decision = None

    def post(self, request, offer_id):
        offer = generics.get_object_or_404(
            Offer.objects.select_related("application").filter(candidate__user=request.user),
            public_id=offer_id,
        )
        if offer.status not in {Offer.Status.ISSUED, Offer.Status.VIEWED}:
            return Response({"detail": "This offer can no longer be changed."}, status=status.HTTP_409_CONFLICT)
        now = timezone.now()
        if self.decision == "accept":
            offer.status, offer.accepted_at = Offer.Status.ACCEPTED, now
            application_status = Application.Status.OFFER_ACCEPTED
            action = "OFFER_ACCEPTED"
        else:
            offer.status, offer.declined_at = Offer.Status.DECLINED, now
            application_status = Application.Status.OFFER_DECLINED
            action = "OFFER_DECLINED"
        offer.updated_by = request.user
        offer.save()
        if application_status in Application.TRANSITIONS.get(offer.application.current_status, set()):
            offer.application.transition_to(application_status, request.user, f"Candidate chose to {self.decision} the offer")
        write_audit(actor=request.user, action=action, entity="Offer", entity_id=offer.public_id)
        return Response(OfferSerializer(offer).data)


class CandidateOfferAcceptView(CandidateOfferDecisionView):
    decision = "accept"


class CandidateOfferDeclineView(CandidateOfferDecisionView):
    decision = "decline"


class CandidateJoiningListView(generics.ListAPIView):
    serializer_class = JoiningSerializer
    permission_classes = [IsCandidate]

    def get_queryset(self):
        return Joining.objects.filter(candidate__user=self.request.user).select_related("application__job").order_by("-joining_date")
