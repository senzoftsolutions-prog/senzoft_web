import { apiRequest } from "./client";

export type Page<T> = { count: number; next: string | null; previous: string | null; results: T[] };
export type StatusCount = { current_status: string; count: number };
export type AdminJob = {
  id: string; title: string; slug: string; department: string; business_unit: string;
  location: string; work_mode: string; employment_type: string; experience_level: string;
  minimum_experience: number; maximum_experience: number | null; description: string;
  responsibilities: string[]; required_skills: string[]; preferred_skills: string[];
  qualifications: string[]; benefits: string[]; seo_title: string; seo_description: string;
  number_of_openings: number; application_deadline: string | null; status: string;
  applications_count: number; published_at: string | null; closed_at: string | null;
  created_at: string; updated_at: string;
};
export type AdminApplication = {
  id: string; candidate_id: string; candidate_name: string; candidate_email: string;
  job_id: string; job_title: string; applied_at: string; current_status: string;
  source: string; resume_version: Record<string, unknown>; profile_snapshot: Record<string, unknown>;
  recruiter_name: string | null; hiring_manager_name: string | null;
  status_history: Array<{ previous_status: string; new_status: string; changed_by: string; reason: string; timestamp: string }>;
  updated_at: string;
};
export type AdminCandidate = {
  id: string; name: string; email: string; phone: string; location: string;
  professional_summary: string; skills: string[]; experience: unknown[]; education: unknown[];
  certifications: unknown[]; applications_count: number; latest_application_at: string | null;
  latest_status: string | null; created_at: string; updated_at: string;
};
export type AdminInterview = {
  id: string; application_id: string; candidate_id: string; candidate_name: string;
  job_id: string; job_title: string; interview_type: string; status: string;
  scheduled_at: string | null; interviewer_name: string | null; result: Record<string, unknown>;
};
export type DashboardData = {
  counts: Record<"jobs" | "applications" | "candidates" | "interviews" | "pending_bgv" | "offers", number>;
  recent_applications: AdminApplication[]; recent_jobs: AdminJob[];
  upcoming_interviews: AdminInterview[]; status_distribution: StatusCount[];
};

const queryString = (params: Record<string, string | number | undefined>) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  const text = query.toString();
  return text ? `?${text}` : "";
};

export const getDashboard = () => apiRequest<DashboardData>("admin/dashboard/");
export const getAdminResource = <T>(resource: string, params: Record<string, string | number | undefined> = {}) => apiRequest<Page<T>>(`admin/${resource}/${queryString(params)}`);
export const getAdminRecord = <T>(resource: string, id: string) => apiRequest<T>(`admin/${resource}/${encodeURIComponent(id)}/`);
export const createAdminRecord = <T>(resource: string, body: unknown) => apiRequest<T>(`admin/${resource}/`, { method: "POST", body: JSON.stringify(body) });
export const updateAdminRecord = <T>(resource: string, id: string, body: unknown) => apiRequest<T>(`admin/${resource}/${encodeURIComponent(id)}/`, { method: "PATCH", body: JSON.stringify(body) });
export const runAdminAction = <T>(resource: string, id: string, action: string, body: unknown = {}) => apiRequest<T>(`admin/${resource}/${encodeURIComponent(id)}/${action}/`, { method: "POST", body: JSON.stringify(body) });
