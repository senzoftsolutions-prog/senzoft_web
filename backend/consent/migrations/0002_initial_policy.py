from django.db import migrations
from django.utils import timezone


def seed_consent(apps, schema_editor):
    Category = apps.get_model("consent", "CookieCategory")
    Definition = apps.get_model("consent", "CookieDefinition")
    Policy = apps.get_model("consent", "ConsentPolicy")
    categories = {}
    values = [
        ("necessary", "Necessary", "Required for security, authentication, consent storage, and core website operation.", True, 1),
        ("functional", "Functional", "Optional preferences that improve convenience without tracking you.", False, 2),
        ("analytics", "Analytics", "Optional measurement of website usage and performance.", False, 3),
        ("marketing", "Marketing", "Optional advertising and campaign measurement services.", False, 4),
    ]
    for key, name, description, required, order in values:
        categories[key], _ = Category.objects.update_or_create(key=key, defaults={"name": name, "description": description, "required": required, "display_order": order})
    definitions = [
        ("senzoft-cookie-consent", "LOCAL_STORAGE", "Stores the visitor's category choices and consent-policy version.", "Until the policy changes or browser storage is cleared"),
        ("senzoft-admin-access", "SESSION_STORAGE", "Temporarily authenticates an administrator during the current browser tab session.", "Browser tab session"),
        ("senzoft-admin-refresh", "SESSION_STORAGE", "Renews an authenticated administrator session without storing a password.", "Browser tab session"),
    ]
    for name, storage_type, purpose, duration in definitions:
        Definition.objects.update_or_create(name=name, provider="SENZOFT", storage_type=storage_type, defaults={"category": categories["necessary"], "purpose": purpose, "duration": duration, "description": purpose, "status": "ACTIVE"})
    Policy.objects.update_or_create(version="1.0", defaults={"title": "SENZOFT Cookie and Browser Storage Policy", "configuration": {"optional_services": []}, "is_published": True, "effective_at": timezone.now()})


class Migration(migrations.Migration):
    dependencies = [("consent", "0001_initial")]
    operations = [migrations.RunPython(seed_consent, migrations.RunPython.noop)]

