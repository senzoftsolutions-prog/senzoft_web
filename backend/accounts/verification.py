import hashlib
import hmac
import secrets
from datetime import timedelta

from django.conf import settings
from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import AuthenticationFailed, Throttled, ValidationError
from rest_framework_simplejwt.tokens import RefreshToken

from notifications.email import send_login_verification_code

from .models import LoginVerification, User


CODE_TTL_MINUTES = 10
RESEND_COOLDOWN_SECONDS = 60
MAX_ATTEMPTS = 5


def _digest(challenge_id, code: str) -> str:
    payload = f"{challenge_id}:{code}".encode()
    return hmac.new(settings.SECRET_KEY.encode(), payload, hashlib.sha256).hexdigest()


def mask_email(email: str) -> str:
    local, domain = email.split("@", 1)
    visible = local[:2]
    return f"{visible}{'*' * max(2, len(local) - len(visible))}@{domain}"


def challenge_payload(challenge: LoginVerification) -> dict:
    return {
        "verification_required": True,
        "challenge_id": str(challenge.id),
        "email": mask_email(challenge.user.email),
        "expires_in": CODE_TTL_MINUTES * 60,
    }


def issue_login_challenge(user: User, *, enforce_cooldown: bool = False) -> LoginVerification:
    now = timezone.now()
    latest = LoginVerification.objects.filter(user=user, consumed_at__isnull=True).first()
    if enforce_cooldown and latest:
        elapsed = (now - latest.created_at).total_seconds()
        if elapsed < RESEND_COOLDOWN_SECONDS:
            raise Throttled(wait=RESEND_COOLDOWN_SECONDS - int(elapsed))

    LoginVerification.objects.filter(user=user, consumed_at__isnull=True).update(consumed_at=now)
    code = f"{secrets.randbelow(1_000_000):06d}"
    challenge = LoginVerification.objects.create(
        user=user,
        code_digest="",
        expires_at=now + timedelta(minutes=CODE_TTL_MINUTES),
    )
    challenge.code_digest = _digest(challenge.id, code)
    challenge.save(update_fields=("code_digest",))
    send_login_verification_code(
        recipient=user.email,
        code=code,
        expires_minutes=CODE_TTL_MINUTES,
    )
    return challenge


def tokens_for(user: User) -> dict:
    refresh = RefreshToken.for_user(user)
    return {"refresh": str(refresh), "access": str(refresh.access_token)}


@transaction.atomic
def verify_login_challenge(*, challenge_id, code: str) -> tuple[User, dict]:
    try:
        challenge = LoginVerification.objects.select_for_update().select_related("user").get(id=challenge_id)
    except (LoginVerification.DoesNotExist, ValueError):
        raise ValidationError({"challenge_id": "Invalid verification request."})

    now = timezone.now()
    if challenge.consumed_at:
        raise ValidationError({"code": "This verification code has already been used."})
    if challenge.expires_at <= now:
        raise ValidationError({"code": "This verification code has expired. Request a new code."})
    if challenge.attempts >= MAX_ATTEMPTS:
        raise AuthenticationFailed("Too many incorrect attempts. Request a new code.")

    challenge.attempts += 1
    if not hmac.compare_digest(challenge.code_digest, _digest(challenge.id, code)):
        challenge.save(update_fields=("attempts",))
        raise AuthenticationFailed("The verification code is incorrect.")

    challenge.consumed_at = now
    challenge.save(update_fields=("attempts", "consumed_at"))
    user = challenge.user
    if not user.is_active:
        raise AuthenticationFailed("This account is inactive.")
    if not user.is_email_verified:
        user.is_email_verified = True
        user.save(update_fields=("is_email_verified",))
    return user, tokens_for(user)
