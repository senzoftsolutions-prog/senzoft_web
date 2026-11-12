from django.urls import path
from .views import CandidateDashboardView, CandidateMeView, PublicHRMSApplicationView, PublicJobDetailView, PublicJobListView

urlpatterns = [
    path("jobs/", PublicJobListView.as_view(), name="job-list"),
    path("jobs/<str:job_id>/", PublicJobDetailView.as_view(), name="job-detail"),
    path("careers/applications/", PublicHRMSApplicationView.as_view(), name="public-hrms-application"),
    path("candidates/me/", CandidateMeView.as_view(), name="candidate-me"),
    path("candidates/me/dashboard/", CandidateDashboardView.as_view(), name="candidate-dashboard"),
]
