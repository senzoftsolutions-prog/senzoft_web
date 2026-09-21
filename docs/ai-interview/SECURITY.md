# AI interview security

- Candidate querysets are always restricted through the authenticated user's candidate profile.
- Admin interview access reuses recruiter/hiring-manager/interviewer/HR/admin role scopes.
- State transitions and scoring occur only in Django.
- Start/response/event endpoints are throttled.
- Sessions enforce expiry, bounded questions, transcript limits, and duplicate-response protection.
- Provider credentials belong only in backend environment variables.
- Raw responses are not candidate-editable after submission.
- Important transitions are audit logged.
- No audio, video, camera images, or screen recordings are persisted.
