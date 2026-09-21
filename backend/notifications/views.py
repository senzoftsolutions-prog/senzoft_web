from django.utils import timezone
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from core.permissions import IsCandidate
from .models import Notification
from .serializers import NotificationSerializer


class CandidateNotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsCandidate]
    def get_queryset(self):
        return Notification.objects.filter(candidate__user=self.request.user).order_by("-created_at")


class CandidateNotificationReadView(APIView):
    permission_classes = [IsCandidate]

    def post(self, request, notification_id):
        notification = generics.get_object_or_404(
            Notification.objects.filter(candidate__user=request.user), public_id=notification_id
        )
        notification.read_at = notification.read_at or timezone.now()
        notification.save(update_fields=("read_at",))
        return Response(NotificationSerializer(notification).data)
