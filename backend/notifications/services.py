from abc import ABC, abstractmethod
from django.core.mail import send_mail


class NotificationProvider(ABC):
    @abstractmethod
    def send(self, *, recipient: str, subject: str, body: str) -> str:
        raise NotImplementedError


class DjangoEmailProvider(NotificationProvider):
    def send(self, *, recipient: str, subject: str, body: str) -> str:
        send_mail(subject, body, None, [recipient], fail_silently=False)
        return "console"
