from rest_framework import serializers
from .models import CandidateProfile, Job


class PublicJobSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="public_id", read_only=True)

    class Meta:
        model = Job
        fields = ("id", "title", "slug", "department", "business_unit", "location", "additional_locations", "work_mode", "employment_type", "experience_level", "minimum_experience", "maximum_experience", "description", "responsibilities", "required_skills", "preferred_skills", "qualifications", "benefits", "reporting_to", "travel_requirement", "hiring_eligibility", "relocation_assistance", "about_company", "number_of_openings", "application_deadline", "published_at")


class JobAdminSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="public_id", read_only=True)
    applications_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Job
        exclude = ("created_by", "updated_by")
        read_only_fields = ("status", "published_at", "closed_at", "created_at", "updated_at")


class CandidateProfileSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="public_id", read_only=True)

    class Meta:
        model = CandidateProfile
        exclude = ("user",)
        read_only_fields = ("created_at", "updated_at")


class CandidateAdminSerializer(CandidateProfileSerializer):
    applications_count = serializers.IntegerField(read_only=True)
    latest_application_at = serializers.DateTimeField(read_only=True, allow_null=True)
    latest_status = serializers.CharField(read_only=True, allow_null=True)

    class Meta(CandidateProfileSerializer.Meta):
        exclude = None
        fields = (
            "id", "name", "email", "phone", "location", "professional_summary",
            "skills", "experience", "education", "certifications", "resume_metadata",
            "linkedin_url", "portfolio_url", "applications_count", "latest_application_at",
            "latest_status", "created_at", "updated_at",
        )
