const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1").replace(/\/$/, "");
const ACCESS_KEY = "senzoft-admin-access";
const REFRESH_KEY = "senzoft-admin-refresh";

export type ApiError = { success: false; error: { code: string; message: string; details?: unknown } };

export const tokenStore = {
  access: () => sessionStorage.getItem(ACCESS_KEY),
  refresh: () => sessionStorage.getItem(REFRESH_KEY),
  set: (access: string, refresh?: string) => {
    sessionStorage.setItem(ACCESS_KEY, access);
    if (refresh) sessionStorage.setItem(REFRESH_KEY, refresh);
  },
  clear: () => {
    sessionStorage.removeItem(ACCESS_KEY);
    sessionStorage.removeItem(REFRESH_KEY);
  },
};

async function refreshAccessToken() {
  const refresh = tokenStore.refresh();
  if (!refresh) return null;
  const response = await fetch(`${API_BASE_URL}/auth/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ refresh }),
  });
  if (!response.ok) {
    tokenStore.clear();
    return null;
  }
  const payload = (await response.json()) as { access: string; refresh?: string };
  tokenStore.set(payload.access, payload.refresh);
  return payload.access;
}

export async function apiRequest<T>(path: string, init: RequestInit = {}, token?: string, canRetry = true): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body && !(init.body instanceof FormData)) headers.set("Content-Type", "application/json");
  const access = token ?? tokenStore.access();
  if (access) headers.set("Authorization", `Bearer ${access}`);
  const response = await fetch(`${API_BASE_URL}/${path.replace(/^\//, "")}`, { ...init, headers });
  if (response.status === 401 && canRetry && access) {
    const refreshed = await refreshAccessToken();
    if (refreshed) return apiRequest<T>(path, init, refreshed, false);
  }
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const error = payload as ApiError | null;
    throw new Error(error?.error?.message ?? "The API request could not be completed.");
  }
  return payload as T;
}
