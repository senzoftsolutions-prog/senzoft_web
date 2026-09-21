# Candidate portal architecture

The portal is a lazy-loaded React route tree under `/candidate/*`. It shares the existing API client and JWT refresh mechanism with the admin application while maintaining a separate candidate auth context, responsive layout, pages, and styles.

All production data flows through Django REST Framework. React never connects directly to Neon PostgreSQL. Candidate endpoints derive ownership from `request.user.candidate_profile`; the browser never supplies a candidate ID.

Public job pages call the published-jobs endpoints with server-side search, filters, ordering, and pagination. Private routes set `noindex, nofollow` and are excluded from the sitemap.

Resume and document file storage is not enabled. The UI exposes persisted metadata and status only and does not claim that a local file was uploaded.
