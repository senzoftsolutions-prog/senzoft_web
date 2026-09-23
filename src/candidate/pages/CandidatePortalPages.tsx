import { FormEvent, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  Download,
  FileText,
  Pencil,
  Plus,
  Trash2,
  Upload,
  UserRound,
  X,
} from "lucide-react";
import {
  completeResumeUpload,
  completeBgvDocumentUpload,
  deleteBgvDocument,
  deleteResume,
  getCandidateApplication,
  getCandidateDashboard,
  getOffer,
  getProfile,
  getResumeDownload,
  getBgvDocumentDownload,
  listApplications,
  listInterviews,
  listJoining,
  listNotifications,
  listDocuments,
  listOffers,
  markNotificationRead,
  requestResumeUpload,
  requestBgvDocumentUpload,
  updateProfile,
  uploadResumeObject,
  uploadBgvDocumentObject,
  type CandidateApplication,
  type CandidateDashboard,
  type CandidateNotification,
  type CandidateProfile,
  type BgvDocumentType,
  type CandidateDocument,
} from "../../services/api/candidate";
import {
  CandidateState,
  CandidateStatus,
  formatDate,
  label,
} from "../CandidateUI";
import CandidateInterviewRoomPage from "./CandidateInterviewRoomPage";

function useLoad<T>(loader: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setData(await loader());
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Request failed.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void load();
  }, []);
  return { data, loading, error, load, setData };
}
const heading = (kicker: string, title: string, copy: string) => (
  <header className="candidate-page-header">
    <p className="candidate-kicker">{kicker}</p>
    <h1>{title}</h1>
    <p>{copy}</p>
  </header>
);
const terminal = new Set([
  "JOINED",
  "REJECTED",
  "WITHDRAWN",
  "CANCELLED",
  "OFFER_DECLINED",
  "NO_SHOW",
]);

function ProfileHero({
  profile,
  completion,
}: {
  profile: CandidateProfile;
  completion?: number;
}) {
  const initials = profile.name
    .split(/\s+/)
    .slice(0, 2)
    .map((x) => x[0])
    .join("")
    .toUpperCase();
  return (
    <section className="candidate-profile-hero">
      <div className="candidate-avatar" aria-hidden="true">
        {initials || <UserRound />}
      </div>
      <div>
        <p className="candidate-kicker">Candidate profile</p>
        <h1>{profile.name}</h1>
        <p>
          {profile.email}
          {profile.phone && <> · {profile.phone}</>}
        </p>
      </div>
      {completion !== undefined && (
        <div className="candidate-completion">
          <strong>{completion}%</strong>
          <span>Profile complete</span>
        </div>
      )}
    </section>
  );
}

export function CandidateDashboardPage() {
  const dashboard = useLoad<CandidateDashboard>(getCandidateDashboard);
  const profile = useLoad<CandidateProfile>(getProfile);
  return (
    <section className="candidate-overview">
      <CandidateState
        loading={dashboard.loading || profile.loading}
        error={dashboard.error || profile.error}
        empty={!dashboard.data || !profile.data}
        onRetry={() => {
          void dashboard.load();
          void profile.load();
        }}
      >
        {dashboard.data && profile.data && (
          <>
            <ProfileHero
              profile={profile.data}
              completion={dashboard.data.profile_completion}
            />
            <div className="candidate-overview-grid">
              <article>
                <BriefcaseBusiness />
                <strong>{dashboard.data.active_applications}</strong>
                <span>Active applications</span>
              </article>
              <article>
                <CalendarDays />
                <strong>{dashboard.data.upcoming_interviews}</strong>
                <span>Upcoming interviews</span>
              </article>
              <article>
                <Bell />
                <strong>{dashboard.data.unread_notifications}</strong>
                <span>Unread updates</span>
              </article>
            </div>
            <div className="candidate-dashboard-columns">
              <section className="candidate-card">
                <div className="candidate-section-title">
                  <div>
                    <p className="candidate-kicker">Latest application</p>
                    <h2>
                      {dashboard.data.latest_application?.job_title ||
                        "No applications yet"}
                    </h2>
                  </div>
                  {dashboard.data.latest_application && (
                    <CandidateStatus
                      value={dashboard.data.latest_application.current_status}
                    />
                  )}
                </div>
                {dashboard.data.latest_application ? (
                  <>
                    <p>
                      Updated{" "}
                      {formatDate(dashboard.data.latest_application.updated_at)}
                    </p>
                    <Link
                      className="candidate-text-link"
                      to={`/candidate/applications/${dashboard.data.latest_application.id}`}
                    >
                      View application <ArrowRight />
                    </Link>
                  </>
                ) : (
                  <>
                    <p>
                      Explore open positions and apply when you find the right
                      fit.
                    </p>
                    <Link
                      className="candidate-btn primary"
                      to="/careers/openings"
                    >
                      Browse open positions
                    </Link>
                  </>
                )}
              </section>
              <section className="candidate-card">
                <p className="candidate-kicker">Next event</p>
                {dashboard.data.next_interview ? (
                  <>
                    <h2>
                      {label(dashboard.data.next_interview.interview_type)}{" "}
                      interview
                    </h2>
                    <p>{dashboard.data.next_interview.job_title}</p>
                    <strong>
                      {formatDate(dashboard.data.next_interview.scheduled_at)}
                    </strong>
                    <Link
                      className="candidate-text-link"
                      to={`/candidate/interviews/${dashboard.data.next_interview.id}`}
                    >
                      View interview <ArrowRight />
                    </Link>
                  </>
                ) : (
                  <>
                    <h2>No interview scheduled</h2>
                    <p>
                      Confirmed interview updates will appear here and be sent
                      by email.
                    </p>
                  </>
                )}
              </section>
            </div>
            <section className="candidate-card candidate-recent">
              <div className="candidate-section-title">
                <h2>Recent updates</h2>
                <Link to="/candidate/applications">All applications</Link>
              </div>
              {dashboard.data.recent_updates.length ? (
                dashboard.data.recent_updates.map((item) => (
                  <div className="candidate-update-row" key={item.public_id}>
                    <div>
                      <strong>{item.job__title}</strong>
                      <span>Updated {formatDate(item.updated_at)}</span>
                    </div>
                    <CandidateStatus value={item.current_status} />
                  </div>
                ))
              ) : (
                <p>No recruitment updates yet.</p>
              )}
            </section>
          </>
        )}
      </CandidateState>
    </section>
  );
}

export function CandidateApplicationsPage() {
  const state = useLoad(listApplications);
  const active =
    state.data?.results.filter((x) => !terminal.has(x.current_status)) || [];
  const inactive =
    state.data?.results.filter((x) => terminal.has(x.current_status)) || [];
  const group = (title: string, items: CandidateApplication[]) => (
    <section className="candidate-application-group">
      <h2>{title}</h2>
      {items.length ? (
        items.map((app) => (
          <Link
            className="candidate-application-row"
            key={app.id}
            to={`/candidate/applications/${app.id}`}
          >
            <div>
              <span>{app.id}</span>
              <h3>{app.job_title}</h3>
              <p>
                {app.job_department} · Applied {formatDate(app.applied_at)}
              </p>
              {app.latest_interview && (
                <small>
                  Interview: {label(app.latest_interview.interview_type)} ·{" "}
                  {label(app.latest_interview.status)}
                  {app.latest_interview.scheduled_at
                    ? ` · ${formatDate(app.latest_interview.scheduled_at)}`
                    : ""}
                </small>
              )}
            </div>
            <div>
              <CandidateStatus value={app.current_status} />
              <small>Updated {formatDate(app.updated_at)}</small>
            </div>
          </Link>
        ))
      ) : (
        <p className="candidate-empty-inline">None</p>
      )}
    </section>
  );
  return (
    <section>
      {heading(
        "Applications",
        "My applications",
        "Track every confirmed recruitment and interview stage in one place.",
      )}
      <CandidateState
        {...state}
        empty={!state.data?.results.length}
        emptyAction={
          <Link className="candidate-btn primary" to="/careers/openings">
            View open positions
          </Link>
        }
        onRetry={state.load}
      >
        {state.data && (
          <>
            {group("Active applications", active)}
            {group("Previous applications", inactive)}
          </>
        )}
      </CandidateState>
    </section>
  );
}

export function CandidateEventsPage() {
  const state = useLoad(async () => {
    const [interviews, offers, joining] = await Promise.all([
      listInterviews(),
      listOffers(),
      listJoining(),
    ]);
    return {
      interviews: interviews.results,
      offers: offers.results,
      joining: joining.results,
    };
  });
  return (
    <section>
      {heading(
        "Schedule",
        "Events",
        "Interview, offer, and joining updates are also sent to your registered email.",
      )}
      <CandidateState {...state} empty={!state.data} onRetry={state.load}>
        {state.data && (
          <div className="candidate-event-sections">
            <section>
              <h2>Interviews</h2>
              {state.data.interviews.length ? (
                state.data.interviews.map((item) => (
                  <Link
                    className="candidate-event-row"
                    to={`/candidate/interviews/${item.id}`}
                    key={item.id}
                  >
                    <CalendarDays />
                    <div>
                      <strong>{label(item.interview_type)} interview</strong>
                      <span>
                        {item.job_title} · {formatDate(item.scheduled_at)}
                      </span>
                    </div>
                    <CandidateStatus value={item.status} />
                  </Link>
                ))
              ) : (
                <p>No interviews scheduled.</p>
              )}
            </section>
            <section>
              <h2>Offers</h2>
              {state.data.offers.length ? (
                state.data.offers.map((item) => (
                  <article className="candidate-event-row" key={item.id}>
                    <FileText />
                    <div>
                      <strong>{item.job_title}</strong>
                      <span>
                        Offer letters are delivered to your registered email.
                      </span>
                    </div>
                    <CandidateStatus value={item.status} />
                  </article>
                ))
              ) : (
                <p>No offer updates.</p>
              )}
            </section>
            <section>
              <h2>Joining</h2>
              {state.data.joining.length ? (
                state.data.joining.map((item) => (
                  <article className="candidate-event-row" key={item.id}>
                    <BriefcaseBusiness />
                    <div>
                      <strong>{item.job_title}</strong>
                      <span>
                        {item.location} · {formatDate(item.joining_date)}
                      </span>
                    </div>
                    <CandidateStatus value={item.status} />
                  </article>
                ))
              ) : (
                <p>No joining events.</p>
              )}
            </section>
          </div>
        )}
      </CandidateState>
    </section>
  );
}

export function CandidateProfilePage() {
  const state = useLoad<CandidateProfile>(getProfile);
  const dashboard = useLoad<CandidateDashboard>(getCandidateDashboard);
  const [editing, setEditing] = useState(false);
  return (
    <section>
      <CandidateState
        loading={state.loading || dashboard.loading}
        error={state.error || dashboard.error}
        empty={!state.data || !dashboard.data}
        onRetry={() => {
          void state.load();
          void dashboard.load();
        }}
      >
        {state.data && dashboard.data && (
          <>
            <ProfileHero
              profile={state.data}
              completion={dashboard.data.profile_completion}
            />
            <div className="candidate-profile-actions">
              <button
                className="candidate-btn primary"
                onClick={() => setEditing(true)}
              >
                <Pencil />
                Edit profile
              </button>
              <Link className="candidate-btn secondary" to="/careers/openings">
                Browse open positions
              </Link>
            </div>
            <ProfileSummary profile={state.data} />
            <ResumePanel profile={state.data} onChanged={state.load} />
            {dashboard.data.documents_enabled && <BgvPanel dashboard={dashboard.data} />}
            {editing && (
              <ProfileEditor
                profile={state.data}
                onClose={() => setEditing(false)}
                onSaved={(profile) => {
                  state.setData(profile);
                  setEditing(false);
                  void dashboard.load();
                }}
              />
            )}
          </>
        )}
      </CandidateState>
    </section>
  );
}

function ProfileSummary({ profile }: { profile: CandidateProfile }) {
  return (
    <div className="candidate-profile-sections">
      <section className="candidate-card">
        <h2>Professional profile</h2>
        <dl className="candidate-profile-dl">
          <div>
            <dt>Current role</dt>
            <dd>{profile.current_role || "Not provided"}</dd>
          </div>
          <div>
            <dt>Experience</dt>
            <dd>
              {profile.years_of_experience === null
                ? "Not provided"
                : `${profile.years_of_experience} years`}
            </dd>
          </div>
          <div className="wide">
            <dt>Summary</dt>
            <dd>{profile.professional_summary || "Not provided"}</dd>
          </div>
        </dl>
        <div className="candidate-chips">
          {profile.skills.length ? (
            profile.skills.map((skill) => <span key={skill}>{skill}</span>)
          ) : (
            <p>No skills added.</p>
          )}
        </div>
      </section>
      <section className="candidate-card">
        <h2>Work experience</h2>
        {profile.experience.length ? (
          profile.experience.map((row, index) => (
            <HistoryRow
              key={String(row.id || index)}
              row={row}
              title={String(row.role || "Role")}
              subtitle={String(row.company || "")}
            />
          ))
        ) : (
          <p>No experience added.</p>
        )}
      </section>
      <section className="candidate-card">
        <h2>Education</h2>
        {profile.education.length ? (
          profile.education.map((row, index) => (
            <HistoryRow
              key={String(row.id || index)}
              row={row}
              title={String(row.degree || "Education")}
              subtitle={String(row.institution || "")}
            />
          ))
        ) : (
          <p>No education added.</p>
        )}
      </section>
    </div>
  );
}
function HistoryRow({
  row,
  title,
  subtitle,
}: {
  row: Record<string, string>;
  title: string;
  subtitle: string;
}) {
  return (
    <article className="candidate-history-row">
      <strong>{title}</strong>
      <span>{subtitle}</span>
      <small>
        {[row.start_date, row.end_date || row.year, row.location]
          .filter(Boolean)
          .join(" · ")}
      </small>
      {row.description && <p>{row.description}</p>}
    </article>
  );
}

function ProfileEditor({
  profile,
  onClose,
  onSaved,
}: {
  profile: CandidateProfile;
  onClose: () => void;
  onSaved: (profile: CandidateProfile) => void;
}) {
  const dialog = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState(profile);
  const [skill, setSkill] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    dialog.current?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !dialog.current) return;
      const focusable = Array.from(
        dialog.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (!focusable.length) {
        event.preventDefault();
        dialog.current.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("keydown", key);
      previouslyFocused?.focus();
    };
  }, [onClose]);
  const set = (key: keyof CandidateProfile, value: unknown) =>
    setDraft((current) => ({ ...current, [key]: value }));
  const updateRow = (
    kind: "experience" | "education",
    index: number,
    key: string,
    value: string,
  ) =>
    set(
      kind,
      draft[kind].map((row, i) =>
        i === index ? { ...row, [key]: value } : row,
      ),
    );
  const addRow = (kind: "experience" | "education") =>
    set(kind, [
      ...draft[kind],
      kind === "experience"
        ? {
            company: "",
            role: "",
            start_date: "",
            end_date: "",
            location: "",
            description: "",
          }
        : { degree: "", institution: "", year: "", major: "", country: "" },
    ]);
  const removeRow = (kind: "experience" | "education", index: number) =>
    set(
      kind,
      draft[kind].filter((_, i) => i !== index),
    );
  const save = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      onSaved(
        await updateProfile({
          name: draft.name,
          phone: draft.phone,
          location: draft.location,
          current_role: draft.current_role,
          years_of_experience: draft.years_of_experience,
          professional_summary: draft.professional_summary,
          skills: draft.skills,
          experience: draft.experience,
          education: draft.education,
          linkedin_url: draft.linkedin_url,
          portfolio_url: draft.portfolio_url,
        }),
      );
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Unable to save profile.",
      );
    } finally {
      setSaving(false);
    }
  };
  return (
    <div
      className="candidate-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="candidate-profile-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-editor-title"
        tabIndex={-1}
        ref={dialog}
      >
        <header>
          <div>
            <p className="candidate-kicker">Candidate profile</p>
            <h2 id="profile-editor-title">Edit personal information</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close">
            <X />
          </button>
        </header>
        <form onSubmit={save}>
          {error && (
            <p className="candidate-form-error" role="alert">
              {error}
            </p>
          )}
          <ProfileFields draft={draft} set={set} />
          <EditorSection title="Skills">
            <div className="candidate-skill-editor">
              <div className="candidate-chips">
                {draft.skills.map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() =>
                      set(
                        "skills",
                        draft.skills.filter((x) => x !== item),
                      )
                    }
                  >
                    {item}
                    <X />
                  </button>
                ))}
              </div>
              <div className="candidate-inline-add">
                <input
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  placeholder="Add a skill"
                />
                <button
                  type="button"
                  className="candidate-btn secondary"
                  onClick={() => {
                    const value = skill.trim();
                    if (
                      value &&
                      !draft.skills.some(
                        (x) => x.toLowerCase() === value.toLowerCase(),
                      )
                    )
                      set("skills", [...draft.skills, value]);
                    setSkill("");
                  }}
                >
                  <Plus />
                  Add
                </button>
              </div>
            </div>
          </EditorSection>
          <EditorSection
            title="Work experience"
            action={() => addRow("experience")}
          >
            {draft.experience.map((row, index) => (
              <HistoryEditor
                key={index}
                kind="experience"
                row={row}
                onChange={(key, value) =>
                  updateRow("experience", index, key, value)
                }
                onRemove={() => removeRow("experience", index)}
              />
            ))}
          </EditorSection>
          <EditorSection title="Education" action={() => addRow("education")}>
            {draft.education.map((row, index) => (
              <HistoryEditor
                key={index}
                kind="education"
                row={row}
                onChange={(key, value) =>
                  updateRow("education", index, key, value)
                }
                onRemove={() => removeRow("education", index)}
              />
            ))}
          </EditorSection>
          <footer>
            <button
              type="button"
              className="candidate-btn secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button className="candidate-btn primary" disabled={saving}>
              {saving ? "Saving…" : "Save profile"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
function EditorSection({
  title,
  action,
  children,
}: {
  title: string;
  action?: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="candidate-editor-section">
      <div className="candidate-section-title">
        <h3>{title}</h3>
        {action && (
          <button type="button" onClick={action}>
            <Plus />
            Add
          </button>
        )}
      </div>
      {children}
    </section>
  );
}
function ProfileFields({
  draft,
  set,
}: {
  draft: CandidateProfile;
  set: (key: keyof CandidateProfile, value: unknown) => void;
}) {
  return (
    <EditorSection title="Contact and professional information">
      <div className="candidate-editor-grid">
        <label>
          Full name
          <input
            required
            value={draft.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </label>
        <label>
          Email
          <input disabled value={draft.email} />
        </label>
        <label>
          Phone
          <input
            type="tel"
            value={draft.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
        </label>
        <label>
          Location
          <input
            value={draft.location}
            onChange={(e) => set("location", e.target.value)}
          />
        </label>
        <label>
          Current role
          <input
            value={draft.current_role}
            onChange={(e) => set("current_role", e.target.value)}
          />
        </label>
        <label>
          Years of experience
          <input
            type="number"
            min="0"
            max="70"
            step=".5"
            value={draft.years_of_experience ?? ""}
            onChange={(e) =>
              set(
                "years_of_experience",
                e.target.value ? Number(e.target.value) : null,
              )
            }
          />
        </label>
        <label className="wide">
          Professional summary
          <textarea
            rows={4}
            value={draft.professional_summary}
            onChange={(e) => set("professional_summary", e.target.value)}
          />
        </label>
        <label>
          LinkedIn URL
          <input
            type="url"
            value={draft.linkedin_url}
            onChange={(e) => set("linkedin_url", e.target.value)}
          />
        </label>
        <label>
          Portfolio URL
          <input
            type="url"
            value={draft.portfolio_url}
            onChange={(e) => set("portfolio_url", e.target.value)}
          />
        </label>
      </div>
    </EditorSection>
  );
}
function HistoryEditor({
  kind,
  row,
  onChange,
  onRemove,
}: {
  kind: "experience" | "education";
  row: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onRemove: () => void;
}) {
  const fields =
    kind === "experience"
      ? [
          ["company", "Employer"],
          ["role", "Job title"],
          ["start_date", "Start date"],
          ["end_date", "End date"],
          ["location", "Location"],
          ["description", "Responsibilities"],
        ]
      : [
          ["degree", "Degree"],
          ["institution", "School or institution"],
          ["major", "Major"],
          ["year", "Graduation year"],
          ["country", "Country"],
        ];
  return (
    <div className="candidate-history-editor">
      {fields.map(([key, text]) => (
        <label key={key} className={key === "description" ? "wide" : ""}>
          {text}
          {key === "description" ? (
            <textarea
              rows={3}
              value={row[key] || ""}
              onChange={(e) => onChange(key, e.target.value)}
            />
          ) : (
            <input
              required={["company", "role", "degree", "institution"].includes(
                key,
              )}
              value={row[key] || ""}
              onChange={(e) => onChange(key, e.target.value)}
            />
          )}
        </label>
      ))}
      <button type="button" className="candidate-remove-row" onClick={onRemove}>
        <Trash2 />
        Remove
      </button>
    </div>
  );
}

function ResumePanel({
  profile,
  onChanged,
}: {
  profile: CandidateProfile;
  onChanged: () => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const upload = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    setMessage("");
    try {
      const request = await requestResumeUpload(file);
      await uploadResumeObject(request, file);
      await completeResumeUpload(request.document_id);
      await onChanged();
      setMessage("Résumé uploaded successfully.");
    } catch (reason) {
      setMessage(
        reason instanceof Error ? reason.message : "Unable to upload résumé.",
      );
    } finally {
      setBusy(false);
    }
  };
  const download = async () => {
    setBusy(true);
    try {
      const result = await getResumeDownload();
      window.location.assign(result.download_url);
    } catch (reason) {
      setMessage(
        reason instanceof Error ? reason.message : "Unable to download résumé.",
      );
    } finally {
      setBusy(false);
    }
  };
  const remove = async () => {
    if (!window.confirm("Remove your stored résumé?")) return;
    setBusy(true);
    try {
      await deleteResume();
      await onChanged();
      setMessage("Résumé removed.");
    } catch (reason) {
      setMessage(
        reason instanceof Error ? reason.message : "Unable to remove résumé.",
      );
    } finally {
      setBusy(false);
    }
  };
  const exists = Object.keys(profile.resume_metadata).length > 0;
  return (
    <section className="candidate-card candidate-resume-panel">
      <div>
        <p className="candidate-kicker">Supporting document</p>
        <h2>Résumé</h2>
        <p>
          {exists
            ? String(profile.resume_metadata.file_name || "Résumé on file")
            : "Upload a PDF, DOC, or DOCX file up to 10 MB."}
        </p>
        {message && <span role="status">{message}</span>}
      </div>
      <div>
        {exists && (
          <button
            className="candidate-btn secondary"
            disabled={busy}
            onClick={() => void download()}
          >
            <Download />
            Download
          </button>
        )}
        <label className="candidate-btn primary">
          <Upload />
          {busy ? "Working…" : exists ? "Replace résumé" : "Upload résumé"}
          <input
            type="file"
            hidden
            disabled={busy}
            accept=".pdf,.doc,.docx"
            onChange={(e) => void upload(e.target.files?.[0])}
          />
        </label>
        {exists && (
          <button
            className="candidate-btn danger"
            disabled={busy}
            onClick={() => void remove()}
          >
            <Trash2 />
            Remove
          </button>
        )}
      </div>
    </section>
  );
}
function BgvPanel({ dashboard }: { dashboard: CandidateDashboard }) {
  const documents = useLoad(listDocuments);
  const [documentType, setDocumentType] = useState<BgvDocumentType>("IDENTITY");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const completed = dashboard.bgv_status === "COMPLETED";
  const rows = documents.data?.results || [];

  const upload = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    setMessage("");
    try {
      const request = await requestBgvDocumentUpload(file, documentType);
      await uploadBgvDocumentObject(request, file);
      await completeBgvDocumentUpload(request.document_id);
      await documents.load();
      setMessage("Document uploaded successfully.");
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : "Unable to upload document.");
    } finally {
      setBusy(false);
    }
  };
  const download = async (document: CandidateDocument) => {
    setBusy(true);
    try {
      const result = await getBgvDocumentDownload(document.id);
      window.location.assign(result.download_url);
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : "Unable to download document.");
    } finally {
      setBusy(false);
    }
  };
  const remove = async (document: CandidateDocument) => {
    if (!window.confirm(`Remove ${document.file_name}?`)) return;
    setBusy(true);
    try {
      await deleteBgvDocument(document.id);
      await documents.load();
      setMessage("Document removed.");
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : "Unable to remove document.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="candidate-card candidate-bgv-panel enabled">
      <div>
        <p className="candidate-kicker">Background verification</p>
        <h2>Documents</h2>
      </div>
      <CandidateStatus value={dashboard.bgv_status || "REQUESTED"} />
      <p>
        Upload only the documents requested by the recruitment team. For questions,
        contact <a href={`mailto:${dashboard.recruitment_email}`}>{dashboard.recruitment_email}</a>.
      </p>
      {!completed && (
        <div className="candidate-bgv-upload">
          <label>
            Document category
            <select value={documentType} onChange={(event) => setDocumentType(event.target.value as BgvDocumentType)}>
              <option value="IDENTITY">Identity document</option>
              <option value="ADDRESS_PROOF">Address proof</option>
              <option value="EDUCATION">Education document</option>
              <option value="EXPERIENCE">Experience document</option>
              <option value="OTHER">Other requested document</option>
            </select>
          </label>
          <label className="candidate-btn primary">
            <Upload />
            {busy ? "Uploading…" : "Upload document"}
            <input type="file" hidden disabled={busy} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={(event) => void upload(event.target.files?.[0])} />
          </label>
          <small>PDF, JPG, PNG, DOC, or DOCX; maximum 10 MB.</small>
        </div>
      )}
      {message && <p role="status">{message}</p>}
      {documents.loading && <p>Loading documents…</p>}
      {documents.error && <p role="alert">{documents.error}</p>}
      <div className="candidate-bgv-documents">
        {rows.map((document) => (
          <article key={document.id} className="candidate-document-row">
            <FileText />
            <div><strong>{document.file_name}</strong><span>{label(document.document_type)} · {label(document.upload_status)}</span></div>
            <button type="button" className="candidate-btn secondary" disabled={busy} onClick={() => void download(document)}><Download />Download</button>
            {!completed && <button type="button" className="candidate-btn danger" disabled={busy} onClick={() => void remove(document)}><Trash2 />Remove</button>}
          </article>
        ))}
        {!documents.loading && rows.length === 0 && <p>No background verification documents uploaded yet.</p>}
      </div>
    </section>
  );
}

export function CandidateApplicationDetailPage() {
  const { id = "" } = useParams();
  const state = useLoad(() => getCandidateApplication(id));
  return (
    <section>
      {heading(
        "Application",
        state.data?.job_title || "Application detail",
        id,
      )}
      <CandidateState {...state} empty={!state.data} onRetry={state.load}>
        {state.data && (
          <>
            <article className="candidate-card application-summary">
              <div>
                <span>Application ID</span>
                <strong>{state.data.id}</strong>
              </div>
              <div>
                <span>Job ID</span>
                <strong>{state.data.job}</strong>
              </div>
              <div>
                <span>Applied</span>
                <strong>{formatDate(state.data.applied_at)}</strong>
              </div>
              <div>
                <span>Status</span>
                <CandidateStatus value={state.data.current_status} />
              </div>
            </article>
            <section className="candidate-card">
              <h2>Recruitment timeline</h2>
              <ol className="candidate-timeline">
                {state.data.status_history.map((item, index) => (
                  <li
                    key={`${item.new_status}-${item.timestamp}`}
                    className={
                      index === state.data!.status_history.length - 1
                        ? "current"
                        : "complete"
                    }
                  >
                    <span>
                      {index === state.data!.status_history.length - 1
                        ? "Current"
                        : "Completed"}
                    </span>
                    <strong>{label(item.new_status)}</strong>
                    <time>{formatDate(item.timestamp)}</time>
                    {item.reason && <p>{item.reason}</p>}
                  </li>
                ))}
              </ol>
            </section>
          </>
        )}
      </CandidateState>
    </section>
  );
}
export function CandidateInterviewDetailPage() {
  return <CandidateInterviewRoomPage />;
}
export function CandidateInterviewsPage() {
  return <CandidateEventsPage />;
}
export function CandidateDocumentsPage() {
  const navigate = useNavigate();
  useEffect(() => {
    void navigate("/candidate/profile", { replace: true });
  }, [navigate]);
  return null;
}
export function CandidateBgvPage() {
  const navigate = useNavigate();
  useEffect(() => {
    void navigate("/candidate/profile", { replace: true });
  }, [navigate]);
  return null;
}
export function CandidateOffersPage() {
  return <CandidateEventsPage />;
}
export function CandidateOfferDetailPage() {
  const { id = "" } = useParams();
  const state = useLoad(() => getOffer(id));
  return (
    <section>
      {heading(
        "Offer",
        "Offer status",
        "The offer letter and next steps are sent to your registered email.",
      )}
      <CandidateState {...state} empty={!state.data} onRetry={state.load}>
        {state.data && (
          <article className="candidate-card">
            <h2>{state.data.job_title}</h2>
            <CandidateStatus value={state.data.status} />
            <p>
              Please check your registered email for the offer letter and
              response instructions.
            </p>
          </article>
        )}
      </CandidateState>
    </section>
  );
}
export function CandidateJoiningPage() {
  return <CandidateEventsPage />;
}
export function CandidateNotificationsPage() {
  const state = useLoad(listNotifications);
  const mark = async (item: CandidateNotification) => {
    if (!item.is_read) {
      await markNotificationRead(item.id);
      await state.load();
    }
  };
  return (
    <section>
      {heading(
        "Updates",
        "Notifications",
        "Recruitment and interview updates sent to your account.",
      )}
      <CandidateState
        {...state}
        empty={!state.data?.results.length}
        emptyAction={<p>No notifications yet.</p>}
        onRetry={state.load}
      >
        {state.data && (
          <div className="candidate-list">
            {state.data.results.map((item) => (
              <button
                className={`candidate-card notification ${item.is_read ? "read" : "unread"}`}
                key={item.id}
                onClick={() => void mark(item)}
              >
                <Bell />
                <div>
                  <span>{item.is_read ? "Read" : "Unread"}</span>
                  <h2>{item.title}</h2>
                  <p>{item.message || label(item.notification_type)}</p>
                  <small>{formatDate(item.created_at)}</small>
                </div>
              </button>
            ))}
          </div>
        )}
      </CandidateState>
    </section>
  );
}
