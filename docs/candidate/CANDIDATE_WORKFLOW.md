# Candidate workflow

1. Browse published positions and open a real job record.
2. Register or sign in; the selected job is retained.
3. Complete the persisted profile fields. Profile completion is calculated by Django from actual values.
4. Review job, profile, skills, experience, education, and resume metadata.
5. Submit once. Django enforces the unique candidate/job constraint and returns the generated application ID.
6. Track the backend status history, interviews, documents, BGV, offers, joining, and in-app notifications.

Supported application statuses are `APPLIED`, `TALENT_REVIEW`, `SHORTLISTED`, `AI_INTERVIEW_INVITED`, `AI_INTERVIEW_IN_PROGRESS`, `AI_INTERVIEW_COMPLETED`, `TECHNICAL_INTERVIEW`, `HR_INTERVIEW`, `DOCUMENTS_REQUESTED`, `DOCUMENTS_SUBMITTED`, `BACKGROUND_VERIFICATION`, `BGV_COMPLETED`, `OFFER_ISSUED`, `OFFER_ACCEPTED`, `JOINING_PROCESS`, `JOINED`, `REJECTED`, `WITHDRAWN`, `ON_HOLD`, `CANCELLED`, `OFFER_DECLINED`, and `NO_SHOW`.

The timeline renders stored status-history rows; it does not infer events. Candidates may accept or decline an issued offer, but cannot change other application statuses.

AI interview execution, recordings, external BGV, email delivery, offer PDF generation, object storage, and joining automation remain outside this phase.
