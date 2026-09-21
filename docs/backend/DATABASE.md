# Database and migrations

Neon PostgreSQL is the only production database. Django ORM migrations under each backend app are the schema source of truth.

Internal primary keys are UUIDs. Major externally referenced rows also receive immutable, collision-resistant public identifiers such as `CAN-`, `JOB-`, `APP-`, `INT-`, `DOC-`, `BGV-`, `OFF-`, `JOIN-`, and `BLOG-` followed by 12 uppercase hexadecimal characters.

`DATABASE_URL` is the pooled runtime connection. Migrations must use the direct `DATABASE_URL_UNPOOLED` value. Never expose either through a `VITE_` variable.

The initial migrations were tested on the `phase-4-1-backend` Neon branch and then applied to `production`. No illustrative frontend data was seeded.

Run locally from the repository root:

```powershell
$env:DJANGO_SETTINGS_MODULE='config.settings.development'
backend\.venv\Scripts\python.exe backend\manage.py makemigrations --check
backend\.venv\Scripts\python.exe backend\manage.py migrate
```

For migration commands, set `DATABASE_URL` in the process to the value of `DATABASE_URL_UNPOOLED` without printing it.
