from datetime import timedelta

from django.conf import settings
from django.utils import timezone

from audit.services import write_audit
from notifications.email import send_application_update, send_interview_update

from .models import Application, Interview


def create_initial_ai_screening(*, application: Application, actor) -> Interview | None:
    """Create the automatic first-round screen once for a new application."""
    if not settings.AUTO_CREATE_AI_SCREENING:
        return None

    defaults = {
        **settings.AI_INTERVIEW_DEFAULTS,
        "round": 1,
        "stage": "FIRST_ROUND_PRE_SCREENING",
        "human_review_required": True,
    }
    interview, created = Interview.objects.get_or_create(
        application=application,
        interview_type=Interview.Type.AI_SCREENING,
        defaults={
            "status": Interview.Status.READY,
            "expires_at": timezone.now() + timedelta(days=settings.AI_INTERVIEW_EXPIRY_DAYS),
            "configuration": defaults,
            "notes": (
                "First-round AI pre-screening. Questions are tailored to the role. "
                "Results support recruiter review and never make an automatic hiring decision."
            ),
        },
    )
    if not created:
        return interview

    application.transition_to(
        Application.Status.AI_INTERVIEW_INVITED,
        actor,
        "Automatic first-round AI pre-screening created after application submission.",
    )
    write_audit(
        actor=actor,
        action="AI_PRE_SCREENING_CREATED",
        entity="Interview",
        entity_id=interview.public_id,
        metadata={"application_id": application.public_id, "round": 1},
    )
    return interview


def notify_initial_ai_screening(interview: Interview | None) -> None:
    if interview is not None:
        send_application_update(
            application=interview.application,
            status_label=interview.application.get_current_status_display(),
            reason="Your first-round AI pre-screening is ready.",
        )
        send_interview_update(interview=interview)
