export type ConsentChoices = { necessary: true; functional: boolean; analytics: boolean; marketing: boolean };
export type StoredConsent = ConsentChoices & { version: string; updatedAt: string; identifier: string };
export type ConsentCategory = { id: string; key: keyof ConsentChoices; name: string; description: string; required: boolean; definitions: Array<{ id: string; name: string; provider: string; purpose: string; duration: string; storage_type: string }> };
export type ConsentConfig = { version: string; title: string; effective_at: string; categories: ConsentCategory[] };

