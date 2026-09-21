from html import escape

from django.conf import settings
from django.core.mail import EmailMultiAlternatives


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
