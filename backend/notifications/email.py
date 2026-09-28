from html import escape

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.utils import timezone


COMPANY_NAME = "Senzoft Software Solutions"
SUPPORT_EMAIL = "careers@senzoft.com"


def send_transactional_email(
    *,
    recipient: str,
    subject: str,
    heading: str,
    message: str,
    recipient_name: str = "",
    highlight: str = "",
    notice: str = "",
) -> int:
    """Send a personalized, branded transactional email through Django."""
    safe_heading = escape(heading)
    safe_message = escape(message).replace("\n", "<br>")
    safe_name = escape(recipient_name.strip())
    safe_highlight = escape(highlight.strip())
    safe_notice = escape(notice.strip()).replace("\n", "<br>")
    safe_logo_url = escape(settings.EMAIL_LOGO_URL, quote=True)
    greeting = f"Hello {safe_name}," if safe_name else "Hello,"

    highlight_html = ""
    if safe_highlight:
        highlight_html = f"""
          <div style="margin:24px 0;padding:18px 20px;border:1px solid #ffd1b8;border-radius:12px;background:#fff5ef;text-align:center">
            <div style="margin-bottom:6px;color:#6b7280;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase">Verification code</div>
            <div style="color:#13233f;font-size:32px;font-weight:800;letter-spacing:.18em">{safe_highlight}</div>
          </div>
        """

    notice_html = ""
    if safe_notice:
        notice_html = f"""
          <div style="margin-top:24px;padding:16px 18px;border-left:4px solid #f56b22;border-radius:8px;background:#fff7ed;color:#7c2d12;font-size:14px;line-height:1.6">
            <strong style="display:block;margin-bottom:4px;color:#9a3412">Important security notice</strong>
            {safe_notice}
          </div>
        """

    plain_parts = [greeting, heading, message]
    if highlight:
        plain_parts.append(f"Verification code: {highlight}")
    if notice:
        plain_parts.append(f"Important security notice: {notice}")
    plain_parts.extend([
        f"Need help? Contact {SUPPORT_EMAIL}.",
        f"This transactional email was sent by {COMPANY_NAME}.",
    ])
    plain_body = "\n\n".join(plain_parts)

    html_body = f"""
    <!doctype html>
    <html lang="en">
      <body style="margin:0;padding:0;background:#f3f6fa;font-family:Arial,Helvetica,sans-serif;color:#13233f">
        <div style="display:none;max-height:0;overflow:hidden;opacity:0">{safe_heading} from {COMPANY_NAME}</div>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#f3f6fa">
          <tr><td align="center" style="padding:28px 12px">
            <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:600px;border:1px solid #e5eaf1;border-radius:16px;background:#ffffff;box-shadow:0 12px 32px rgba(19,35,63,.08)">
              <tr><td style="padding:28px 32px 22px;border-bottom:1px solid #eef1f5;text-align:center">
                <img src="{safe_logo_url}" width="280" alt="{COMPANY_NAME}" style="display:block;width:100%;max-width:280px;height:auto;margin:0 auto;border:0">
                <div style="margin-top:12px;color:#f05620;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase">{COMPANY_NAME}</div>
              </td></tr>
              <tr><td style="padding:32px">
                <p style="margin:0 0 18px;color:#36445d;font-size:16px;line-height:1.6">{greeting}</p>
                <h1 style="margin:0 0 16px;color:#13233f;font-size:26px;line-height:1.25">{safe_heading}</h1>
                <div style="color:#36445d;font-size:16px;line-height:1.7">{safe_message}</div>
                {highlight_html}
                {notice_html}
                <p style="margin:26px 0 0;color:#566176;font-size:14px;line-height:1.6">Need help? Contact our careers team at <a href="mailto:{SUPPORT_EMAIL}" style="color:#d94f16;font-weight:700;text-decoration:none">{SUPPORT_EMAIL}</a>.</p>
              </td></tr>
              <tr><td style="padding:20px 32px;border-top:1px solid #eef1f5;background:#f8fafc;color:#6b7280;font-size:12px;line-height:1.6;text-align:center">
                This transactional email was sent by <strong>{COMPANY_NAME}</strong>.<br>
                Please do not forward security codes or confidential recruitment information.
              </td></tr>
            </table>
          </td></tr>
        </table>
      </body>
    </html>
    """

    email = EmailMultiAlternatives(
        subject=subject,
        body=plain_body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[recipient],
    )
    email.attach_alternative(html_body, "text/html")
    return email.send(fail_silently=False)


def send_login_verification_code(
    *,
    recipient: str,
    code: str,
    expires_minutes: int,
    recipient_name: str = "",
) -> int:
    return send_transactional_email(
        recipient=recipient,
        recipient_name=recipient_name,
        subject=f"{code} is your {COMPANY_NAME} verification code",
        heading="Confirm your sign-in",
        message="Use the secure six-digit code below to complete your sign-in.",
        highlight=code,
        notice=(
            f"This code expires in {expires_minutes} minutes. Never share it with anyone, including Senzoft staff. "
            "If you did not attempt to sign in, ignore this email and do not disclose the code."
        ),
    )


def send_application_update(*, application, status_label: str, reason: str = "") -> int:
    from .models import Notification

    candidate = application.candidate
    messages = {
        "ON_HOLD": "Your application is currently on hold while our hiring team completes its review.",
        "REJECTED": "Thank you for your interest. After careful review, we will not be moving forward with this application.",
        "SHORTLISTED": "Your application has been shortlisted and will move to the next stage.",
        "OFFER_ISSUED": "An offer has been issued for your application. Please check your registered email for the offer letter and response instructions.",
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
        sent = send_transactional_email(
            recipient=candidate.email,
            recipient_name=candidate.name,
            subject=f"Update on your {COMPANY_NAME} application – {application.job.title}",
            heading=f"Application status: {status_label}",
            message=message,
        )
        notification.status = Notification.Status.SENT if sent else Notification.Status.FAILED
        notification.sent_at = timezone.now() if sent else None
        notification.attempts = 1
    except Exception as exc:
        notification.status = Notification.Status.FAILED
        notification.attempts = 1
        notification.failure_reason = str(exc)[:2000]
    notification.save(update_fields=("status", "sent_at", "attempts", "failure_reason"))
    return 1 if notification.status == Notification.Status.SENT else 0


def send_application_submitted(*, application) -> int:
    from .models import Notification

    candidate = application.candidate
    message = (
        f"Your application for {application.job.title} has been submitted successfully.\n\n"
        f"Application ID: {application.public_id}\n"
        "We will notify you when the recruitment team updates your application or schedules an interview. "
        "For the latest information, sign in to the Senzoft Careers portal and check your application status."
    )
    notification = Notification.objects.create(
        candidate=candidate,
        application=application,
        notification_type="APPLICATION_SUBMITTED",
        channel=Notification.Channel.EMAIL,
        recipient=candidate.email,
        payload={
            "title": f"Application submitted: {application.job.title}",
            "message": message,
            "status": application.current_status,
        },
    )
    try:
        sent = send_transactional_email(
            recipient=candidate.email,
            recipient_name=candidate.name,
            subject=f"Application received – {application.job.title}",
            heading="Application submitted successfully",
            message=message,
        )
        notification.status = Notification.Status.SENT if sent else Notification.Status.FAILED
        notification.sent_at = timezone.now() if sent else None
    except Exception as exc:
        notification.status = Notification.Status.FAILED
        notification.failure_reason = str(exc)[:2000]
    notification.attempts = 1
    notification.save(update_fields=("status", "sent_at", "attempts", "failure_reason"))
    return int(notification.status == Notification.Status.SENT)


def send_interview_update(*, interview) -> int:
    from .models import Notification

    candidate = interview.application.candidate
    status_label = interview.get_status_display()
    type_label = interview.get_interview_type_display()
    is_ai_ready = interview.interview_type == "AI_SCREENING" and interview.status == "READY"
    schedule = interview.scheduled_at.strftime("%d %b %Y, %I:%M %p %Z") if interview.scheduled_at else ("Available now" if is_ai_ready else "To be confirmed")
    expiry = interview.expires_at.strftime("%d %b %Y, %I:%M %p %Z") if interview.expires_at else "Not specified"
    if is_ai_ready:
        message = (
            f"Your first-round AI pre-screening for {interview.application.job.title} is ready.\n\n"
            f"Availability: {schedule}.\nComplete by: {expiry}.\n\n"
            "The interview asks role-related questions and records your answer transcripts. "
            "Its structured results support human recruiter review and never make an automatic hiring decision.\n\n"
            "Sign in to your candidate portal, open Events, and select the interview when you are ready."
        )
    else:
        message = f"Your {type_label} interview for {interview.application.job.title} is {status_label.lower()}.\n\nScheduled time: {schedule}.\n\nSign in to your candidate portal to see the latest status."
    notification = Notification.objects.create(candidate=candidate, application=interview.application, notification_type="INTERVIEW_STATUS_CHANGED", channel=Notification.Channel.EMAIL, recipient=candidate.email, payload={"title": f"Interview update: {interview.application.job.title}", "message": message, "interview_id": interview.public_id, "status": interview.status})
    try:
        sent = send_transactional_email(
            recipient=candidate.email,
            recipient_name=candidate.name,
            subject=f"Interview update – {interview.application.job.title}",
            heading=f"Interview status: {status_label}",
            message=message,
        )
        notification.status = Notification.Status.SENT if sent else Notification.Status.FAILED
        notification.sent_at = timezone.now() if sent else None
    except Exception as exc:
        notification.status = Notification.Status.FAILED
        notification.failure_reason = str(exc)[:2000]
    notification.attempts = 1
    notification.save(update_fields=("status", "sent_at", "attempts", "failure_reason"))
    return int(notification.status == Notification.Status.SENT)


def send_application_attachment_notice(*, attachment, access_url: str) -> int:
    if not attachment.visible_to_candidate:
        return 0
    application = attachment.application
    message = f"The recruitment team added {attachment.title} to your application for {application.job.title}.\n\nOpen: {access_url}"
    return send_transactional_email(
        recipient=application.candidate.email,
        recipient_name=application.candidate.name,
        subject=f"New application document – {application.job.title}",
        heading="A new item is available",
        message=message,
    )
