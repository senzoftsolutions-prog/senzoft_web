from django.urls import path
from .views import CandidateNotificationListView, CandidateNotificationReadView

urlpatterns = [
    path("candidates/me/notifications/", CandidateNotificationListView.as_view(), name="candidate-notifications"),
    path("candidates/me/notifications/<str:notification_id>/read/", CandidateNotificationReadView.as_view(), name="candidate-notification-read"),
]
