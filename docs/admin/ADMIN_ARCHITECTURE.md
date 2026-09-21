# Admin architecture

The administration application is a lazy-loaded React route tree under `/admin`. It uses the same Vite application as the public site, but has its own authenticated layout, navigation, components, and responsive stylesheet.

`AdminAuth` owns the JWT session. Access and refresh tokens are stored in `sessionStorage`, restored with `GET /api/v1/auth/me/`, refreshed once after a 401, and cleared when refresh fails. `AdminLayout` enforces an admin-panel role before rendering protected routes.

Frontend requests go through `src/services/api/client.ts`. Domain services are in `src/services/api/`; the generic admin service handles paginated resources and actions. List screens request server-side search, filters, ordering, and page data instead of filtering downloaded records.

The Django API is rooted at `/api/v1/admin/`. Viewsets enforce module permissions, record every important transition in the audit log, and use stable public IDs in URLs. PostgreSQL is provided by Neon through `DATABASE_URL`; Django migrations remain the schema source of truth.

## Local development

In PowerShell, start the backend from the repository root:

```powershell
Set-Location D:\ofz\senzoft\senzoft_web\backend
$env:DJANGO_SETTINGS_MODULE = "config.settings.development"
.\.venv\Scripts\python.exe manage.py migrate
.\.venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000
```

In a second PowerShell terminal:

```powershell
Set-Location D:\ofz\senzoft\senzoft_web
npm run dev
```

Open `http://localhost:5173/admin/login`. Create the first local administrator with `python manage.py createsuperuser` if the database has no admin account.
