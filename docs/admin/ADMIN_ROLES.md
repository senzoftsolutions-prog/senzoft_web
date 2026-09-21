# Admin roles

The backend is the authority for access control; hiding navigation links is only a usability aid.

| Role | Access |
| --- | --- |
| `ADMIN` | All admin modules, user roles/status, and audit log |
| `HR` | Careers operations, including applications, interviews, documents, BGV, offers, and joining |
| `RECRUITER` | Jobs, candidates, applications, interviews, documents, offers, and joining |
| `HIRING_MANAGER` | Assigned hiring workflow records and interviews |
| `CANDIDATE` | Public/candidate APIs only; cannot enter `/admin` |

Role and user-status changes are restricted to `ADMIN` and are audit logged. Inactive or locked users cannot authenticate. Destructive and state-changing actions require an explicit confirmation in the UI.

Blog administration is restricted to `ADMIN` and `SUPER_ADMIN` because the current user model does not define a separate content-editor role.
