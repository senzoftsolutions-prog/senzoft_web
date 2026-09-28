# Senzoft-owned AI interview agent

The candidate portal includes a first-round interview agent implemented inside the Senzoft application. It does not require Retell or another hosted voice-agent API.

## How it works

- A candidate must upload a verified résumé before submitting an application.
- The application remains at `APPLIED` until a Super Admin schedules an AI pre-screening or another interview stage.
- Django creates bounded, role-specific interview questions from the job, candidate profile, and submitted résumé metadata.
- The browser reads each question aloud with its installed speech-synthesis voice.
- The candidate can answer using browser speech recognition or type an answer.
- Only the answer transcript is submitted. The application does not store an audio or video recording.
- The AI interview requests microphone permission only. Camera, fullscreen, and screen-monitoring permissions are not requested.
- Django evaluates each answer, may add one job-relevant follow-up, and creates a structured summary.
- Every result is advisory and explicitly requires human recruiter review.

The default `AI_PROVIDER=native` mode uses Senzoft-owned deterministic logic and requires no model download, API account, or API key.

## Optional private local model with Ollama

For richer locally generated questions and evaluation, install Ollama on the backend machine and download a model:

```powershell
ollama pull qwen2.5:7b
ollama serve
```

Then update `.env`:

```dotenv
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://127.0.0.1:11434/v1
OLLAMA_MODEL=qwen2.5:7b
```

Restart Django after changing the provider. The application calls only the local Ollama process. If Ollama is unavailable or returns an invalid response, the interview automatically falls back to the native deterministic agent.

Choose a model that the production server can run comfortably and review its license before deployment. Do not expose the Ollama port publicly; bind it to the backend host or a private network.

## Browser support

Speech synthesis works in current desktop and mobile browsers. Speech recognition support varies by browser, so the typed-answer path always remains available. Browser implementations may use operating-system or browser-vendor speech services; use a self-hosted speech-to-text engine if strict offline audio processing is required.

## Scheduling and candidate notifications

From an application detail page, a Super Admin can schedule either an `AI_SCREENING` or `TECHNICAL` interview. Scheduling creates the interview record, updates the application stage, adds the event to the candidate portal, and sends the candidate an email with the scheduled time and instructions.

Application submission sends a branded confirmation email. Validated application status transitions also create a portal notification and send a status email to the candidate.

An AI interview cannot start before its scheduled time. By default, its completion window expires seven days after the scheduled time.

## Résumé storage

Production deployments use the private `candidate-documents` bucket declared in `neon.ts`. Configure `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_ENDPOINT_URL_S3`, and `AWS_REGION` for the linked Neon branch.

When those variables are unavailable in local development, Django stores résumé files under `backend/private_uploads/`, outside the public media directory. Candidate and admin downloads use audited, five-minute signed links. Submitted résumé versions are retained for their applications if the candidate later uploads a replacement.
