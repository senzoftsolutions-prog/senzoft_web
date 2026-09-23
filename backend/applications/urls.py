from django.urls import path
from .views import (
    ApplicationCreateView, ApplicationDetailView, CandidateApplicationListView,
    CandidateBackgroundVerificationListView, CandidateDocumentListView,
    CandidateInterviewDetailView, CandidateInterviewListView,
    CandidateJoiningListView, CandidateOfferAcceptView, CandidateOfferDeclineView,
    CandidateOfferDetailView, CandidateOfferListView, CandidateResumeUploadRequestView, CandidateResumeView,
    CandidateBgvDocumentUploadRequestView, CandidateBgvDocumentCompleteView, CandidateBgvDocumentView,
)
from .interview_views import CandidateInterviewCompleteView, CandidateInterviewIntegrityView, CandidateInterviewResponseView, CandidateInterviewSessionView, CandidateInterviewStartView

urlpatterns = [
    path("applications/", ApplicationCreateView.as_view(), name="application-create"),
    path("applications/<str:application_id>/", ApplicationDetailView.as_view(), name="application-detail"),
    path("candidates/me/applications/", CandidateApplicationListView.as_view(), name="candidate-applications"),
    path("candidates/me/interviews/", CandidateInterviewListView.as_view(), name="candidate-interviews"),
    path("candidates/me/interviews/<str:interview_id>/", CandidateInterviewDetailView.as_view(), name="candidate-interview-detail"),
    path("candidates/me/interviews/<str:interview_id>/session/", CandidateInterviewSessionView.as_view(), name="candidate-interview-session"),
    path("candidates/me/interviews/<str:interview_id>/start/", CandidateInterviewStartView.as_view(), name="candidate-interview-start"),
    path("candidates/me/interviews/<str:interview_id>/responses/", CandidateInterviewResponseView.as_view(), name="candidate-interview-response"),
    path("candidates/me/interviews/<str:interview_id>/integrity-events/", CandidateInterviewIntegrityView.as_view(), name="candidate-interview-integrity"),
    path("candidates/me/interviews/<str:interview_id>/complete/", CandidateInterviewCompleteView.as_view(), name="candidate-interview-complete"),
    path("candidates/me/documents/", CandidateDocumentListView.as_view(), name="candidate-documents"),
    path("candidates/me/bgv-documents/upload-request/", CandidateBgvDocumentUploadRequestView.as_view(), name="candidate-bgv-document-upload-request"),
    path("candidates/me/bgv-documents/complete/", CandidateBgvDocumentCompleteView.as_view(), name="candidate-bgv-document-complete"),
    path("candidates/me/bgv-documents/<str:document_id>/download/", CandidateBgvDocumentView.as_view(), name="candidate-bgv-document-download"),
    path("candidates/me/bgv-documents/<str:document_id>/", CandidateBgvDocumentView.as_view(), name="candidate-bgv-document"),
    path("candidates/me/resume/upload-request/", CandidateResumeUploadRequestView.as_view(), name="candidate-resume-upload-request"),
    path("candidates/me/resume/complete/", CandidateResumeView.as_view(), name="candidate-resume-complete"),
    path("candidates/me/resume/download/", CandidateResumeView.as_view(), name="candidate-resume-download"),
    path("candidates/me/resume/", CandidateResumeView.as_view(), name="candidate-resume"),
    path("candidates/me/background-verifications/", CandidateBackgroundVerificationListView.as_view(), name="candidate-background-verifications"),
    path("candidates/me/offers/", CandidateOfferListView.as_view(), name="candidate-offers"),
    path("candidates/me/offers/<str:offer_id>/", CandidateOfferDetailView.as_view(), name="candidate-offer-detail"),
    path("candidates/me/offers/<str:offer_id>/accept/", CandidateOfferAcceptView.as_view(), name="candidate-offer-accept"),
    path("candidates/me/offers/<str:offer_id>/decline/", CandidateOfferDeclineView.as_view(), name="candidate-offer-decline"),
    path("candidates/me/joining/", CandidateJoiningListView.as_view(), name="candidate-joining"),
]
