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

## Integration boundaries

The application uses configured object storage and email providers. External BGV providers and offer generation remain integration boundaries. `NativeInterviewProvider` supplies the no-API interview agent, while the optional Ollama adapter keeps generative execution on the backend host. Every interview result requires human review.
