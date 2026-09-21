# Testing

Run:

```powershell
Set-Location backend
$env:DJANGO_SETTINGS_MODULE = "config.settings.test"
.\.venv\Scripts\python.exe manage.py check
.\.venv\Scripts\python.exe manage.py makemigrations --check --dry-run
.\.venv\Scripts\python.exe manage.py test

Set-Location ..
npm run typecheck
npm run lint
npm test
npm run build
git diff --check
```

Backend coverage includes ownership, complete mock workflow, duplicate responses, expiration, integrity persistence, completion evaluation, and existing admin/candidate RBAC.
