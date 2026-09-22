import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { CookieBanner } from "./CookieBanner";
import { CookiePreferences } from "./CookiePreferences";
import { acceptedChoices, FALLBACK_VERSION, makeIdentifier, readConsent, rejectedChoices, storeConsent } from "./consent";
import type { ConsentChoices, ConsentConfig, StoredConsent } from "./types";

type ConsentContextValue = { consent: StoredConsent | null; config: ConsentConfig | null; openPreferences: () => void; save: (choices: ConsentChoices) => void };
const ConsentContext = createContext<ConsentContextValue | null>(null);

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ConsentConfig | null>(null);
  const [consent, setConsent] = useState<StoredConsent | null>(() => readConsent());
  const [ready, setReady] = useState(false);
  const [managing, setManaging] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/v1/consent/config/", { headers: { Accept: "application/json" } })
      .then((response) => response.ok ? response.json() as Promise<ConsentConfig> : Promise.reject())
      .then((value) => { if (active) setConfig(value); })
      .catch(() => { /* Necessary-only fallback remains available during an API outage. */ })
      .finally(() => { if (active) setReady(true); });
    return () => { active = false; };
  }, []);

  const version = config?.version ?? FALLBACK_VERSION;
  const validConsent = consent?.version === version ? consent : null;
  const save = (choices: ConsentChoices) => {
    const value: StoredConsent = { ...choices, necessary: true, version, updatedAt: new Date().toISOString(), identifier: consent?.identifier ?? makeIdentifier() };
    storeConsent(value); setConsent(value); setManaging(false);
    void fetch("/api/v1/consent/", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ consent_identifier: value.identifier, functional: value.functional, analytics: value.analytics, marketing: value.marketing }) }).catch(() => undefined);
  };
  const context = { consent: validConsent, config, openPreferences: () => setManaging(true), save };
  return <ConsentContext.Provider value={context}>{children}{ready && !validConsent && !managing && <CookieBanner acceptAll={() => save(acceptedChoices)} rejectOptional={() => save(rejectedChoices)} manage={() => setManaging(true)} />}{managing && <CookiePreferences config={config} initial={validConsent ?? rejectedChoices} onClose={() => setManaging(false)} onSave={save} />}</ConsentContext.Provider>;
}

export function useConsent() {
  const value = useContext(ConsentContext);
  if (!value) throw new Error("useConsent must be used within ConsentProvider");
  return value;
}
