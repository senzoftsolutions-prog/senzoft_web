from django.core.management.base import BaseCommand

from notifications.email import send_transactional_email


class Command(BaseCommand):
    help = "Send a SENZOFT transactional test email to one recipient."

    def add_arguments(self, parser):
        parser.add_argument("recipient", help="Email address that should receive the test")
        parser.add_argument("--name", default="", help="Recipient name used in the email greeting")

    def handle(self, *args, **options):
        sent = send_transactional_email(
            recipient=options["recipient"],
            recipient_name=options["name"],
            subject="SENZOFT email configuration test",
            heading="Your email integration is working",
            message="Django successfully sent this message through the configured email provider.",
        )
        if sent != 1:
            raise RuntimeError("The email backend did not confirm delivery acceptance.")
        self.stdout.write(self.style.SUCCESS("Test email accepted for delivery."))
