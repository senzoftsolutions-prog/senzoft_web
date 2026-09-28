import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import {
  getAdminRecord,
  getAdminResource,
  type AdminApplication,
  type AdminCandidate,
} from "../../services/api/admin";
import { AdminState, formatDate, label, StatusBadge } from "../AdminUI";

const displayValue = (value: unknown): string => {
  if (value === null || value === undefined || value === "") return "—";
  if (Array.isArray(value)) return value.map(displayValue).join(", ");
  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .filter(([, nested]) => nested !== null && nested !== undefined && nested !== "")
      .map(([key, nested]) => `${label(key)}: ${displayValue(nested)}`)
      .join(" · ");
  }
  return String(value);
};

function ProfileEntries({
  title,
  entries,
}: {
  title: string;
  entries: unknown[];
}) {
  return (
    <div className="admin-profile-block">
      <h3>{title}</h3>
      {entries.length ? (
        <div className="admin-profile-entry-list">
          {entries.map((entry, index) => {
            if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
              return <article className="admin-profile-entry" key={`${title}-${index}`}><strong>{displayValue(entry)}</strong></article>;
            }
            const values = entry as Record<string, unknown>;
            const headingKey = ["role", "degree", "name", "title", "certification"].find((key) => values[key]);
            const subheadingKey = ["company", "institution", "issuer"].find((key) => values[key]);
            return (
              <article className="admin-profile-entry" key={`${title}-${index}`}>
                <header>
                  <strong>{headingKey ? displayValue(values[headingKey]) : `${title} ${index + 1}`}</strong>
                  {subheadingKey && <span>{displayValue(values[subheadingKey])}</span>}
                </header>
                <dl>
                  {Object.entries(values)
                    .filter(([key, value]) => key !== headingKey && key !== subheadingKey && value !== "" && value !== null && value !== undefined)
                    .map(([key, value]) => <div key={key}><dt>{label(key)}</dt><dd>{displayValue(value)}</dd></div>)}
                </dl>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="admin-empty-inline">No {title.toLowerCase()} added.</p>
      )}
    </div>
  );
}

export default function AdminCandidateDetailPage() {
  const { id = "" } = useParams();
  const [candidate, setCandidate] = useState<AdminCandidate | null>(null);
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  async function load() {
    setLoading(true);
    setError("");
    try {
      const [profile, related] = await Promise.all([
        getAdminRecord<AdminCandidate>("candidates", id),
        getAdminResource<AdminApplication>("applications", {
          candidate__public_id: id,
          ordering: "-applied_at",
        }),
      ]);
      setCandidate(profile);
      setApplications(related.results);
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Unable to load candidate.",
      );
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
  }, [id]);
  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <Link className="admin-back" to="/admin/candidates">
            <ArrowLeft /> Candidates
          </Link>
          <span className="admin-kicker">Candidate profile</span>
          <h1>{candidate?.name ?? "Candidate"}</h1>
          <p>{candidate?.id}</p>
        </div>
      </header>
      <AdminState
        loading={loading}
        error={error}
        empty={!candidate}
        onRetry={load}
      >
        {candidate && (
          <div className="admin-detail-grid">
            <section className="admin-card">
              <div className="admin-card-header">
                <h2>Profile</h2>
              </div>
              <dl className="admin-definition">
                <div>
                  <dt>Email</dt>
                  <dd>{candidate.email}</dd>
                </div>
                <div>
                  <dt>Phone</dt>
                  <dd>{candidate.phone || "—"}</dd>
                </div>
                <div>
                  <dt>Location</dt>
                  <dd>{candidate.location || "—"}</dd>
                </div>
                <div>
                  <dt>Postal address</dt>
                  <dd>
                    {[
                      candidate.address_line1,
                      candidate.address_line2,
                      candidate.city,
                      candidate.state,
                      candidate.postal_code,
                      candidate.country,
                    ]
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </dd>
                </div>
                <div>
                  <dt>Created</dt>
                  <dd>{formatDate(candidate.created_at)}</dd>
                </div>
              </dl>
              <h3 className="admin-subheading">Professional summary</h3>
              <p>{candidate.professional_summary || "No data available"}</p>
              <h3 className="admin-subheading">Skills</h3>
              <div className="admin-tags">
                {candidate.skills.length ? (
                  candidate.skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))
                ) : (
                  <p>No data available</p>
                )}
              </div>
            </section>
            <section className="admin-card">
              <div className="admin-card-header">
                <h2>Experience and education</h2>
              </div>
              <ProfileEntries title="Experience" entries={candidate.experience} />
              <ProfileEntries title="Education" entries={candidate.education} />
              <ProfileEntries title="Certifications" entries={candidate.certifications} />
            </section>
            <section className="admin-card admin-card-full">
              <div className="admin-card-header">
                <h2>Applications</h2>
              </div>
              {applications.length ? (
                <div className="admin-list">
                  {applications.map((item) => (
                    <Link to={`/admin/applications/${item.id}`} key={item.id}>
                      <div>
                        <strong>{item.job_title}</strong>
                        <span>{formatDate(item.applied_at)}</span>
                      </div>
                      <StatusBadge value={item.current_status} />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="admin-empty-inline">No data available</p>
              )}
            </section>
          </div>
        )}
      </AdminState>
    </div>
  );
}
