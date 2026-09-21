import { apiRequest } from "./client";

export const createApplication = (token: string, payload: { job_id: string; resume_version: Record<string, unknown> }) => apiRequest("applications/", { method: "POST", body: JSON.stringify(payload) }, token);
export const getMyApplications = (token: string) => apiRequest("candidates/me/applications/", {}, token);
export const getApplication = (token: string, id: string) => apiRequest(`applications/${encodeURIComponent(id)}/`, {}, token);
