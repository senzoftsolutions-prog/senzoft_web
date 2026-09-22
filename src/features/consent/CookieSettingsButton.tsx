import { useConsent } from "./ConsentProvider";

export function CookieSettingsButton() {
  const { openPreferences } = useConsent();
  return <button type="button" className="footer-cookie-button" onClick={openPreferences}>Cookie Preferences</button>;
}

