import json

from django.db import models
from django.db.models import Count
from django.utils import timezone
from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from audit.services import write_audit
from core.permissions import IsSuperAdminRole
from .models import ConsentPolicy, ConsentRecord, CookieCategory, CookieDefinition
from .serializers import ConsentPolicySerializer, ConsentRecordSerializer, CookieCategorySerializer, CookieDefinitionSerializer


class ConsentConfigView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        policy = ConsentPolicy.objects.filter(is_published=True).order_by("-effective_at", "-created_at").first()
        if not policy:
            return Response({"detail": "No consent policy is currently published."}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        categories = CookieCategory.objects.prefetch_related("definitions").all()
        return Response({"version": policy.version, "title": policy.title, "effective_at": policy.effective_at, "categories": CookieCategorySerializer(categories, many=True).data})


class ConsentCreateView(generics.CreateAPIView):
    serializer_class = ConsentRecordSerializer
    permission_classes = (permissions.AllowAny,)
    throttle_scope = "consent"


class ConsentHistoryView(generics.ListAPIView):
    serializer_class = ConsentRecordSerializer
    permission_classes = (permissions.AllowAny,)
    pagination_class = None

    def get_queryset(self):
        identifier = self.request.headers.get("X-Consent-Identifier", "")
        if not identifier:
            return ConsentRecord.objects.none()
        return ConsentRecord.objects.filter(consent_identifier=identifier)[:20]


class AdminCookieCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CookieCategory.objects.prefetch_related("definitions").all()
    serializer_class = CookieCategorySerializer
    permission_classes = (IsSuperAdminRole,)


class AdminCookieDefinitionViewSet(viewsets.ModelViewSet):
    queryset = CookieDefinition.objects.select_related("category").all()
    serializer_class = CookieDefinitionSerializer
    permission_classes = (IsSuperAdminRole,)
    filterset_fields = ("category", "status", "storage_type")
    search_fields = ("name", "provider", "purpose")

    @staticmethod
    def snapshot(item):
        return json.loads(json.dumps(CookieDefinitionSerializer(item).data, default=str))

    def perform_create(self, serializer):
        item = serializer.save()
        write_audit(actor=self.request.user, action="COOKIE_DEFINITION_CREATED", entity="CookieDefinition", entity_id=item.id, metadata={"new": self.snapshot(item)})

    def perform_update(self, serializer):
        previous = self.snapshot(self.get_object())
        item = serializer.save()
        write_audit(actor=self.request.user, action="COOKIE_DEFINITION_UPDATED", entity="CookieDefinition", entity_id=item.id, metadata={"previous": previous, "new": self.snapshot(item)})


class AdminConsentPolicyViewSet(viewsets.ModelViewSet):
    queryset = ConsentPolicy.objects.all()
    serializer_class = ConsentPolicySerializer
    permission_classes = (IsSuperAdminRole,)

    @action(detail=True, methods=("post",))
    def publish(self, request, pk=None):
        policy = self.get_object()
        ConsentPolicy.objects.exclude(pk=policy.pk).update(is_published=False)
        policy.is_published = True
        policy.effective_at = timezone.now()
        policy.published_by = request.user
        policy.save(update_fields=("is_published", "effective_at", "published_by", "updated_at"))
        write_audit(actor=request.user, action="CONSENT_POLICY_PUBLISHED", entity="ConsentPolicy", entity_id=policy.id, metadata={"version": policy.version})
        return Response(self.get_serializer(policy).data)


class AdminConsentOverviewView(APIView):
    permission_classes = (IsSuperAdminRole,)

    def get(self, request):
        current = ConsentPolicy.objects.filter(is_published=True).order_by("-effective_at").first()
        counts = ConsentRecord.objects.aggregate(
            functional=Count("id", filter=models.Q(functional=True)),
            analytics=Count("id", filter=models.Q(analytics=True)),
            marketing=Count("id", filter=models.Q(marketing=True)),
        )
        return Response({"total_records": ConsentRecord.objects.count(), "current_policy_version": current.version if current else None, "accepted": counts, "recent": ConsentRecordSerializer(ConsentRecord.objects.all()[:10], many=True).data})
