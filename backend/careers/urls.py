from django.urls import path
from .views import CandidateDashboardView, CandidateMeView, HRMSLegacyResumeView, HRMSLegacySnapshotView, PublicHRMSApplicationView, PublicJobDetailView, PublicJobListView

urlpatterns = [
    path("jobs/", PublicJobListView.as_view(), name="job-list"),
    path("jobs/<str:job_id>/", PublicJobDetailView.as_view(), name="job-detail"),
    path("careers/applications/", PublicHRMSApplicationView.as_view(), name="public-hrms-application"),
    path("integrations/hrms/snapshot/", HRMSLegacySnapshotView.as_view(), name="hrms-legacy-snapshot"),
    path("integrations/hrms/resume/", HRMSLegacyResumeView.as_view(), name="hrms-legacy-resume"),
    path("candidates/me/", CandidateMeView.as_view(), name="candidate-me"),
    path("candidates/me/dashboard/", CandidateDashboardView.as_view(), name="candidate-dashboard"),
]
