# Vercel deployment

This repository deploys as one Vercel project:

- Vite builds the React frontend into `dist`.
- `api/index.py` exposes the Django WSGI application as a Python Function.
- `api/contact.js` exposes the public contact-email function.
- `vercel.json` sends `/api/v1/*`, `/health/`, and `/django-admin/*` to Django and uses the Vite SPA fallback for browser routes.

The browser uses the same-origin `/api/v1` endpoint by default in production. Set `VITE_API_BASE_URL=/api/v1` explicitly in Vercel if desired; do not point preview deployments at localhost or at the production API.

## 1. Vercel project settings

Import the GitHub repository into Vercel and use:

- Framework preset: `Vite`
- Root directory: repository root
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`
- Production branch: the branch selected for releases (currently `master` locally)

The checked-in `vercel.json`, root `requirements.txt`, and `api/index.py` provide the remaining build and Python-function configuration.

The Django function has an `excludeFiles` rule that keeps frontend source,
compiled static assets, videos, documentation, and tests out of the Python
bundle. These files remain available to the Vite deployment; the exclusion
only applies to `api/index.py`. Keep this rule when adding large public media,
otherwise the Python function can exceed Vercel's bundle-size limit.

## 2. Production environment variables

Add these variables to the appropriate Vercel Production and Preview environments. Secrets must never use a `VITE_` prefix.

### Site and Django

```dotenv
VITE_SITE_URL=https://www.senzoft.com
VITE_API_BASE_URL=/api/v1
DATABASE_URL=<pooled Neon connection string; hostname normally contains -pooler>
DATABASE_URL_UNPOOLED=<direct Neon connection string for migrations only>
DJANGO_SECRET_KEY=<at least 50 random characters>
DJANGO_DEBUG=false
FRONTEND_URL=https://www.senzoft.com
CORS_ALLOWED_ORIGINS=https://www.senzoft.com,https://senzoft.com
```

`config.settings.production` already permits `senzoft.com`, `www.senzoft.com`, and `*.vercel.app`. The Vercel entrypoint selects production settings itself, so a dashboard `DJANGO_SETTINGS_MODULE` variable is optional.

Generate a production Django secret locally and copy only its output to the Vercel secret field:

```powershell
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### Resume object storage

Resume uploads cannot use a Vercel Function's temporary filesystem. Deploy the private `candidate-documents` bucket declared in `neon.ts`, then add its S3-compatible credentials:

```dotenv
AWS_ACCESS_KEY_ID=<storage access key>
AWS_SECRET_ACCESS_KEY=<storage secret key>
AWS_ENDPOINT_URL_S3=<storage S3 endpoint>
AWS_REGION=<storage region>
CANDIDATE_DOCUMENTS_BUCKET=candidate-documents
```

All four `AWS_*` values are required. `/health/` reports a degraded status until storage is configured.

### ZeptoMail

```dotenv
EMAIL_PROVIDER=zeptomail
EMAIL_HOST=smtp.zeptomail.in
EMAIL_PORT=587
EMAIL_HOST_USER=emailapikey
EMAIL_HOST_PASSWORD=<ZeptoMail SMTP password>
EMAIL_USE_TLS=true
EMAIL_USE_SSL=false
DEFAULT_FROM_EMAIL=Senzoft Software Solutions <careers@senzoft.com>
EMAIL_LOGO_URL=https://www.senzoft.com/media/senzoftweblogo-transparent.png
ZEPTOMAIL_API_URL=https://cpaas.zoho.in/v1.1/email
ZEPTOMAIL_API_KEY=<ZeptoMail send API key>
CONTACT_RECIPIENT_EMAIL=careers@senzoft.com
CONTACT_FROM_EMAIL=Senzoft Software Solutions <careers@senzoft.com>
RECRUITMENT_EMAIL=careers@senzoft.com
```

The sender address and domain must be verified in the same ZeptoMail agent as these credentials.

### AI interview

The built-in interview provider needs no external model or Ollama process:

```dotenv
AI_PROVIDER=native
AUTO_CREATE_AI_SCREENING=false
AI_INTERVIEW_EXPIRY_DAYS=7
```

Do not configure `AI_PROVIDER=ollama` on Vercel because the local Ollama URL is not available inside a Vercel Function. If a hosted OpenAI-compatible gateway is enabled later, set `AI_PROVIDER=neon`, `AI_SERVICE_URL`, `AI_SERVICE_TOKEN`, and `AI_MODEL`.

## 3. Apply database migrations

Run migrations once with the direct, unpooled connection before sending production traffic. Do not put migrations in the Vercel build command because parallel or preview builds can race.

```powershell
$env:DATABASE_URL = $env:DATABASE_URL_UNPOOLED
python backend/manage.py migrate --settings=config.settings.production
```

Normal Vercel application traffic must continue to use the pooled `DATABASE_URL`.

## 4. Deploy and verify

After pushing the release commit, deploy it from Vercel and check:

1. `/` returns the website.
2. A deep link such as `/candidate/login` loads after a direct refresh.
3. `/health/` returns `status: ok` and `object_storage.configured: true`.
4. Candidate registration sends a verification email from `careers@senzoft.com`.
5. A candidate can upload and download a resume.
6. An application appears in the admin portal.
7. Scheduling and completing an AI interview works with microphone-only permission.
8. Changing an application status sends the candidate notification email.
9. The public contact form sends successfully.

Use the Vercel Function logs for Python import errors, missing environment variables, email-provider responses, or request timeouts. Never paste database, storage, Django, or ZeptoMail secrets into browser-visible variables or commit them to Git.
