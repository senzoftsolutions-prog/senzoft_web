import { useEffect, useState } from "react";
import { ArrowLeft, CalendarClock, Download } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getAdminApplicationResume, getAdminRecord, runAdminAction, type AdminApplication } from "../../services/api/admin";
import { AdminState, ConfirmDialog, formatDate, label, StatusBadge } from "../AdminUI";

const transitions: Record<string, string[]> = {
  APPLIED: ["TALENT_REVIEW", "REJECTED", "ON_HOLD", "CANCELLED"],
  TALENT_REVIEW: ["SHORTLISTED", "REJECTED", "ON_HOLD", "CANCELLED"],
  SHORTLISTED: ["REJECTED", "ON_HOLD"],
  AI_INTERVIEW_INVITED: ["AI_INTERVIEW_IN_PROGRESS", "REJECTED", "NO_SHOW", "ON_HOLD"],
  AI_INTERVIEW_IN_PROGRESS: ["AI_INTERVIEW_COMPLETED", "CANCELLED"],
  AI_INTERVIEW_COMPLETED: ["REJECTED", "ON_HOLD"],
  TECHNICAL_INTERVIEW: ["HR_INTERVIEW", "REJECTED", "NO_SHOW", "ON_HOLD"],
  HR_INTERVIEW: ["DOCUMENTS_REQUESTED", "REJECTED", "NO_SHOW", "ON_HOLD"],
  DOCUMENTS_REQUESTED: ["DOCUMENTS_SUBMITTED", "CANCELLED"],
  DOCUMENTS_SUBMITTED: ["BACKGROUND_VERIFICATION", "CANCELLED"],
  BACKGROUND_VERIFICATION: ["BGV_COMPLETED", "REJECTED", "ON_HOLD"],
  BGV_COMPLETED: ["OFFER_ISSUED", "REJECTED"],
  OFFER_ISSUED: ["OFFER_ACCEPTED", "OFFER_DECLINED", "CANCELLED"],
  OFFER_ACCEPTED: ["JOINING_PROCESS", "CANCELLED"],
  JOINING_PROCESS: ["JOINED", "NO_SHOW", "CANCELLED"],
};

type ScheduleType = "AI_SCREENING" | "TECHNICAL";

export default function AdminApplicationDetailPage() {
  const { id = "" } = useParams();
  const [item, setItem] = useState<AdminApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [next, setNext] = useState<string | null>(null);
  const [interviewType, setInterviewType] = useState<ScheduleType>("AI_SCREENING");
  const [scheduledAt, setScheduledAt] = useState("");
  const [scheduleNote, setScheduleNote] = useState("");
  const [scheduling, setScheduling] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      setItem(await getAdminRecord("applications", id));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to load application.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, [id]);

  const snapshot = item?.profile_snapshot ?? {};
  const canScheduleAi = Boolean(item && ["APPLIED", "TALENT_REVIEW", "SHORTLISTED"].includes(item.current_status));
  const canScheduleTechnical = Boolean(item && ["SHORTLISTED", "AI_INTERVIEW_COMPLETED", "ON_HOLD"].includes(item.current_status));
  const selectedTypeAllowed = interviewType === "AI_SCREENING" ? canScheduleAi : canScheduleTechnical;

  const downloadResume = async () => {
    setError("");
    try {
      const result = await getAdminApplicationResume(id);
      window.location.assign(result.download_url);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to download resume.");
    }
  };

  const scheduleInterview = async () => {
    if (!scheduledAt || scheduling) return;
    setScheduling(true);
    setError("");
    try {
      await runAdminAction("applications", id, "schedule-interview", {
        interview_type: interviewType,
        scheduled_at: new Date(scheduledAt).toISOString(),
        notes: scheduleNote,
      });
      setScheduledAt("");
      setScheduleNote("");
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to schedule interview.");
    } finally {
      setScheduling(false);
    }
  };

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <Link className="admin-back" to="/admin/applications"><ArrowLeft /> Applications</Link>
          <span className="admin-kicker">Application review</span>
          <h1>{item?.candidate_name ?? "Application"}</h1>
          <p>{item?.id}</p>
        </div>
        {item && <StatusBadge value={item.current_status} />}
      </header>
      <AdminState loading={loading} error={error} empty={!item} onRetry={load}>
        {item && (
          <div className="admin-detail-grid">
            <section className="admin-card">
              <div className="admin-card-header"><h2>Candidate profile</h2><Link to={`/admin/candidates/${item.candidate_id}`}>Full profile</Link></div>
              <dl className="admin-definition">
                <div><dt>Name</dt><dd>{item.candidate_name}</dd></div>
                <div><dt>Email</dt><dd>{item.candidate_email}</dd></div>
                {Object.entries(snapshot).filter(([key]) => !["name", "email"].includes(key)).map(([key, value]) => (
                  <div key={key}><dt>{label(key)}</dt><dd>{Array.isArray(value) ? value.join(", ") : String(value || "—")}</dd></div>
                ))}
              </dl>
              <button className="admin-btn admin-btn-secondary" onClick={() => void downloadResume()}><Download /> Download submitted resume</button>
            </section>
            <section className="admin-card">
              <div className="admin-card-header"><h2>Application</h2></div>
              <dl className="admin-definition">
                <div><dt>Job</dt><dd>{item.job_title}</dd></div>
                <div><dt>Applied</dt><dd>{formatDate(item.applied_at)}</dd></div>
                <div><dt>Recruiter</dt><dd>{item.recruiter_name || "Unassigned"}</dd></div>
                <div><dt>Hiring manager</dt><dd>{item.hiring_manager_name || "Unassigned"}</dd></div>
              </dl>
              <h3 className="admin-subheading">Available actions</h3>
              <div className="admin-action-grid">
                {(transitions[item.current_status] ?? []).map((status) => (
                  <button key={status} className={`admin-btn ${["REJECTED", "CANCELLED", "NO_SHOW", "OFFER_DECLINED"].includes(status) ? "admin-btn-danger-outline" : "admin-btn-secondary"}`} onClick={() => setNext(status)}>{label(status)}</button>
                ))}
                {!(transitions[item.current_status] ?? []).length && <p className="admin-empty-inline">No further transitions are available.</p>}
              </div>
            </section>
            <section className="admin-card admin-card-full">
              <div className="admin-card-header"><div><span className="admin-kicker">Interview planning</span><h2>Schedule an interview</h2></div><CalendarClock /></div>
              <div className="admin-form admin-form-grid">
                <label>Interview type<select value={interviewType} onChange={(event) => setInterviewType(event.target.value as ScheduleType)}><option value="AI_SCREENING" disabled={!canScheduleAi}>AI pre-screening</option><option value="TECHNICAL" disabled={!canScheduleTechnical}>Technical interview</option></select></label>
                <label>Date and time<input type="datetime-local" required value={scheduledAt} min={new Date().toISOString().slice(0, 16)} onChange={(event) => setScheduledAt(event.target.value)} /></label>
                <label className="admin-field-wide">Candidate instructions<textarea rows={3} value={scheduleNote} onChange={(event) => setScheduleNote(event.target.value)} placeholder={interviewType === "AI_SCREENING" ? "Only microphone access is required." : "Meeting link or preparation instructions."} /></label>
                <div className="admin-form-actions admin-field-wide"><button className="admin-btn admin-btn-primary" disabled={scheduling || !scheduledAt || !selectedTypeAllowed} onClick={() => void scheduleInterview()}>{scheduling ? "Scheduling…" : `Schedule ${interviewType === "AI_SCREENING" ? "AI interview" : "technical interview"}`}</button></div>
              </div>
            </section>
            <section className="admin-card admin-card-full">
              <div className="admin-card-header"><h2>Recruitment timeline</h2></div>
              <ol className="admin-timeline">{item.status_history.map((entry, index) => <li key={`${entry.timestamp}-${index}`}><span /><div><strong>{label(entry.new_status)}</strong><p>{formatDate(entry.timestamp)} · {entry.changed_by}</p>{entry.reason && <blockquote>{entry.reason}</blockquote>}</div></li>)}</ol>
            </section>
          </div>
        )}
      </AdminState>
      <ConfirmDialog open={Boolean(next)} title={`${next ? label(next) : "Update application"}?`} description="Django will validate this transition, email the candidate, and preserve the decision in the recruitment history." confirmLabel={next ? label(next) : "Confirm"} destructive={Boolean(next && ["REJECTED", "CANCELLED", "NO_SHOW", "OFFER_DECLINED"].includes(next))} requireReason={Boolean(next && ["REJECTED", "CANCELLED", "ON_HOLD", "NO_SHOW", "OFFER_DECLINED"].includes(next))} onClose={() => setNext(null)} onConfirm={async (reason) => { if (!next) return; await runAdminAction("applications", id, "transition", { status: next, reason }); await load(); }} />
    </div>
  );
}
