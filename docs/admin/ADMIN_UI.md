# Admin UI

The admin interface uses a desktop sidebar, compact tablet navigation, and a mobile drawer. Data tables become labelled record cards on small screens. All major screens include loading, empty, failure, and retry states.

Reusable primitives live in `src/admin/AdminUI.tsx`: status badges, request states, confirmation dialogs, date formatting, and labels. Admin-specific styles are in `src/styles/admin.css` and do not replace public-site styles.

Forms provide native labels and validation, preserve clear keyboard focus, warn before a browser unload, and surface API validation errors. Risky actions such as closing jobs, archiving posts, changing application status, and disabling users are confirmed before submission.

Admin pages set `noindex, nofollow` metadata. Tokens are held in session storage rather than long-lived local storage; production deployments should use HTTPS and a strict Content Security Policy.
