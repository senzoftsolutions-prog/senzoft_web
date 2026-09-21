import { useEffect, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { Search } from "lucide-react";
import { getAdminRecord } from "../../services/api/admin";
import { AdminState, formatDate, label, StatusBadge } from "../AdminUI";
import { useAdminList, useDebouncedValue } from "../useAdminList";

type Row = Record<string, unknown> & { id: string; status?: string };
type Column = { key: string; title: string; render?: (row: Row) => ReactNode };

const definitions: Record<string, { title: string; kicker: string; description: string; columns: Column[]; detail?: boolean }> = {
  interviews: { title: "Interviews", kicker: "Recruitment", description: "Scheduled and completed interview records. AI execution is not part of this phase.", detail: true, columns: [
    { key: "id", title: "Interview" }, { key: "candidate_name", title: "Candidate" }, { key: "job_title", title: "Job" }, { key: "interview_type", title: "Type" }, { key: "status", title: "Status", render: (row) => <StatusBadge value={String(row.status ?? "")} /> }, { key: "scheduled_at", title: "Scheduled", render: (row) => formatDate(row.scheduled_at as string | null) }, { key: "interviewer_name", title: "Interviewer" },
  ] },
  documents: { title: "Documents", kicker: "HR operations", description: "Private document metadata. Files are not exposed by this API.", columns: [
    { key: "id", title: "Document" }, { key: "candidate_name", title: "Candidate" }, { key: "document_type", title: "Type" }, { key: "file_name", title: "File" }, { key: "upload_status", title: "Status", render: (row) => <StatusBadge value={String(row.upload_status ?? "")} /> }, { key: "uploaded_at", title: "Uploaded", render: (row) => formatDate(row.uploaded_at as string | null) }, { key: "reviewed_by_name", title: "Reviewed by" },
  ] },
  bgv: { title: "Background verification", kicker: "HR operations", description: "Verification records without an external provider integration.", detail: true, columns: [
    { key: "id", title: "BGV" }, { key: "candidate_name", title: "Candidate" }, { key: "application_id", title: "Application" }, { key: "status", title: "Status", render: (row) => <StatusBadge value={String(row.status ?? "")} /> }, { key: "requested_at", title: "Requested", render: (row) => formatDate(row.requested_at as string | null) }, { key: "completed_at", title: "Completed", render: (row) => formatDate(row.completed_at as string | null) }, { key: "reviewer_name", title: "Reviewer" },
  ] },
  offers: { title: "Offers", kicker: "HR operations", description: "Offer lifecycle records. Document generation is deferred.", detail: true, columns: [
    { key: "id", title: "Offer" }, { key: "candidate_name", title: "Candidate" }, { key: "job_title", title: "Job" }, { key: "status", title: "Status", render: (row) => <StatusBadge value={String(row.status ?? "")} /> }, { key: "issued_at", title: "Issued", render: (row) => formatDate(row.issued_at as string | null) }, { key: "expires_at", title: "Expires", render: (row) => formatDate(row.expires_at as string | null) }, { key: "joining_date", title: "Joining date" },
  ] },
  joining: { title: "Joining", kicker: "HR operations", description: "Confirmed and pending joining records.", columns: [
    { key: "id", title: "Joining" }, { key: "candidate_name", title: "Candidate" }, { key: "job_title", title: "Job" }, { key: "joining_date", title: "Joining date" }, { key: "status", title: "Status", render: (row) => <StatusBadge value={String(row.status ?? "")} /> }, { key: "location", title: "Location" }, { key: "department", title: "Department" },
  ] },
};

const show = (value: unknown) => value === null || value === undefined || value === "" ? "—" : typeof value === "object" ? JSON.stringify(value) : String(value).replaceAll("_", " ");

export function AdminResourceListPage({ resource }: { resource: keyof typeof definitions }) {
  const definition = definitions[resource]; const [search, setSearch] = useState(""); const [page, setPage] = useState(1); const query = useDebouncedValue(search); const list = useAdminList<Row>(resource, { search: query, ordering: "-created_at", page });
  return <div className="admin-page"><header className="admin-page-header"><div><span className="admin-kicker">{definition.kicker}</span><h1>{definition.title}</h1><p>{definition.description}</p></div></header><div className="admin-toolbar"><label className="admin-search"><Search /><span className="sr-only">Search {definition.title}</span><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder={`Search ${definition.title.toLowerCase()}`} /></label></div><AdminState loading={list.loading} error={list.error} empty={!list.data.results.length} onRetry={list.reload}><div className="admin-table-wrap"><table className="admin-table"><thead><tr>{definition.columns.map((column) => <th key={column.key}>{column.title}</th>)}{definition.detail && <th>Action</th>}</tr></thead><tbody>{list.data.results.map((row) => <tr key={row.id}>{definition.columns.map((column) => <td key={column.key} data-label={column.title}>{column.render ? column.render(row) : show(row[column.key])}</td>)}{definition.detail && <td data-label="Action"><Link className="admin-table-link" to={`/admin/${resource}/${row.id}`}>View</Link></td>}</tr>)}</tbody></table></div><div className="admin-pagination"><button disabled={page === 1} onClick={() => setPage((value) => value - 1)}>Previous</button><span>Page {page} · {list.data.count} records</span><button disabled={!list.data.next} onClick={() => setPage((value) => value + 1)}>Next</button></div></AdminState></div>;
}

export function AdminResourceDetailPage({ resource }: { resource: keyof typeof definitions }) {
  const { id = "" } = useParams(); const definition = definitions[resource]; const [row, setRow] = useState<Row | null>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  async function load() { setLoading(true); setError(""); try { setRow(await getAdminRecord<Row>(resource, id)); } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to load record."); } finally { setLoading(false); } }
  useEffect(() => { void load(); }, [id, resource]);
  return <div className="admin-page"><header className="admin-page-header"><div><Link className="admin-back" to={`/admin/${resource}`}>← {definition.title}</Link><span className="admin-kicker">{definition.kicker}</span><h1>{row ? show(row.candidate_name ?? row.id) : definition.title}</h1><p>{id}</p></div>{row?.status && <StatusBadge value={row.status} />}</header><AdminState loading={loading} error={error} empty={!row} onRetry={load}>{row && <section className="admin-card"><dl className="admin-definition">{Object.entries(row).filter(([key]) => !["id", "candidate", "application"].includes(key)).map(([key, value]) => <div key={key}><dt>{label(key)}</dt><dd>{show(value)}</dd></div>)}</dl></section>}</AdminState></div>;
}
