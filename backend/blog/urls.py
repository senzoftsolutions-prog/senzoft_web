from django.urls import path
from .views import PublicBlogDetailView, PublicBlogListView

urlpatterns = [
    path("blogs/", PublicBlogListView.as_view(), name="blog-list"),
    path("blogs/<slug:slug>/", PublicBlogDetailView.as_view(), name="blog-detail"),
]
