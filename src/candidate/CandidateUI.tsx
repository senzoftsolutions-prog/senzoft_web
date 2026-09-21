import type { ReactNode } from "react";
import { AlertCircle, LoaderCircle } from "lucide-react";

export const label = (value: string) => value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
export const formatDate = (value?: string | null) => value ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: value.includes("T") ? "short" : undefined }).format(new Date(value)) : "—";
export function CandidateStatus({ value, qualifier }: { value: string; qualifier?: string }) { return <span className={`candidate-status status-${value.toLowerCase()}`}><span aria-hidden="true" />{qualifier ? `${qualifier}: ` : ""}{label(value)}</span>; }
export function CandidateState({ loading, error, empty, onRetry, children, emptyAction }: { loading: boolean; error: string; empty?: boolean; onRetry: () => void; children: ReactNode; emptyAction?: ReactNode }) {
  if (loading) return <div className="candidate-state" role="status"><LoaderCircle className="candidate-spin" /> Loading…</div>;
  if (error) return <div className="candidate-state error" role="alert"><AlertCircle /><h2>Unable to load this page</h2><p>{error}</p><button className="candidate-btn secondary" onClick={onRetry}>Retry</button></div>;
  if (empty) return <div className="candidate-state"><h2>Nothing here yet</h2>{emptyAction}</div>;
  return <>{children}</>;
}
