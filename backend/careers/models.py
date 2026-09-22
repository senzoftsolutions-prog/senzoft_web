from django.conf import settings
from django.db import models
from django.utils import timezone

from core.ids import candidate_id, job_id
from core.models import TimeStampedModel


class CandidateProfile(TimeStampedModel):
    public_id = models.CharField(max_length=20, unique=True, editable=False, default=candidate_id)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="candidate_profile")
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=32, blank=True)
    location = models.CharField(max_length=160, blank=True)
    professional_summary = models.TextField(blank=True)
    current_role = models.CharField(max_length=160, blank=True)
    years_of_experience = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True)
    skills = models.JSONField(default=list, blank=True)
    experience = models.JSONField(default=list, blank=True)
    education = models.JSONField(default=list, blank=True)
    certifications = models.JSONField(default=list, blank=True)
    resume_metadata = models.JSONField(default=dict, blank=True)
    linkedin_url = models.URLField(blank=True)
    portfolio_url = models.URLField(blank=True)

    def __str__(self):
        return f"{self.public_id} {self.name}"


class Job(TimeStampedModel):
    class Status(models.TextChoices):
        DRAFT = "DRAFT", "Draft"
        PENDING_APPROVAL = "PENDING_APPROVAL", "Pending approval"
        PUBLISHED = "PUBLISHED", "Published"
        PAUSED = "PAUSED", "Paused"
        CLOSED = "CLOSED", "Closed"
        ARCHIVED = "ARCHIVED", "Archived"

    class WorkMode(models.TextChoices):
        ONSITE = "ONSITE", "On-site"
        HYBRID = "HYBRID", "Hybrid"
        REMOTE = "REMOTE", "Remote"

    public_id = models.CharField(max_length=20, unique=True, editable=False, default=job_id)
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    department = models.CharField(max_length=120, db_index=True)
    business_unit = models.CharField(max_length=120, blank=True)
    location = models.CharField(max_length=160, db_index=True)
    additional_locations = models.JSONField(default=list, blank=True)
    work_mode = models.CharField(max_length=16, choices=WorkMode.choices, db_index=True)
    employment_type = models.CharField(max_length=64, db_index=True)
    experience_level = models.CharField(max_length=80, blank=True)
    minimum_experience = models.PositiveSmallIntegerField(default=0)
    maximum_experience = models.PositiveSmallIntegerField(null=True, blank=True)
    description = models.TextField()
    responsibilities = models.JSONField(default=list)
    required_skills = models.JSONField(default=list)
    preferred_skills = models.JSONField(default=list, blank=True)
    qualifications = models.JSONField(default=list, blank=True)
    benefits = models.JSONField(default=list, blank=True)
    reporting_to = models.CharField(max_length=160, blank=True)
    travel_requirement = models.CharField(max_length=120, blank=True)
    hiring_eligibility = models.CharField(max_length=160, blank=True)
    relocation_assistance = models.CharField(max_length=160, blank=True)
    about_company = models.TextField(blank=True)
    seo_title = models.CharField(max_length=180, blank=True)
    seo_description = models.CharField(max_length=320, blank=True)
    number_of_openings = models.PositiveSmallIntegerField(default=1)
    application_deadline = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=24, choices=Status.choices, default=Status.DRAFT, db_index=True)
    published_at = models.DateTimeField(null=True, blank=True)
    closed_at = models.DateTimeField(null=True, blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="jobs_created")
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="jobs_updated")

    class Meta:
        indexes = [models.Index(fields=("status", "published_at")), models.Index(fields=("department", "location"))]

    def publish(self):
        self.status = self.Status.PUBLISHED
        self.published_at = self.published_at or timezone.now()

    def __str__(self):
        return f"{self.public_id} {self.title}"
