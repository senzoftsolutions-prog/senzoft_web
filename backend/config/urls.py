from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from blog.views import AdminBlogViewSet
from careers.views import AdminJobViewSet
from .admin_api import ApplicationAdminViewSet, AuditAdminViewSet, BGVAdminViewSet, CandidateAdminViewSet, DashboardView, DocumentAdminViewSet, InterviewAdminViewSet, JoiningAdminViewSet, NotificationAdminViewSet, OfferAdminViewSet, UserAdminViewSet


router = DefaultRouter()
router.register("jobs", AdminJobViewSet, basename="admin-jobs")
router.register("candidates", CandidateAdminViewSet, basename="admin-candidates")
router.register("applications", ApplicationAdminViewSet, basename="admin-applications")
router.register("interviews", InterviewAdminViewSet, basename="admin-interviews")
router.register("documents", DocumentAdminViewSet, basename="admin-documents")
router.register("bgv", BGVAdminViewSet, basename="admin-bgv")
router.register("offers", OfferAdminViewSet, basename="admin-offers")
router.register("joining", JoiningAdminViewSet, basename="admin-joining")
router.register("blogs", AdminBlogViewSet, basename="admin-blogs")
router.register("users", UserAdminViewSet, basename="admin-users")
router.register("notifications", NotificationAdminViewSet, basename="admin-notifications")
router.register("audit", AuditAdminViewSet, basename="admin-audit")


def health(request):
    return JsonResponse({"success": True, "data": {"status": "ok"}})


urlpatterns = [
    path("health/", health),
    path("django-admin/", admin.site.urls),
    path("api/v1/auth/", include("accounts.urls")),
    path("api/v1/", include("careers.urls")),
    path("api/v1/", include("applications.urls")),
    path("api/v1/", include("blog.urls")),
    path("api/v1/", include("notifications.urls")),
    path("api/v1/admin/dashboard/", DashboardView.as_view(), name="admin-dashboard"),
    path("api/v1/admin/", include(router.urls)),
]
