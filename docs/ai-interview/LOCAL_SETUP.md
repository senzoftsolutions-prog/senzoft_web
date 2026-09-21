# Local setup

Backend:

```powershell
Set-Location D:\ofz\senzoft\senzoft_web\backend
$env:DJANGO_SETTINGS_MODULE = "config.settings.development"
$env:AI_PROVIDER = "mock"
.\.venv\Scripts\python.exe manage.py migrate
.\.venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000
```

Frontend:

```powershell
Set-Location D:\ofz\senzoft\senzoft_web
npm run dev
```

Camera/microphone APIs work on localhost or HTTPS. Create an `AI_SCREENING` interview in `CREATED`, `SCHEDULED`, or `READY` state through the admin API, assign it to an application, then open it from `/candidate/interviews`.
