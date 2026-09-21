import { apiRequest, tokenStore } from "./client";

export type AuthTokens = { access: string; refresh: string };
export type AdminRole = "CANDIDATE" | "RECRUITER" | "HIRING_MANAGER" | "INTERVIEWER" | "HR" | "ADMIN" | "SUPER_ADMIN";
export type CurrentUser = { id: string; username: string; email: string; first_name: string; last_name: string; role: AdminRole; is_email_verified: boolean };

export async function signIn(username: string, password: string) {
  const tokens = await apiRequest<AuthTokens>("auth/login/", { method: "POST", body: JSON.stringify({ username, password }) });
  tokenStore.set(tokens.access, tokens.refresh);
  return tokens;
}
export type RegistrationPayload = { username: string; email: string; password: string; first_name: string; last_name: string; phone: string };
export const registerCandidate = (payload: RegistrationPayload) => apiRequest<CurrentUser>("auth/register/", { method: "POST", body: JSON.stringify(payload) });
export const refreshToken = (refresh: string) => apiRequest<{ access: string }>("auth/refresh/", { method: "POST", body: JSON.stringify({ refresh }) });
export const getCurrentUser = () => apiRequest<{ success: true; data: CurrentUser }>("auth/me/");
export const signOut = () => tokenStore.clear();
