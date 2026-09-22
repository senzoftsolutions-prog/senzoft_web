"""Vercel WSGI entry point for the SENZOFT Django API."""

import os
import sys
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1] / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

# A deployed WSGI entry point must never inherit local/development settings
# from a stale platform environment variable.
os.environ["DJANGO_SETTINGS_MODULE"] = "config.settings.production"

from config.wsgi import application  # noqa: E402


# Vercel's Python runtime discovers the conventional `app` export.
app = application
