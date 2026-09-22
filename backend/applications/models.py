from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models, transaction
from django.utils import timezone

from careers.models import CandidateProfile, Job
from core.ids import application_id, bgv_id, document_id, interview_id, joining_id, offer_id
from core.models import TimeStampedModel


class Application(TimeStampedModel):
    class Status(models.TextChoices):
        APPLIED = "APPLIED", "Applied"
        TALENT_REVIEW = "TALENT_REVIEW", "Talent review"
        SHORTLISTED = "SHORTLISTED", "Shortlisted"
        AI_INTERVIEW_INVITED = "AI_INTERVIEW_INVITED", "AI interview invited"
        AI_INTERVIEW_IN_PROGRESS = "AI_INTERVIEW_IN_PROGRESS", "AI interview in progress"
        AI_INTERVIEW_COMPLETED = "AI_INTERVIEW_COMPLETED", "AI interview completed"
        TECHNICAL_INTERVIEW = "TECHNICAL_INTERVIEW", "Technical interview"
        HR_INTERVIEW = "HR_INTERVIEW", "HR interview"
        DOCUMENTS_REQUESTED = "DOCUMENTS_REQUESTED", "Documents requested"
        DOCUMENTS_SUBMITTED = "DOCUMENTS_SUBMITTED", "Documents submitted"
        BACKGROUND_VERIFICATION = "BACKGROUND_VERIFICATION", "Background verification"
        BGV_COMPLETED = "BGV_COMPLETED", "BGV completed"
        OFFER_ISSUED = "OFFER_ISSUED", "Offer issued"
        OFFER_ACCEPTED = "OFFER_ACCEPTED", "Offer accepted"
        JOINING_PROCESS = "JOINING_PROCESS", "Joining process"
        JOINED = "JOINED", "Joined"
        REJECTED = "REJECTED", "Rejected"
        WITHDRAWN = "WITHDRAWN", "Withdrawn"
        ON_HOLD = "ON_HOLD", "On hold"
        CANCELLED = "CANCELLED", "Cancelled"
        OFFER_DECLINED = "OFFER_DECLINED", "Offer declined"
        NO_SHOW = "NO_SHOW", "No show"

    TERMINAL = {Status.JOINED, Status.REJECTED, Status.WITHDRAWN, Status.CANCELLED, Status.OFFER_DECLINED, Status.NO_SHOW}
    TRANSITIONS = {
        Status.APPLIED: {Status.TALENT_REVIEW, Status.WITHDRAWN, Status.REJECTED, Status.CANCELLED, Status.ON_HOLD},
        Status.TALENT_REVIEW: {Status.SHORTLISTED, Status.REJECTED, Status.ON_HOLD, Status.CANCELLED},
        Status.SHORTLISTED: {Status.AI_INTERVIEW_INVITED, Status.TECHNICAL_INTERVIEW, Status.REJECTED, Status.ON_HOLD},
        Status.AI_INTERVIEW_INVITED: {Status.AI_INTERVIEW_IN_PROGRESS, Status.REJECTED, Status.NO_SHOW, Status.ON_HOLD},
        Status.AI_INTERVIEW_IN_PROGRESS: {Status.AI_INTERVIEW_COMPLETED, Status.CANCELLED},
        Status.AI_INTERVIEW_COMPLETED: {Status.TECHNICAL_INTERVIEW, Status.REJECTED, Status.ON_HOLD},
        Status.TECHNICAL_INTERVIEW: {Status.HR_INTERVIEW, Status.REJECTED, Status.NO_SHOW, Status.ON_HOLD},
        Status.HR_INTERVIEW: {Status.DOCUMENTS_REQUESTED, Status.REJECTED, Status.NO_SHOW, Status.ON_HOLD},
        Status.DOCUMENTS_REQUESTED: {Status.DOCUMENTS_SUBMITTED, Status.CANCELLED},
        Status.DOCUMENTS_SUBMITTED: {Status.BACKGROUND_VERIFICATION, Status.CANCELLED},
        Status.BACKGROUND_VERIFICATION: {Status.BGV_COMPLETED, Status.REJECTED, Status.ON_HOLD},
        Status.BGV_COMPLETED: {Status.OFFER_ISSUED, Status.REJECTED},
        Status.OFFER_ISSUED: {Status.OFFER_ACCEPTED, Status.OFFER_DECLINED, Status.CANCELLED},
        Status.OFFER_ACCEPTED: {Status.JOINING_PROCESS, Status.CANCELLED},
        Status.JOINING_PROCESS: {Status.JOINED, Status.NO_SHOW, Status.CANCELLED},
        Status.ON_HOLD: {Status.TALENT_REVIEW, Status.SHORTLISTED, Status.TECHNICAL_INTERVIEW, Status.HR_INTERVIEW, Status.CANCELLED},
    }

    public_id = models.CharField(max_length=20, unique=True, editable=False, default=application_id)
    candidate = models.ForeignKey(CandidateProfile, on_delete=models.PROTECT, related_name="applications")
    job = models.ForeignKey(Job, on_delete=models.PROTECT, related_name="applications")
    applied_at = models.DateTimeField(auto_now_add=True)
    current_status = models.CharField(max_length=32, choices=Status.choices, default=Status.APPLIED, db_index=True)
    source = models.CharField(max_length=100, default="SENZOFT_WEBSITE")
    resume_version = models.JSONField(default=dict)
    profile_snapshot = models.JSONField(default=dict)
    recruiter = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name="recruited_applications")
    hiring_manager = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name="managed_applications")

    class Meta:
        constraints = [models.UniqueConstraint(fields=("candidate", "job"), name="unique_candidate_job_application")]
        indexes = [models.Index(fields=("current_status", "applied_at"))]

    def transition_to(self, new_status, actor, reason=""):
        allowed = self.TRANSITIONS.get(self.current_status, set())
        if new_status not in allowed:
            raise ValidationError(f"Cannot transition from {self.current_status} to {new_status}.")
        previous = self.current_status
        with transaction.atomic():
            self.current_status = new_status
            self.save(update_fields=("current_status", "updated_at"))
            return ApplicationStatusHistory.objects.create(application=self, previous_status=previous, new_status=new_status, changed_by=actor, reason=reason)


class ApplicationStatusHistory(models.Model):
    id = models.BigAutoField(primary_key=True)
    application = models.ForeignKey(Application, on_delete=models.PROTECT, related_name="status_history")
    previous_status = models.CharField(max_length=32, blank=True)
    new_status = models.CharField(max_length=32, choices=Application.Status.choices)
    changed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="application_status_changes")
    reason = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("timestamp",)


def application_attachment_path(instance, filename):
    safe_name = filename.replace("/", "_").replace("\\", "_")
    return f"recruitment/applications/{instance.application.public_id}/{safe_name}"


class ApplicationAttachment(TimeStampedModel):
    class Type(models.TextChoices):
        MEETING_LINK = "MEETING_LINK", "Meeting link"
        INTERVIEW_DOCUMENT = "INTERVIEW_DOCUMENT", "Interview document"
        OFFER_LETTER = "OFFER_LETTER", "Offer letter"
        OTHER = "OTHER", "Other"

    application = models.ForeignKey(Application, on_delete=models.CASCADE, related_name="attachments")
    attachment_type = models.CharField(max_length=32, choices=Type.choices)
    title = models.CharField(max_length=160)
    url = models.URLField(max_length=1000, blank=True)
    file = models.FileField(upload_to=application_attachment_path, blank=True)
    note = models.TextField(blank=True)
    visible_to_candidate = models.BooleanField(default=True)
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="application_attachments")

    class Meta:
        ordering = ("-created_at",)

    def clean(self):
        if not self.url and not self.file:
            raise ValidationError("Add either a web link or a document.")


class Interview(TimeStampedModel):
    class Type(models.TextChoices):
        AI_SCREENING = "AI_SCREENING", "AI screening"
        TECHNICAL = "TECHNICAL", "Technical"
        HR = "HR", "HR"
        MANAGERIAL = "MANAGERIAL", "Managerial"
        OTHER = "OTHER", "Other"
    class Status(models.TextChoices):
        CREATED = "CREATED", "Created"
        READY = "READY", "Ready"
        SCHEDULED = "SCHEDULED", "Scheduled"
        IN_PROGRESS = "IN_PROGRESS", "In progress"
        COMPLETED = "COMPLETED", "Completed"
        CANCELLED = "CANCELLED", "Cancelled"
        NO_SHOW = "NO_SHOW", "No show"
        EXPIRED = "EXPIRED", "Expired"
        FAILED = "FAILED", "Failed"

    public_id = models.CharField(max_length=20, unique=True, editable=False, default=interview_id)
    application = models.ForeignKey(Application, on_delete=models.PROTECT, related_name="interviews")
    interview_type = models.CharField(max_length=20, choices=Type.choices)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.SCHEDULED)
    scheduled_at = models.DateTimeField(null=True, blank=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    interviewer = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name="assigned_interviews")
    result = models.JSONField(default=dict, blank=True)
    notes = models.TextField(blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    configuration = models.JSONField(default=dict, blank=True)
    final_result = models.JSONField(default=dict, blank=True)

    TRANSITIONS = {
        Status.CREATED: {Status.READY, Status.CANCELLED},
        Status.SCHEDULED: {Status.READY, Status.CANCELLED, Status.EXPIRED},
        Status.READY: {Status.IN_PROGRESS, Status.CANCELLED, Status.EXPIRED},
        Status.IN_PROGRESS: {Status.COMPLETED, Status.FAILED, Status.CANCELLED, Status.EXPIRED},
    }

    def transition_to(self, new_status):
        if new_status not in self.TRANSITIONS.get(self.status, set()):
            raise ValidationError(f"Cannot transition interview from {self.status} to {new_status}.")
        self.status = new_status
        if new_status == self.Status.IN_PROGRESS and not self.started_at:
            self.started_at = timezone.now()
        if new_status == self.Status.COMPLETED:
            self.completed_at = timezone.now()
        self.save()


class InterviewQuestion(TimeStampedModel):
    class Category(models.TextChoices):
        TECHNICAL = "TECHNICAL", "Technical"
        EXPERIENCE = "EXPERIENCE", "Experience"
        PROJECT = "PROJECT", "Project"
        BEHAVIORAL = "BEHAVIORAL", "Behavioral"

    interview = models.ForeignKey(Interview, on_delete=models.CASCADE, related_name="questions")
    sequence = models.PositiveSmallIntegerField()
    question = models.TextField(max_length=2000)
    category = models.CharField(max_length=20, choices=Category.choices)
    difficulty = models.CharField(max_length=20, default="MEDIUM")
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ("sequence",)
        constraints = [models.UniqueConstraint(fields=("interview", "sequence"), name="unique_interview_question_sequence")]


class InterviewResponse(TimeStampedModel):
    interview = models.ForeignKey(Interview, on_delete=models.CASCADE, related_name="responses")
    question = models.TextField()
    transcript = models.TextField(blank=True)
    evaluation = models.JSONField(default=dict, blank=True)
    competency_signals = models.JSONField(default=dict, blank=True)
    monitoring_events = models.JSONField(default=list, blank=True)
    question_record = models.OneToOneField(InterviewQuestion, null=True, blank=True, on_delete=models.PROTECT, related_name="response")
    score = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)


class IntegrityEvent(TimeStampedModel):
    interview = models.ForeignKey(Interview, on_delete=models.CASCADE, related_name="integrity_events")
    event_type = models.CharField(max_length=64, db_index=True)
    severity = models.CharField(max_length=16, default="INFO")
    occurred_at = models.DateTimeField(default=timezone.now)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        indexes = [models.Index(fields=("interview", "occurred_at"))]


class InterviewEvaluation(TimeStampedModel):
    interview = models.OneToOneField(Interview, on_delete=models.CASCADE, related_name="evaluation_summary")
    technical_score = models.DecimalField(max_digits=4, decimal_places=2, default=0)
    communication_score = models.DecimalField(max_digits=4, decimal_places=2, default=0)
    relevance_score = models.DecimalField(max_digits=4, decimal_places=2, default=0)
    overall_score = models.DecimalField(max_digits=4, decimal_places=2, default=0)
    integrity_summary = models.JSONField(default=dict, blank=True)
    structured_result = models.JSONField(default=dict, blank=True)


class Document(TimeStampedModel):
    class Type(models.TextChoices):
        RESUME = "RESUME", "Resume"
        IDENTITY = "IDENTITY", "Identity"
        EDUCATION = "EDUCATION", "Education"
        EXPERIENCE = "EXPERIENCE", "Experience"
        ADDRESS_PROOF = "ADDRESS_PROOF", "Address proof"
        OTHER = "OTHER", "Other"
    class UploadStatus(models.TextChoices):
        PENDING = "PENDING", "Pending"
        UPLOADED = "UPLOADED", "Uploaded"
        REVIEWED = "REVIEWED", "Reviewed"
        REJECTED = "REJECTED", "Rejected"

    public_id = models.CharField(max_length=20, unique=True, editable=False, default=document_id)
    candidate = models.ForeignKey(CandidateProfile, on_delete=models.PROTECT, related_name="documents")
    application = models.ForeignKey(Application, null=True, blank=True, on_delete=models.PROTECT, related_name="documents")
    document_type = models.CharField(max_length=20, choices=Type.choices)
    file_name = models.CharField(max_length=255)
    file_size = models.PositiveBigIntegerField()
    mime_type = models.CharField(max_length=120)
    storage_key = models.CharField(max_length=500, unique=True)
    upload_status = models.CharField(max_length=20, choices=UploadStatus.choices, default=UploadStatus.PENDING)
    uploaded_at = models.DateTimeField(null=True, blank=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    reviewed_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name="documents_reviewed")


class BackgroundVerification(TimeStampedModel):
    class Status(models.TextChoices):
        NOT_STARTED = "NOT_STARTED", "Not started"
        REQUESTED = "REQUESTED", "Requested"
        IN_PROGRESS = "IN_PROGRESS", "In progress"
        VERIFICATION_REQUIRED = "VERIFICATION_REQUIRED", "Verification required"
        COMPLETED = "COMPLETED", "Completed"
        FAILED = "FAILED", "Failed"
    public_id = models.CharField(max_length=20, unique=True, editable=False, default=bgv_id)
    candidate = models.ForeignKey(CandidateProfile, on_delete=models.PROTECT, related_name="background_verifications")
    application = models.OneToOneField(Application, on_delete=models.PROTECT, related_name="background_verification")
    status = models.CharField(max_length=28, choices=Status.choices, default=Status.NOT_STARTED)
    requested_at = models.DateTimeField(null=True, blank=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    result = models.JSONField(default=dict, blank=True)
    reviewer = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name="bgv_reviews")
    notes = models.TextField(blank=True)


class Offer(TimeStampedModel):
    class Status(models.TextChoices):
        DRAFT = "DRAFT", "Draft"
        PENDING_APPROVAL = "PENDING_APPROVAL", "Pending approval"
        ISSUED = "ISSUED", "Issued"
        VIEWED = "VIEWED", "Viewed"
        ACCEPTED = "ACCEPTED", "Accepted"
        DECLINED = "DECLINED", "Declined"
        EXPIRED = "EXPIRED", "Expired"
        CANCELLED = "CANCELLED", "Cancelled"
    public_id = models.CharField(max_length=20, unique=True, editable=False, default=offer_id)
    candidate = models.ForeignKey(CandidateProfile, on_delete=models.PROTECT, related_name="offers")
    application = models.OneToOneField(Application, on_delete=models.PROTECT, related_name="offer")
    status = models.CharField(max_length=24, choices=Status.choices, default=Status.DRAFT)
    issued_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    accepted_at = models.DateTimeField(null=True, blank=True)
    declined_at = models.DateTimeField(null=True, blank=True)
    joining_date = models.DateField(null=True, blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="offers_created")
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="offers_updated")


class Joining(TimeStampedModel):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        CONFIRMED = "CONFIRMED", "Confirmed"
        JOINED = "JOINED", "Joined"
        NO_SHOW = "NO_SHOW", "No show"
        CANCELLED = "CANCELLED", "Cancelled"
    public_id = models.CharField(max_length=20, unique=True, editable=False, default=joining_id)
    candidate = models.ForeignKey(CandidateProfile, on_delete=models.PROTECT, related_name="joining_records")
    application = models.OneToOneField(Application, on_delete=models.PROTECT, related_name="joining")
    offer = models.OneToOneField(Offer, on_delete=models.PROTECT, related_name="joining")
    joining_date = models.DateField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    location = models.CharField(max_length=160)
    department = models.CharField(max_length=120)
