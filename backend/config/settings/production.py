from .base import *  # noqa: F403

DEBUG = False
ALLOWED_HOSTS = sorted(set(ALLOWED_HOSTS) | {  # noqa: F405
    "senzoft.com",
    "www.senzoft.com",
    ".vercel.app",
})
CORS_ALLOWED_ORIGINS = sorted(set(CORS_ALLOWED_ORIGINS) | {  # noqa: F405
    "https://senzoft.com",
    "https://www.senzoft.com",
})
CSRF_TRUSTED_ORIGINS = CORS_ALLOWED_ORIGINS
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

if SECRET_KEY == "unsafe-development-key-change-me":  # noqa: F405
    raise RuntimeError("DJANGO_SECRET_KEY is required in production")
