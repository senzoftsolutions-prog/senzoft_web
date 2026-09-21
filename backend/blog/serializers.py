from rest_framework import serializers
from .models import BlogCategory, BlogPost, BlogTag


class BlogPostSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="public_id", read_only=True)
    author = serializers.CharField(source="author.get_full_name", read_only=True)
    category = serializers.CharField(source="category.name", read_only=True)
    tags = serializers.SlugRelatedField(many=True, read_only=True, slug_field="name")

    class Meta:
        model = BlogPost
        fields = ("id", "title", "slug", "excerpt", "content", "featured_image_metadata", "author", "category", "tags", "seo_title", "seo_description", "canonical_url", "published_at", "updated_at")


class BlogAdminSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="public_id", read_only=True)
    class Meta:
        model = BlogPost
        exclude = ("created_by", "updated_by")
        read_only_fields = ("author", "status", "published_at", "created_at", "updated_at")


class BlogScheduleSerializer(serializers.Serializer):
    published_at = serializers.DateTimeField()

    def validate_published_at(self, value):
        from django.utils import timezone
        if value <= timezone.now():
            raise serializers.ValidationError("Scheduled publication must be in the future.")
        return value
