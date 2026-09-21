from django.db import IntegrityError
from django.utils import timezone
from rest_framework import generics, serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from core.permissions import IsCandidate
from .models import Application, BackgroundVerification, Document, Interview, Joining, Offer
from .serializers import ApplicationSerializer, BackgroundVerificationSerializer, DocumentSerializer, InterviewSerializer, JoiningSerializer, OfferSerializer
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
        return Application.objects.filter(candidate__user=self.request.user).select_related("job", "candidate").order_by("-applied_at")


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
