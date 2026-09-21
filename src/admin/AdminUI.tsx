import { useEffect, useId, useState, type ReactNode } from "react";
import { AlertCircle, LoaderCircle, X } from "lucide-react";

export function StatusBadge({ value }: { value?: string | null }) {
  const text = value ? value.replaceAll("_", " ") : "Not available";
  return <span className={`admin-status admin-status-${(value ?? "none").toLowerCase()}`}>{text}</span>;
}

export function AdminState({ loading, error, empty, onRetry, children }: { loading: boolean; error: string; empty: boolean; onRetry: () => void; children: ReactNode }) {
  if (loading) return <div className="admin-state" role="status"><LoaderCircle className="admin-spin" /> Loading data…</div>;
  if (error) return <div className="admin-state admin-state-error" role="alert"><AlertCircle /><div><strong>Unable to load data</strong><p>{error}</p><button className="admin-btn admin-btn-secondary" onClick={onRetry}>Retry</button></div></div>;
  if (empty) return <div className="admin-state"><p>No data available</p></div>;
  return <>{children}</>;
}

export function ConfirmDialog({ open, title, description, confirmLabel, destructive = false, requireReason = false, onClose, onConfirm }: { open: boolean; title: string; description: string; confirmLabel: string; destructive?: boolean; requireReason?: boolean; onClose: () => void; onConfirm: (reason: string) => Promise<void> }) {
  const titleId = useId();
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => { if (open) { setReason(""); setError(""); } }, [open]);
  if (!open) return null;
  return <div className="admin-dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="admin-dialog" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <button className="admin-icon-btn admin-dialog-close" onClick={onClose} aria-label="Close dialog"><X /></button>
      <h2 id={titleId}>{title}</h2><p>{description}</p>
      {requireReason && <label>Reason <span aria-hidden="true">*</span><textarea value={reason} onChange={(event) => setReason(event.target.value)} rows={4} /></label>}
      {error && <p className="admin-form-error" role="alert">{error}</p>}
      <div className="admin-dialog-actions"><button className="admin-btn admin-btn-secondary" onClick={onClose}>Cancel</button><button disabled={saving || (requireReason && !reason.trim())} className={`admin-btn ${destructive ? "admin-btn-danger" : "admin-btn-primary"}`} onClick={async () => { setSaving(true); setError(""); try { await onConfirm(reason); onClose(); } catch (reasonError) { setError(reasonError instanceof Error ? reasonError.message : "Action failed."); } finally { setSaving(false); } }}>{saving ? "Working…" : confirmLabel}</button></div>
    </div>
  </div>;
}

export const formatDate = (value?: string | null) => value ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "—";
export const label = (value: string) => value.replaceAll("_", " ").replace(/\b\w/g, (character) => character.toUpperCase());
