import { apiRequest } from "./client";

export const getCandidateProfile = (token: string) => apiRequest("candidates/me/", {}, token);
export const updateCandidateProfile = (token: string, profile: Record<string, unknown>) => apiRequest("candidates/me/", { method: "PATCH", body: JSON.stringify(profile) }, token);
