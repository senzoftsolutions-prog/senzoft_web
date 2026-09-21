from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from accounts.models import User
from .models import BlogPost


class BlogApiTests(TestCase):
    def setUp(self):
        self.admin = User.objects.create_user(username="admin", email="admin@example.com", password="safe-test-password", role=User.Role.ADMIN)

    def test_only_published_blog_is_public_and_content_is_sanitized(self):
        post = BlogPost.objects.create(title="Published", slug="published", excerpt="Excerpt", content='<p>Safe</p><script>alert(1)</script>', author=self.admin, status=BlogPost.Status.PUBLISHED, published_at=timezone.now(), created_by=self.admin, updated_by=self.admin)
        BlogPost.objects.create(title="Draft", slug="draft", excerpt="Excerpt", content="Draft", author=self.admin, created_by=self.admin, updated_by=self.admin)
        self.assertNotIn("<script>", post.content)
        response = APIClient().get("/api/v1/blogs/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual([item["slug"] for item in response.data["results"]], ["published"])

    def test_admin_can_publish_blog(self):
        post = BlogPost.objects.create(title="Draft", slug="draft", excerpt="Excerpt", content="Body", author=self.admin, created_by=self.admin, updated_by=self.admin)
        client = APIClient()
        client.force_authenticate(self.admin)
        response = client.post(f"/api/v1/admin/blogs/{post.public_id}/publish/")
        self.assertEqual(response.status_code, 200)
        post.refresh_from_db()
        self.assertEqual(post.status, BlogPost.Status.PUBLISHED)

    def test_admin_can_schedule_blog_for_a_future_date(self):
        post = BlogPost.objects.create(title="Scheduled", slug="scheduled", excerpt="Excerpt", content="Body", author=self.admin, created_by=self.admin, updated_by=self.admin)
        client = APIClient()
        client.force_authenticate(self.admin)
        publish_at = timezone.now() + timezone.timedelta(days=2)
        response = client.post(
            f"/api/v1/admin/blogs/{post.public_id}/schedule/",
            {"published_at": publish_at.isoformat()},
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        post.refresh_from_db()
        self.assertEqual(post.status, BlogPost.Status.SCHEDULED)
        self.assertEqual(post.published_at.replace(microsecond=0), publish_at.replace(microsecond=0))
