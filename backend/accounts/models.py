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

    def save(self, *args, **kwargs):
        if self.is_superuser:
            self.role = self.Role.SUPER_ADMIN
        super().save(*args, **kwargs)
