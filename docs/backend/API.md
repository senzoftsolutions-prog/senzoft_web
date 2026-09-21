# SENZOFT backend API

Base path: `/api/v1/`. JSON errors use `{ "success": false, "error": { "code", "message", "details" } }`.

## Authentication

- `POST auth/register/`
- `POST auth/login/`
- `POST auth/refresh/`
- `GET auth/me/`

## Public

- `GET jobs/` and `GET jobs/{JOB-ID}/`
- `GET blogs/` and `GET blogs/{slug}/`

Only published records are returned. Jobs support pagination, search, ordering and filters for location, department, employment type, work mode and experience level.

## Candidate-owned

- `GET/PATCH candidates/me/`
- `POST applications/`
- `GET applications/{APP-ID}/`
- `GET candidates/me/applications/`
- `GET candidates/me/interviews/`
- `GET candidates/me/documents/`
- `GET candidates/me/notifications/`

Every queryset is restricted to the authenticated candidate.

## Recruitment administration

Resources under `admin/` cover jobs, candidates, applications, interviews, documents, BGV, offers, joining, blogs, users, notifications and audit logs. Recruitment resources require an appropriate staff role; users and audit require `ADMIN` or `SUPER_ADMIN`.

State-changing actions include:

- `POST admin/jobs/{JOB-ID}/publish/`
- `POST admin/jobs/{JOB-ID}/close/`
- `POST admin/applications/{APP-ID}/transition/`
- `POST admin/blogs/{BLOG-ID}/publish/`
- `POST admin/blogs/{BLOG-ID}/archive/`
# Admin API additions

All routes below require a JWT and an authorized admin-panel role. Collection endpoints support page-number pagination plus the documented `search`, `status`, `ordering`, and resource-specific filters.

- `GET /api/v1/admin/dashboard/` — aggregate counts, status distribution, recent records, upcoming interviews.
- `/api/v1/admin/jobs/` — CRUD; actions: `publish`, `pause`, `close`, `archive`.
- `/api/v1/admin/applications/` — list/detail/update; `transition` records status history and audit data.
- `/api/v1/admin/candidates/`, `interviews/`, `documents/`, `background-verifications/`, `offers/`, `joining/` — role-scoped operational resources.
- `/api/v1/admin/blogs/` — CRUD; actions: `publish`, `schedule`, `archive`.
- `/api/v1/admin/users/` — list/detail; actions: `set_role`, `set_status` (administrator only).
- `GET /api/v1/admin/audit-logs/` — read-only audit trail (administrator only).

Authentication uses `POST /api/v1/auth/token/` with an email or username and password, `POST /api/v1/auth/token/refresh/`, and `GET /api/v1/auth/me/`.
