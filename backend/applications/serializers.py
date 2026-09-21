from django.db import transaction
from rest_framework import serializers

from careers.models import Job
from .models import Application, ApplicationStatusHistory, BackgroundVerification, Document, IntegrityEvent, Interview, InterviewEvaluation, InterviewQuestion, InterviewResponse, Joining, Offer


class StatusHistorySerializer(serializers.ModelSerializer):
    changed_by = serializers.CharField(source="changed_by.username", read_only=True)

    class Meta:
        model = ApplicationStatusHistory
        fields = ("previous_status", "new_status", "changed_by", "reason", "timestamp")


class ApplicationSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="public_id", read_only=True)
    job_id = serializers.CharField(write_only=True)
    job = serializers.CharField(source="job.public_id", read_only=True)
    candidate = serializers.CharField(source="candidate.public_id", read_only=True)
    status_history = StatusHistorySerializer(many=True, read_only=True)
    job_title = serializers.CharField(source="job.title", read_only=True)
    job_department = serializers.CharField(source="job.department", read_only=True)

    class Meta:
        model = Application
        fields = ("id", "candidate", "job", "job_id", "job_title", "job_department", "applied_at", "current_status", "source", "resume_version", "profile_snapshot", "status_history", "created_at", "updated_at")
        read_only_fields = ("current_status", "applied_at", "created_at", "updated_at")

    def validate_job_id(self, value):
        try:
            return Job.objects.get(public_id=value, status=Job.Status.PUBLISHED)
        except Job.DoesNotExist as exc:
            raise serializers.ValidationError("Published job could not be found.") from exc

    def create(self, validated_data):
        request = self.context["request"]
        try:
            candidate = request.user.candidate_profile
        except Exception as exc:
            raise serializers.ValidationError("A candidate profile is required.") from exc
        job = validated_data.pop("job_id")
        snapshot = validated_data.get("profile_snapshot") or {
            "name": candidate.name, "email": candidate.email, "phone": candidate.phone,
            "location": candidate.location, "skills": candidate.skills,
            "experience": candidate.experience, "education": candidate.education,
        }
        with transaction.atomic():
            application = Application.objects.create(candidate=candidate, job=job, profile_snapshot=snapshot, **validated_data)
            ApplicationStatusHistory.objects.create(application=application, previous_status="", new_status=Application.Status.APPLIED, changed_by=request.user, reason="Application submitted")
        return application


class ApplicationAdminSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="public_id", read_only=True)
    candidate_id = serializers.CharField(source="candidate.public_id", read_only=True)
    job_id = serializers.CharField(source="job.public_id", read_only=True)
    candidate_name = serializers.CharField(source="candidate.name", read_only=True)
    candidate_email = serializers.EmailField(source="candidate.email", read_only=True)
    job_title = serializers.CharField(source="job.title", read_only=True)
    recruiter_name = serializers.CharField(source="recruiter.get_full_name", read_only=True, allow_null=True)
    hiring_manager_name = serializers.CharField(source="hiring_manager.get_full_name", read_only=True, allow_null=True)
    status_history = StatusHistorySerializer(many=True, read_only=True)

    class Meta:
        model = Application
        fields = ("id", "candidate_id", "candidate_name", "candidate_email", "job_id", "job_title", "applied_at", "current_status", "source", "resume_version", "profile_snapshot", "recruiter", "recruiter_name", "hiring_manager", "hiring_manager_name", "status_history", "created_at", "updated_at")
        read_only_fields = ("id", "candidate_id", "job_id", "applied_at", "current_status", "source", "resume_version", "profile_snapshot", "status_history", "created_at", "updated_at")


class TransitionSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Application.Status.choices)
    reason = serializers.CharField(required=False, allow_blank=True, max_length=2000)


class InterviewSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="public_id", read_only=True)
    application_id = serializers.CharField(source="application.public_id", read_only=True)
    job_id = serializers.CharField(source="application.job.public_id", read_only=True)
    job_title = serializers.CharField(source="application.job.title", read_only=True)
    instructions = serializers.SerializerMethodField()

    def get_instructions(self, obj):
        return obj.notes

    class Meta:
        model = Interview
        fields = ("id", "application_id", "job_id", "job_title", "interview_type", "status", "scheduled_at", "started_at", "completed_at", "expires_at", "configuration", "instructions", "created_at", "updated_at")


class InterviewQuestionSerializer(serializers.ModelSerializer):
    answered = serializers.SerializerMethodField()
    class Meta:
        model = InterviewQuestion
        fields = ("id", "sequence", "question", "category", "difficulty", "answered", "metadata")
    def get_answered(self, obj):
        return hasattr(obj, "response")


class InterviewResponseSerializer(serializers.ModelSerializer):
    question_id = serializers.UUIDField(source="question_record_id", read_only=True)
    class Meta:
        model = InterviewResponse
        fields = ("id", "question_id", "question", "transcript", "evaluation", "competency_signals", "score", "created_at")


class IntegrityEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = IntegrityEvent
        fields = ("id", "event_type", "severity", "occurred_at", "metadata")


class InterviewEvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterviewEvaluation
        fields = ("technical_score", "communication_score", "relevance_score", "overall_score", "integrity_summary", "structured_result", "created_at")


class InterviewSessionSerializer(InterviewSerializer):
    questions = InterviewQuestionSerializer(many=True, read_only=True)
    responses = InterviewResponseSerializer(many=True, read_only=True)
    integrity_events = IntegrityEventSerializer(many=True, read_only=True)
    evaluation_summary = InterviewEvaluationSerializer(read_only=True)
    final_result = serializers.JSONField(read_only=True)
    class Meta(InterviewSerializer.Meta):
        fields = InterviewSerializer.Meta.fields + ("questions", "responses", "integrity_events", "evaluation_summary", "final_result")


class InterviewResponseSubmitSerializer(serializers.Serializer):
    question_id = serializers.UUIDField()
    transcript = serializers.CharField(max_length=12000, trim_whitespace=True)


class IntegrityEventCreateSerializer(serializers.Serializer):
    event_type = serializers.ChoiceField(choices=("FACE_PRESENT", "FACE_MISSING", "MULTIPLE_FACES", "CAMERA_UNAVAILABLE", "CAMERA_STOPPED", "TAB_HIDDEN", "WINDOW_BLUR", "FULLSCREEN_EXIT", "CONNECTION_INTERRUPTION", "PERMISSION_CHANGED", "UNEXPECTED_INTERRUPTION"))
    severity = serializers.ChoiceField(choices=("INFO", "WARNING", "CRITICAL"), default="INFO")
    occurred_at = serializers.DateTimeField(required=False)
    metadata = serializers.JSONField(required=False)


class InterviewAdminSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="public_id", read_only=True)
    application_id = serializers.CharField(source="application.public_id", read_only=True)
    candidate_id = serializers.CharField(source="application.candidate.public_id", read_only=True)
    candidate_name = serializers.CharField(source="application.candidate.name", read_only=True)
    job_id = serializers.CharField(source="application.job.public_id", read_only=True)
    job_title = serializers.CharField(source="application.job.title", read_only=True)
    interviewer_name = serializers.CharField(source="interviewer.get_full_name", read_only=True, allow_null=True)
    questions = InterviewQuestionSerializer(many=True, read_only=True)
    responses = InterviewResponseSerializer(many=True, read_only=True)
    integrity_events = IntegrityEventSerializer(many=True, read_only=True)
    evaluation_summary = InterviewEvaluationSerializer(read_only=True)

    class Meta:
        model = Interview
        fields = ("id", "application_id", "candidate_id", "candidate_name", "job_id", "job_title", "interview_type", "status", "scheduled_at", "started_at", "completed_at", "expires_at", "interviewer", "interviewer_name", "configuration", "questions", "responses", "integrity_events", "evaluation_summary", "final_result", "result", "notes", "created_at", "updated_at")


class DocumentAdminSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="public_id", read_only=True)
    candidate_id = serializers.CharField(source="candidate.public_id", read_only=True)
    candidate_name = serializers.CharField(source="candidate.name", read_only=True)
    application_id = serializers.CharField(source="application.public_id", read_only=True, allow_null=True)
    reviewed_by_name = serializers.CharField(source="reviewed_by.get_full_name", read_only=True, allow_null=True)
    class Meta:
        model = Document
        exclude = ("storage_key",)


class BackgroundVerificationAdminSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="public_id", read_only=True)
    candidate_id = serializers.CharField(source="candidate.public_id", read_only=True)
    candidate_name = serializers.CharField(source="candidate.name", read_only=True)
    application_id = serializers.CharField(source="application.public_id", read_only=True)
    reviewer_name = serializers.CharField(source="reviewer.get_full_name", read_only=True, allow_null=True)
    class Meta:
        model = BackgroundVerification
        fields = "__all__"


class OfferAdminSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="public_id", read_only=True)
    candidate_id = serializers.CharField(source="candidate.public_id", read_only=True)
    candidate_name = serializers.CharField(source="candidate.name", read_only=True)
    application_id = serializers.CharField(source="application.public_id", read_only=True)
    job_title = serializers.CharField(source="application.job.title", read_only=True)
    class Meta:
        model = Offer
        exclude = ("created_by", "updated_by")


class JoiningAdminSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="public_id", read_only=True)
    candidate_id = serializers.CharField(source="candidate.public_id", read_only=True)
    candidate_name = serializers.CharField(source="candidate.name", read_only=True)
    application_id = serializers.CharField(source="application.public_id", read_only=True)
    job_title = serializers.CharField(source="application.job.title", read_only=True)
    class Meta:
        model = Joining
        fields = "__all__"


class DocumentSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="public_id", read_only=True)
    application_id = serializers.CharField(source="application.public_id", read_only=True, allow_null=True)
    class Meta:
        model = Document
        exclude = ("candidate", "storage_key", "reviewed_by")


class BackgroundVerificationSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="public_id", read_only=True)
    application_id = serializers.CharField(source="application.public_id", read_only=True)
    job_title = serializers.CharField(source="application.job.title", read_only=True)
    class Meta:
        model = BackgroundVerification
        exclude = ("candidate", "reviewer", "notes", "result")


class OfferSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="public_id", read_only=True)
    application_id = serializers.CharField(source="application.public_id", read_only=True)
    job_id = serializers.CharField(source="application.job.public_id", read_only=True)
    job_title = serializers.CharField(source="application.job.title", read_only=True)
    class Meta:
        model = Offer
        exclude = ("candidate", "created_by", "updated_by")


class JoiningSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="public_id", read_only=True)
    application_id = serializers.CharField(source="application.public_id", read_only=True)
    job_id = serializers.CharField(source="application.job.public_id", read_only=True)
    job_title = serializers.CharField(source="application.job.title", read_only=True)
    class Meta:
        model = Joining
        exclude = ("candidate",)
