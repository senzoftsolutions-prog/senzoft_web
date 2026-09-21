# AI interview architecture

The existing `applications.Interview` is the aggregate root. Candidate React pages call owned Django REST endpoints; Django invokes replaceable AI and speech interfaces and persists structured records in Neon PostgreSQL. React never receives provider credentials.

`AIInterviewProvider` defines question generation, answer evaluation, adaptive follow-up, and final summarization. `SpeechProvider` defines transcription. The current production-safe development implementation is deterministic `mock`; it requires no paid API and always marks results for human review.

The browser opens a temporary `MediaStream` for preview and uses browser speech recognition where available. Audio and video are never posted to Django or permanently stored.
