import type { ConsentChoices, StoredConsent } from "./types";

export const CONSENT_STORAGE_KEY = "senzoft-cookie-consent";
export const FALLBACK_VERSION = "1.0";
export const rejectedChoices: ConsentChoices = { necessary: true, functional: false, analytics: false, marketing: false };
export const acceptedChoices: ConsentChoices = { necessary: true, functional: true, analytics: true, marketing: true };

export function readConsent(): StoredConsent | null {
  try {
    const value = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!value || value === "accepted" || value === "declined") return null;
    const parsed = JSON.parse(value) as StoredConsent;
    return parsed.necessary === true && typeof parsed.version === "string" && typeof parsed.identifier === "string" ? parsed : null;
  } catch { return null; }
}

export function makeIdentifier() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function storeConsent(value: StoredConsent) {
  try { localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(value)); } catch { /* Browser storage can be disabled. */ }
}

export function canInitializeOptionalService(category: "functional" | "analytics" | "marketing", consent: StoredConsent | null) {
  return consent?.[category] === true;
}

