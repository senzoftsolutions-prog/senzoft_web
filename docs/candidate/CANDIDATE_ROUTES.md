# Candidate routes and APIs

## Browser routes

- Public: `/careers/openings`, `/careers/openings/:jobId`
- Authentication: `/candidate/login`, `/candidate/register`, `/candidate/forgot-password`, `/candidate/reset-password`
- Portal: `/candidate/dashboard`, `/candidate/profile`, `/candidate/apply/:jobId`
- Records: `/candidate/applications`, `/candidate/applications/:id`, `/candidate/interviews`, `/candidate/interviews/:id`, `/candidate/documents`, `/candidate/background-verification`, `/candidate/offers`, `/candidate/offers/:id`, `/candidate/joining`, `/candidate/notifications`

## API dependencies

- `GET /api/v1/jobs/`, `GET /api/v1/jobs/:jobId/`
- `POST /api/v1/auth/register/`, `POST /api/v1/auth/login/`, `POST /api/v1/auth/refresh/`, `GET /api/v1/auth/me/`
- `GET/PATCH /api/v1/candidates/me/`, `GET /api/v1/candidates/me/dashboard/`
- `POST /api/v1/applications/`, `GET /api/v1/candidates/me/applications/`, `GET /api/v1/applications/:id/`
- Candidate-owned interview, document, background-verification, offer, joining, and notification endpoints under `/api/v1/candidates/me/`

Every private queryset is restricted through the authenticated user. Cross-candidate detail requests return 404, candidate access to admin endpoints returns 403, and unauthenticated private requests return 401.
