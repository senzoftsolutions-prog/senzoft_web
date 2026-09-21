# Authentication and authorization

The API uses Django's custom `accounts.User` model and short-lived JWT access tokens with rotating refresh tokens. Passwords are processed by Django password hashers and never logged.

Roles are `CANDIDATE`, `RECRUITER`, `HIRING_MANAGER`, `INTERVIEWER`, `HR`, `ADMIN`, and `SUPER_ADMIN`. Superusers are normalized to `SUPER_ADMIN`.

Registration always creates a candidate user and one candidate profile in the same transaction. Candidate endpoints enforce ownership in their database querysets. Administrative endpoints apply server-side role permissions; hiding frontend navigation is never treated as authorization.

Application status is read-only in generic serializers. Staff must use the transition action, which validates the state machine and creates both status history and an audit event.

Production enables HTTPS redirect, secure cookies, HSTS, frame denial and content-type sniffing protection. Configure trusted hosts and origins explicitly.
