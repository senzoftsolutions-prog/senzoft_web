from datetime import timedelta
import os
from pathlib import Path

import dj_database_url


BACKEND_DIR = Path(__file__).resolve().parents[2]
ROOT_DIR = BACKEND_DIR.parent


def load_env_file(path: Path) -> None:
    if not path.exists():
        return
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


# Explicit process variables win. A local override wins over the shared .env
# because load_env_file uses setdefault rather than replacing existing values.
load_env_file(ROOT_DIR / ".env.local")
load_env_file(ROOT_DIR / ".env")

SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "unsafe-development-key-change-me")
DEBUG = os.getenv("DJANGO_DEBUG", "false").lower() == "true"
ALLOWED_HOSTS = [item.strip() for item in os.getenv("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1").split(",") if item.strip()]

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "django_filters",
    "rest_framework",
    "accounts",
    "careers",
    "applications",
    "blog",
    "notifications",
    "audit",
    "consent",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"
TEMPLATES = [{
    "BACKEND": "django.template.backends.django.DjangoTemplates",
    "DIRS": [],
    "APP_DIRS": True,
    "OPTIONS": {"context_processors": [
        "django.template.context_processors.request",
        "django.contrib.auth.context_processors.auth",
        "django.contrib.messages.context_processors.messages",
    ]},
}]
WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

database_url = os.getenv("DATABASE_URL")
if database_url:
    DATABASES = {"default": dj_database_url.parse(database_url, conn_max_age=60, conn_health_checks=True, ssl_require=True)}
else:
    DATABASES = {"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": BACKEND_DIR / "db.sqlite3"}}

AUTH_USER_MODEL = "accounts.User"
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Kolkata"
USE_I18N = True
USE_TZ = True
STATIC_URL = "static/"
STATIC_ROOT = BACKEND_DIR / "staticfiles"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
CORS_ALLOWED_ORIGINS = [item.strip() for item in os.getenv("CORS_ALLOWED_ORIGINS", FRONTEND_URL).split(",") if item.strip()]
CSRF_TRUSTED_ORIGINS = CORS_ALLOWED_ORIGINS
CORS_ALLOW_CREDENTIALS = True

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": ("rest_framework_simplejwt.authentication.JWTAuthentication",),
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.IsAuthenticated",),
    "DEFAULT_FILTER_BACKENDS": ("django_filters.rest_framework.DjangoFilterBackend", "rest_framework.filters.SearchFilter", "rest_framework.filters.OrderingFilter"),
    "DEFAULT_PAGINATION_CLASS": "core.pagination.ApiPagination",
    "PAGE_SIZE": 20,
    "EXCEPTION_HANDLER": "core.exceptions.api_exception_handler",
    "DEFAULT_THROTTLE_CLASSES": ("rest_framework.throttling.AnonRateThrottle", "rest_framework.throttling.UserRateThrottle", "rest_framework.throttling.ScopedRateThrottle"),
    "DEFAULT_THROTTLE_RATES": {"anon": "100/hour", "user": "1000/hour", "auth": "30/hour", "consent": "120/hour", "interview": "120/hour", "interview_events": "300/hour"},
}
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=15),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": False,
}

SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = "DENY"
SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_HTTPONLY = True
EMAIL_PROVIDER = os.getenv("EMAIL_PROVIDER", "console").strip().lower()
if EMAIL_PROVIDER in {"zeptomail", "smtp"}:
    EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
    EMAIL_HOST = os.getenv("EMAIL_HOST", "smtp.zeptomail.in")
    EMAIL_PORT = int(os.getenv("EMAIL_PORT", "587"))
    EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER", "emailapikey")
    EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD", "")
    EMAIL_USE_TLS = os.getenv("EMAIL_USE_TLS", "true").lower() == "true"
    EMAIL_USE_SSL = os.getenv("EMAIL_USE_SSL", "false").lower() == "true"
    if EMAIL_USE_TLS and EMAIL_USE_SSL:
        raise RuntimeError("EMAIL_USE_TLS and EMAIL_USE_SSL cannot both be enabled")
else:
    EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

DEFAULT_FROM_EMAIL = os.getenv(
    "DEFAULT_FROM_EMAIL",
    "Senzoft Software Solutions <careers@senzoft.com>",
)
SERVER_EMAIL = DEFAULT_FROM_EMAIL
EMAIL_TIMEOUT = int(os.getenv("EMAIL_TIMEOUT", "15"))
EMAIL_LOGO_URL = os.getenv(
    "EMAIL_LOGO_URL",
    "https://www.senzoft.com/media/senzoftweblogo-transparent.png",
)
MEDIA_URL = "/media/"
MEDIA_ROOT = BACKEND_DIR / "media"
PRIVATE_UPLOAD_ROOT = BACKEND_DIR / "private_uploads"
CANDIDATE_DOCUMENTS_BUCKET = os.getenv("CANDIDATE_DOCUMENTS_BUCKET", "candidate-documents")
RECRUITMENT_EMAIL = os.getenv("RECRUITMENT_EMAIL", os.getenv("CONTACT_RECIPIENT_EMAIL", "careers@senzoft.com"))
AI_PROVIDER = os.getenv("AI_PROVIDER", "native")
AI_MODEL = os.getenv("AI_MODEL", "gpt-5-mini")
AI_SERVICE_URL = os.getenv("AI_SERVICE_URL", os.getenv("NEON_AI_GATEWAY_BASE_URL", ""))
AI_SERVICE_TOKEN = os.getenv("AI_SERVICE_TOKEN", os.getenv("NEON_AI_GATEWAY_TOKEN", ""))
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://127.0.0.1:11434/v1")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "qwen2.5:7b")
AUTO_CREATE_AI_SCREENING = os.getenv("AUTO_CREATE_AI_SCREENING", "false").lower() == "true"
AI_INTERVIEW_EXPIRY_DAYS = int(os.getenv("AI_INTERVIEW_EXPIRY_DAYS", "7"))
AI_INTERVIEW_DEFAULTS = {
    "minimum_questions": 3,
    "maximum_questions": 5,
    "duration_minutes": 30,
    "technical_questions": 2,
    "experience_questions": 1,
    "project_questions": 1,
    "behavioral_questions": 1,
    "difficulty": "MEDIUM",
}
