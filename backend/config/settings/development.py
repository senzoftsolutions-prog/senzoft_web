from .base import *  # noqa: F403

DEBUG = True

# Browsers treat localhost and 127.0.0.1 as different origins. Allow both for
# local Vite development so authentication requests are not blocked by CORS.
LOCAL_FRONTEND_ORIGINS = {
    "http://localhost:5173",
    "http://127.0.0.1:5173",
}
CORS_ALLOWED_ORIGINS = sorted(set(CORS_ALLOWED_ORIGINS) | LOCAL_FRONTEND_ORIGINS)  # noqa: F405
CSRF_TRUSTED_ORIGINS = CORS_ALLOWED_ORIGINS
ALLOWED_HOSTS = sorted(set(ALLOWED_HOSTS) | {"localhost", "127.0.0.1"})  # noqa: F405
