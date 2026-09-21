# Backend deployment

The repository now contains two deployable units: the existing Vite static frontend and the Django API. The current `vercel.json` and `netlify.toml` still describe only the frontend; a production Django host has not been selected by this phase.

Required backend variables:

- `DATABASE_URL` (pooled Neon connection)
- `DATABASE_URL_UNPOOLED` (deployment migrations only)
- `DJANGO_SECRET_KEY`
- `DJANGO_SETTINGS_MODULE=config.settings.production`
- `DJANGO_ALLOWED_HOSTS`
- `FRONTEND_URL`
- `CORS_ALLOWED_ORIGINS`

Reserved future variables are `EMAIL_PROVIDER`, `EMAIL_API_KEY`, and `AI_SERVICE_URL`.

Deployment sequence:

1. Install `backend/requirements.txt`.
2. Run checks and tests using the test settings.
3. Apply migrations with the direct Neon URL.
4. Collect static files if Django Admin is exposed.
5. Start `config.wsgi:application` or `config.asgi:application` using a production application server.
6. Set the frontend's non-secret `VITE_API_BASE_URL` to the deployed `/api/v1` origin.

Do not deploy with Django's development server or the fallback development secret.
