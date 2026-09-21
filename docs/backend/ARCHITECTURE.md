# SENZOFT backend architecture

The existing React/Vite application remains the web frontend. `backend/` is a Django 5.2 and Django REST Framework API using the existing Neon PostgreSQL project as its only application database.

## Boundaries

- `accounts`: custom UUID user, credentials and recruitment role.
- `careers`: candidate profiles and production jobs.
- `applications`: applications, immutable status history, interviews, structured interview responses, document metadata, BGV, offers and joining.
- `blog`: sanitized posts, categories and tags.
- `notifications`: delivery records and provider interface.
- `audit`: append-only security and business events.
- `core`: public identifiers, pagination, permissions and API errors.

The public React careers and insights pages still use their clearly labelled illustrative repositories. They are not copied into production. `src/services/api/` is the integration boundary for later frontend phases.

## Deferred integrations

Object storage, external email, BGV providers, offer generation, and AI execution are intentionally absent. `MockAIInterviewProvider` defines the future AI contract and always requires human review.
