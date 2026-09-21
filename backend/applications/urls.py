from django.urls import path
from .views import (
    ApplicationCreateView, ApplicationDetailView, CandidateApplicationListView,
    CandidateBackgroundVerificationListView, CandidateDocumentListView,
    CandidateInterviewDetailView, CandidateInterviewListView,
    CandidateJoiningListView, CandidateOfferAcceptView, CandidateOfferDeclineView,
    CandidateOfferDetailView, CandidateOfferListView,
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
    path("candidates/me/background-verifications/", CandidateBackgroundVerificationListView.as_view(), name="candidate-background-verifications"),
    path("candidates/me/offers/", CandidateOfferListView.as_view(), name="candidate-offers"),
    path("candidates/me/offers/<str:offer_id>/", CandidateOfferDetailView.as_view(), name="candidate-offer-detail"),
    path("candidates/me/offers/<str:offer_id>/accept/", CandidateOfferAcceptView.as_view(), name="candidate-offer-accept"),
    path("candidates/me/offers/<str:offer_id>/decline/", CandidateOfferDeclineView.as_view(), name="candidate-offer-decline"),
    path("candidates/me/joining/", CandidateJoiningListView.as_view(), name="candidate-joining"),
]
