from django.utils import timezone
from rest_framework import generics, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from core.permissions import IsAdminRole
from audit.services import write_audit
from .models import BlogPost
from .serializers import BlogAdminSerializer, BlogPostSerializer, BlogScheduleSerializer


class PublicBlogListView(generics.ListAPIView):
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.AllowAny]
    search_fields = ("title", "excerpt", "content")
    ordering_fields = ("published_at", "title")
    def get_queryset(self):
        return BlogPost.objects.filter(status=BlogPost.Status.PUBLISHED, published_at__lte=timezone.now()).select_related("author", "category").prefetch_related("tags").order_by("-published_at")


class PublicBlogDetailView(generics.RetrieveAPIView):
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "slug"
    def get_queryset(self):
        return BlogPost.objects.filter(status=BlogPost.Status.PUBLISHED, published_at__lte=timezone.now()).select_related("author", "category").prefetch_related("tags")


class AdminBlogViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.all().order_by("-created_at")
    serializer_class = BlogAdminSerializer
    permission_classes = [IsAdminRole]
    lookup_field = "public_id"
    filterset_fields = ("status", "category", "author")
    search_fields = ("public_id", "title", "slug", "excerpt")
    ordering_fields = ("created_at", "updated_at", "published_at", "title", "status")

    def perform_create(self, serializer):
        post = serializer.save(author=self.request.user, created_by=self.request.user, updated_by=self.request.user)
        write_audit(actor=self.request.user, action="BLOG_CREATED", entity="BlogPost", entity_id=post.public_id)
    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)
    def perform_destroy(self, instance):
        instance.status = BlogPost.Status.ARCHIVED
        instance.updated_by = self.request.user
        instance.save(update_fields=("status", "updated_by", "updated_at"))

    @action(detail=True, methods=("post",))
    def publish(self, request, public_id=None):
        post = self.get_object()
        post.status, post.published_at, post.updated_by = BlogPost.Status.PUBLISHED, timezone.now(), request.user
        post.save(update_fields=("status", "published_at", "updated_by", "updated_at"))
        write_audit(actor=request.user, action="BLOG_PUBLISHED", entity="BlogPost", entity_id=post.public_id)
        return Response(self.get_serializer(post).data)

    @action(detail=True, methods=("post",))
    def archive(self, request, public_id=None):
        post = self.get_object()
        post.status, post.updated_by = BlogPost.Status.ARCHIVED, request.user
        post.save(update_fields=("status", "updated_by", "updated_at"))
        write_audit(actor=request.user, action="BLOG_ARCHIVED", entity="BlogPost", entity_id=post.public_id)
        return Response(self.get_serializer(post).data)

    @action(detail=True, methods=("post",))
    def schedule(self, request, public_id=None):
        post = self.get_object()
        serializer = BlogScheduleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        post.status, post.published_at, post.updated_by = BlogPost.Status.SCHEDULED, serializer.validated_data["published_at"], request.user
        post.save(update_fields=("status", "published_at", "updated_by", "updated_at"))
        write_audit(actor=request.user, action="BLOG_SCHEDULED", entity="BlogPost", entity_id=post.public_id, metadata={"published_at": post.published_at.isoformat()})
        return Response(self.get_serializer(post).data)
