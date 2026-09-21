# Candidate authentication

Candidates register at `/candidate/register` and sign in at `/candidate/login` using the existing Django JWT endpoints. Registration creates the user and candidate profile transactionally.

Access and refresh tokens are stored in session storage. The shared API client refreshes an expired access token once; a failed refresh clears the session. Passwords are submitted only to Django and are never stored by React.

When a logged-out visitor chooses Apply, the target `/candidate/apply/:jobId` route is retained through authentication. Non-candidate accounts are rejected from the candidate portal. Automated password-reset delivery is not implemented, so the reset screen clearly directs users to support without claiming an email was sent.
