import { useEffect, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { Search } from "lucide-react";
import { getAdminRecord } from "../../services/api/admin";
import { AdminState, formatDate, label, StatusBadge } from "../AdminUI";
import { useAdminList, useDebouncedValue } from "../useAdminList";

type Row = Record<string, unknown> & { id: string; status?: string };
type Column = { key: string; title: string; render?: (row: Row) => ReactNode };

const definitions: Record<
  string,
  {
    title: string;
    kicker: string;
    description: string;
    columns: Column[];
    detail?: boolean;
  }
> = {
  interviews: {
    title: "Interviews",
    kicker: "Recruitment",
    description:
      "First-round AI pre-screenings and recruiter-reviewed interview evidence.",
    detail: true,
    columns: [
      { key: "id", title: "Interview" },
      { key: "candidate_name", title: "Candidate" },
      { key: "job_title", title: "Job" },
      { key: "interview_type", title: "Type" },
      {
        key: "status",
        title: "Status",
        render: (row) => <StatusBadge value={String(row.status ?? "")} />,
      },
      {
        key: "scheduled_at",
        title: "Scheduled",
        render: (row) => formatDate(row.scheduled_at as string | null),
      },
      { key: "interviewer_name", title: "Interviewer" },
    ],
  },
  documents: {
    title: "Documents",
    kicker: "HR operations",
    description:
      "Private document metadata. Files are not exposed by this API.",
    columns: [
      { key: "id", title: "Document" },
      { key: "candidate_name", title: "Candidate" },
      { key: "document_type", title: "Type" },
      { key: "file_name", title: "File" },
      {
        key: "upload_status",
        title: "Status",
        render: (row) => (
          <StatusBadge value={String(row.upload_status ?? "")} />
        ),
      },
      {
        key: "uploaded_at",
        title: "Uploaded",
        render: (row) => formatDate(row.uploaded_at as string | null),
      },
      { key: "reviewed_by_name", title: "Reviewed by" },
    ],
  },
  bgv: {
    title: "Background verification",
    kicker: "HR operations",
    description:
      "Verification records without an external provider integration.",
    detail: true,
    columns: [
      { key: "id", title: "BGV" },
      { key: "candidate_name", title: "Candidate" },
      { key: "application_id", title: "Application" },
      {
        key: "status",
        title: "Status",
        render: (row) => <StatusBadge value={String(row.status ?? "")} />,
      },
      {
        key: "requested_at",
        title: "Requested",
        render: (row) => formatDate(row.requested_at as string | null),
      },
      {
        key: "completed_at",
        title: "Completed",
        render: (row) => formatDate(row.completed_at as string | null),
      },
      { key: "reviewer_name", title: "Reviewer" },
    ],
  },
  offers: {
    title: "Offers",
    kicker: "HR operations",
    description: "Offer lifecycle records. Document generation is deferred.",
    detail: true,
    columns: [
      { key: "id", title: "Offer" },
      { key: "candidate_name", title: "Candidate" },
      { key: "job_title", title: "Job" },
      {
        key: "status",
        title: "Status",
        render: (row) => <StatusBadge value={String(row.status ?? "")} />,
      },
      {
        key: "issued_at",
        title: "Issued",
        render: (row) => formatDate(row.issued_at as string | null),
      },
      {
        key: "expires_at",
        title: "Expires",
        render: (row) => formatDate(row.expires_at as string | null),
      },
      { key: "joining_date", title: "Joining date" },
    ],
  },
  joining: {
    title: "Joining",
    kicker: "HR operations",
    description: "Confirmed and pending joining records.",
    columns: [
      { key: "id", title: "Joining" },
      { key: "candidate_name", title: "Candidate" },
      { key: "job_title", title: "Job" },
      { key: "joining_date", title: "Joining date" },
      {
        key: "status",
        title: "Status",
        render: (row) => <StatusBadge value={String(row.status ?? "")} />,
      },
      { key: "location", title: "Location" },
      { key: "department", title: "Department" },
    ],
  },
};

const show = (value: unknown) =>
  value === null || value === undefined || value === ""
    ? "—"
    : typeof value === "object"
      ? JSON.stringify(value)
      : String(value).replaceAll("_", " ");

type InterviewResponseRow = {
  id: string;
  question: string;
  transcript: string;
  score: string | number | null;
  evaluation?: { strengths?: string[]; concerns?: string[] };
};

function InterviewReview({ row }: { row: Row }) {
  const evaluation = (row.evaluation_summary || {}) as Record<string, unknown>;
  const result = (evaluation.structured_result ||
    row.final_result ||
    {}) as Record<string, unknown>;
  const responses = (
    Array.isArray(row.responses) ? row.responses : []
  ) as InterviewResponseRow[];
  const events = Array.isArray(row.integrity_events)
    ? row.integrity_events
    : [];
  const scores: Array<[string, unknown]> = [
    ["Overall", evaluation.overall_score],
    ["Technical", evaluation.technical_score],
    ["Communication", evaluation.communication_score],
    ["Relevance", evaluation.relevance_score],
  ];
  return (
    <div className="admin-interview-review">
      <section className="admin-card admin-card-full">
        <div className="admin-card-header">
          <div>
            <span className="admin-kicker">Human review required</span>
            <h2>First-round screening summary</h2>
          </div>
          <StatusBadge value={String(row.status ?? "")} />
        </div>
        <div className="admin-score-grid">
          {scores.map(([name, value]) => (
            <div key={String(name)}>
              <span>{name}</span>
              <strong>
                {value === null || value === undefined ? "—" : `${value}/10`}
              </strong>
            </div>
          ))}
        </div>
        <dl className="admin-definition">
          <div>
            <dt>Candidate</dt>
            <dd>{show(row.candidate_name)}</dd>
          </div>
          <div>
            <dt>Role</dt>
            <dd>{show(row.job_title)}</dd>
          </div>
          <div>
            <dt>Interview type</dt>
            <dd>{show(row.interview_type)}</dd>
          </div>
          <div>
            <dt>Recommendation</dt>
            <dd>{show(result.decision || "HUMAN_REVIEW_REQUIRED")}</dd>
          </div>
          <div className="admin-field-wide">
            <dt>AI summary</dt>
            <dd>
              {show(
                result.summary ||
                  "Complete the interview to generate a summary.",
              )}
            </dd>
          </div>
        </dl>
      </section>
      <section className="admin-card admin-card-full">
        <div className="admin-card-header">
          <h2>Questions and candidate answers</h2>
          <span>{responses.length} responses</span>
        </div>
        <div className="admin-answer-list">
          {responses.length ? (
            responses.map((response, index) => (
              <article key={response.id}>
                <span>
                  Question {index + 1} · Score {response.score ?? "—"}/10
                </span>
                <h3>{response.question}</h3>
                <blockquote>{response.transcript}</blockquote>
                {response.evaluation?.strengths?.length ? (
                  <p>
                    <strong>Strengths:</strong>{" "}
                    {response.evaluation.strengths.join(" · ")}
                  </p>
                ) : null}
                {response.evaluation?.concerns?.length ? (
                  <p>
                    <strong>Review:</strong>{" "}
                    {response.evaluation.concerns.join(" · ")}
                  </p>
                ) : null}
              </article>
            ))
          ) : (
            <p className="admin-empty-inline">No answers submitted yet.</p>
          )}
        </div>
      </section>
      <section className="admin-card admin-card-full">
        <div className="admin-card-header">
          <h2>Integrity signals</h2>
          <span>{events.length} events</span>
        </div>
        <p>
          Signals require context and are never proof of misconduct or an
          automatic decision.
        </p>
      </section>
    </div>
  );
}

export function AdminResourceListPage({
  resource,
}: {
  resource: keyof typeof definitions;
}) {
  const definition = definitions[resource];
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const query = useDebouncedValue(search);
  const list = useAdminList<Row>(resource, {
    search: query,
    ordering: "-created_at",
    page,
  });
  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <span className="admin-kicker">{definition.kicker}</span>
          <h1>{definition.title}</h1>
          <p>{definition.description}</p>
        </div>
      </header>
      <div className="admin-toolbar">
        <label className="admin-search">
          <Search />
          <span className="sr-only">Search {definition.title}</span>
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder={`Search ${definition.title.toLowerCase()}`}
          />
        </label>
      </div>
      <AdminState
        loading={list.loading}
        error={list.error}
        empty={!list.data.results.length}
        onRetry={list.reload}
      >
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                {definition.columns.map((column) => (
                  <th key={column.key}>{column.title}</th>
                ))}
                {definition.detail && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {list.data.results.map((row) => (
                <tr key={row.id}>
                  {definition.columns.map((column) => (
                    <td key={column.key} data-label={column.title}>
                      {column.render
                        ? column.render(row)
                        : show(row[column.key])}
                    </td>
                  ))}
                  {definition.detail && (
                    <td data-label="Action">
                      <Link
                        className="admin-table-link"
                        to={`/admin/${resource}/${row.id}`}
                      >
                        View
                      </Link>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="admin-pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage((value) => value - 1)}
          >
            Previous
          </button>
          <span>
            Page {page} · {list.data.count} records
          </span>
          <button
            disabled={!list.data.next}
            onClick={() => setPage((value) => value + 1)}
          >
            Next
          </button>
        </div>
      </AdminState>
    </div>
  );
}

export function AdminResourceDetailPage({
  resource,
}: {
  resource: keyof typeof definitions;
}) {
  const { id = "" } = useParams();
  const definition = definitions[resource];
  const [row, setRow] = useState<Row | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  async function load() {
    setLoading(true);
    setError("");
    try {
      setRow(await getAdminRecord<Row>(resource, id));
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Unable to load record.",
      );
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
  }, [id, resource]);
  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <Link className="admin-back" to={`/admin/${resource}`}>
            ← {definition.title}
          </Link>
          <span className="admin-kicker">{definition.kicker}</span>
          <h1>{row ? show(row.candidate_name ?? row.id) : definition.title}</h1>
          <p>{id}</p>
        </div>
        {row?.status && <StatusBadge value={row.status} />}
      </header>
      <AdminState loading={loading} error={error} empty={!row} onRetry={load}>
        {row && resource === "interviews" ? (
          <InterviewReview row={row} />
        ) : row ? (
          <section className="admin-card">
            <dl className="admin-definition">
              {Object.entries(row)
                .filter(
                  ([key]) => !["id", "candidate", "application"].includes(key),
                )
                .map(([key, value]) => (
                  <div key={key}>
                    <dt>{label(key)}</dt>
                    <dd>{show(value)}</dd>
                  </div>
                ))}
            </dl>
          </section>
        ) : null}
      </AdminState>
    </div>
  );
}
