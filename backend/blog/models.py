import bleach
from django.conf import settings
from django.db import models

from core.ids import blog_id
from core.models import TimeStampedModel


class BlogCategory(TimeStampedModel):
    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=140, unique=True)


class BlogTag(TimeStampedModel):
    name = models.CharField(max_length=80, unique=True)
    slug = models.SlugField(max_length=100, unique=True)


class BlogPost(TimeStampedModel):
    class Status(models.TextChoices):
        DRAFT = "DRAFT", "Draft"
        SCHEDULED = "SCHEDULED", "Scheduled"
        PUBLISHED = "PUBLISHED", "Published"
        ARCHIVED = "ARCHIVED", "Archived"

    public_id = models.CharField(max_length=20, unique=True, editable=False, default=blog_id)
    title = models.CharField(max_length=240)
    slug = models.SlugField(max_length=260, unique=True)
    excerpt = models.TextField()
    content = models.TextField()
    featured_image_metadata = models.JSONField(default=dict, blank=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="authored_posts")
    category = models.ForeignKey(BlogCategory, null=True, blank=True, on_delete=models.SET_NULL, related_name="posts")
    tags = models.ManyToManyField(BlogTag, blank=True, related_name="posts")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT, db_index=True)
    seo_title = models.CharField(max_length=180, blank=True)
    seo_description = models.CharField(max_length=320, blank=True)
    canonical_url = models.URLField(blank=True)
    published_at = models.DateTimeField(null=True, blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="blog_posts_created")
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="blog_posts_updated")

    class Meta:
        indexes = [models.Index(fields=("status", "published_at"))]

    def save(self, *args, **kwargs):
        allowed_tags = {"p", "h2", "h3", "h4", "ul", "ol", "li", "strong", "em", "a", "blockquote", "code", "pre"}
        self.content = bleach.clean(self.content, tags=allowed_tags, attributes={"a": ["href", "title", "rel"]}, protocols={"http", "https", "mailto"}, strip=True)
        super().save(*args, **kwargs)
