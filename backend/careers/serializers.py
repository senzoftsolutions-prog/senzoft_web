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

    def validate_skills(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("Skills must be a list.")
        cleaned = []
        for skill in value:
            item = str(skill).strip()
            if item and item.casefold() not in {existing.casefold() for existing in cleaned}:
                cleaned.append(item[:80])
        return cleaned[:50]

    def _validate_history(self, value, required, label):
        if not isinstance(value, list):
            raise serializers.ValidationError(f"{label} must be a list.")
        cleaned = []
        for row in value:
            if not isinstance(row, dict):
                raise serializers.ValidationError(f"Each {label.lower()} entry must be an object.")
            missing = [field for field in required if not str(row.get(field, "")).strip()]
            if missing:
                raise serializers.ValidationError(f"Each {label.lower()} entry requires {', '.join(missing)}.")
            cleaned.append({str(key): value for key, value in row.items() if value not in (None, "")})
        return cleaned

    def validate_experience(self, value):
        return self._validate_history(value, ("company", "role"), "Experience")

    def validate_education(self, value):
        return self._validate_history(value, ("degree", "institution"), "Education")


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
