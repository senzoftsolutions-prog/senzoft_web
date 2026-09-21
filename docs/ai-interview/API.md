# AI interview API

Candidate-owned endpoints:

- `GET /api/v1/candidates/me/interviews/:id/session/`
- `POST /api/v1/candidates/me/interviews/:id/start/`
- `POST /api/v1/candidates/me/interviews/:id/responses/`
- `POST /api/v1/candidates/me/interviews/:id/integrity-events/`
- `POST /api/v1/candidates/me/interviews/:id/complete/`

Admin/recruiter endpoints use `/api/v1/admin/interviews/` and include questions, immutable response transcripts, evaluations, integrity signals, and the final result. Search, filters, ordering, pagination, and existing role scoping remain active.

Transcript input is capped at 12,000 characters. A question can be answered once. Candidate identity comes exclusively from the JWT.
