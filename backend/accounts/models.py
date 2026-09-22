from django.contrib.auth.models import AbstractUser
from django.db import models

from core.models import UUIDModel


class User(UUIDModel, AbstractUser):
    class Role(models.TextChoices):
        CANDIDATE = "CANDIDATE", "Candidate"
        RECRUITER = "RECRUITER", "Recruiter"
        HIRING_MANAGER = "HIRING_MANAGER", "Hiring manager"
        INTERVIEWER = "INTERVIEWER", "Interviewer"
        HR = "HR", "HR"
        ADMIN = "ADMIN", "Admin"
        SUPER_ADMIN = "SUPER_ADMIN", "Super admin"

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=32, choices=Role.choices, default=Role.CANDIDATE, db_index=True)
    is_email_verified = models.BooleanField(default=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=("role",), condition=models.Q(role="SUPER_ADMIN"), name="single_super_admin_role"),
        ]

    def save(self, *args, **kwargs):
        if self.is_superuser:
            self.role = self.Role.SUPER_ADMIN
        super().save(*args, **kwargs)


class LoginVerification(UUIDModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="login_verifications")
    code_digest = models.CharField(max_length=64)
    expires_at = models.DateTimeField(db_index=True)
    attempts = models.PositiveSmallIntegerField(default=0)
    consumed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ("-created_at",)
        indexes = [models.Index(fields=("user", "created_at"))]
