from django.core import mail
from django.test import TestCase, override_settings

from .email import send_transactional_email


@override_settings(EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend")
class TransactionalEmailTests(TestCase):
    def test_sends_plain_text_and_html_versions(self):
        sent = send_transactional_email(
            recipient="candidate@example.com",
            subject="Test subject",
            heading="Test heading",
            message="First line\nSecond line",
        )

        self.assertEqual(sent, 1)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].to, ["candidate@example.com"])
        self.assertEqual(mail.outbox[0].subject, "Test subject")
        self.assertEqual(mail.outbox[0].alternatives[0][1], "text/html")
