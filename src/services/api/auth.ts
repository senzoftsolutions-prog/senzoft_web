import { apiRequest, tokenStore } from "./client";

export type AuthTokens = { access: string; refresh: string };
export type AuthChallenge = { verification_required: true; challenge_id: string; email: string; expires_in: number };
export type AuthResult = AuthTokens | AuthChallenge;
export type AdminRole = "CANDIDATE" | "RECRUITER" | "HIRING_MANAGER" | "INTERVIEWER" | "HR" | "SUPER_ADMIN";
export type CurrentUser = { id: string; username: string; email: string; first_name: string; last_name: string; role: AdminRole; is_email_verified: boolean };

export async function signIn(username: string, password: string) {
  const result = await apiRequest<AuthResult>("auth/login/", { method: "POST", body: JSON.stringify({ username, password }) });
  if ("access" in result) tokenStore.set(result.access, result.refresh);
  return result;
}
export type RegistrationPayload = { username: string; email: string; password: string; first_name: string; last_name: string; phone: string; phone_country: string };
export const registerCandidate = (payload: RegistrationPayload) => apiRequest<AuthChallenge>("auth/register/", { method: "POST", body: JSON.stringify(payload) });
export async function verifyLoginCode(challenge_id: string, code: string) {
  const tokens = await apiRequest<AuthTokens>("auth/verify-code/", { method: "POST", body: JSON.stringify({ challenge_id, code }) });
  tokenStore.set(tokens.access, tokens.refresh);
  return tokens;
}
export const resendLoginCode = (challenge_id: string) => apiRequest<AuthChallenge>("auth/resend-code/", { method: "POST", body: JSON.stringify({ challenge_id }) });
export const requestLoginCode = (email: string, portal: "candidate" | "admin") => apiRequest<AuthChallenge>("auth/request-code/", { method: "POST", body: JSON.stringify({ email, portal }) });
export const refreshToken = (refresh: string) => apiRequest<{ access: string }>("auth/refresh/", { method: "POST", body: JSON.stringify({ refresh }) });
export const getCurrentUser = () => apiRequest<{ success: true; data: CurrentUser }>("auth/me/");
export const signOut = () => tokenStore.clear();
