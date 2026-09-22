from html import escape

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.utils import timezone


def send_transactional_email(
    *,
    recipient: str,
    subject: str,
    heading: str,
    message: str,
) -> int:
    """Send a simple branded transactional email through Django's mail backend."""
    safe_heading = escape(heading)
    safe_message = escape(message).replace("\n", "<br>")
    html_body = f"""
    <!doctype html>
    <html lang="en">
      <body style="margin:0;background:#f5f7fb;font-family:Arial,sans-serif;color:#13233f">
        <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:12px;padding:32px">
          <div style="font-weight:700;letter-spacing:.06em;color:#f56b22">SENZOFT</div>
          <h1 style="font-size:24px;margin:24px 0 12px">{safe_heading}</h1>
          <p style="font-size:16px;line-height:1.6;margin:0">{safe_message}</p>
        </div>
      </body>
    </html>
    """
    email = EmailMultiAlternatives(
        subject=subject,
        body=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[recipient],
    )
    email.attach_alternative(html_body, "text/html")
    return email.send(fail_silently=False)


def send_login_verification_code(*, recipient: str, code: str, expires_minutes: int) -> int:
    return send_transactional_email(
        recipient=recipient,
        subject=f"{code} is your SENZOFT verification code",
        heading="Confirm your sign-in",
        message=(
            f"Your SENZOFT verification code is {code}.\n\n"
            f"It expires in {expires_minutes} minutes. Never share this code with anyone. "
            "If you did not attempt to sign in, you can ignore this email."
        ),
    )


def send_application_update(*, application, status_label: str, reason: str = "") -> int:
    from .models import Notification

    candidate = application.candidate
    messages = {
        "ON_HOLD": "Your application is currently on hold while our hiring team completes its review.",
        "REJECTED": "Thank you for your interest. After careful review, we will not be moving forward with this application.",
        "SHORTLISTED": "Your application has been shortlisted and will move to the next stage.",
        "OFFER_ISSUED": "An offer has been issued for your application. Please sign in to your candidate portal to review the details.",
    }
    message = messages.get(application.current_status, f"Your application has moved to the {status_label} stage.")
    if reason:
        message += f"\n\nRecruitment team note: {reason}"
    notification = Notification.objects.create(
        candidate=candidate,
        application=application,
        notification_type="APPLICATION_STATUS_CHANGED",
        channel=Notification.Channel.EMAIL,
        recipient=candidate.email,
        payload={"title": f"Application update: {application.job.title}", "message": message, "status": application.current_status},
    )
    try:
        sent = send_transactional_email(recipient=candidate.email, subject=f"Update on your SENZOFT application – {application.job.title}", heading=f"Application status: {status_label}", message=message)
        notification.status = Notification.Status.SENT if sent else Notification.Status.FAILED
        notification.sent_at = timezone.now() if sent else None
        notification.attempts = 1
    except Exception as exc:
        notification.status = Notification.Status.FAILED
        notification.attempts = 1
        notification.failure_reason = str(exc)[:2000]
    notification.save(update_fields=("status", "sent_at", "attempts", "failure_reason"))
    return 1 if notification.status == Notification.Status.SENT else 0


def send_application_attachment_notice(*, attachment, access_url: str) -> int:
    if not attachment.visible_to_candidate:
        return 0
    application = attachment.application
    message = f"The recruitment team added {attachment.title} to your application for {application.job.title}.\n\nOpen: {access_url}"
    return send_transactional_email(recipient=application.candidate.email, subject=f"New application document – {application.job.title}", heading="A new item is available", message=message)
