import { useState } from "react";
import { Link } from "react-router-dom";

type Consent = "accepted" | "declined";
export function CookieConsent() {
  const [choice, setChoice] = useState<Consent | null>(() => {
    try { return localStorage.getItem("senzoft-cookie-consent") as Consent | null; } catch { return null; }
  });
  const choose = (value: Consent) => {
    try { localStorage.setItem("senzoft-cookie-consent", value); } catch { /* storage may be disabled */ }
    setChoice(value);
  };
  if (choice) return null;
  return <aside className="cookie-banner" aria-label="Cookie preferences" role="dialog" aria-live="polite">
    <div><strong>Your privacy, your choice.</strong><p>We use essential cookies to run this website. Optional cookies help us understand and improve your experience. <Link to="/privacy-policy">Learn more</Link></p></div>
    <div className="cookie-actions"><button type="button" className="btn btn-outline" onClick={() => choose("declined")}>Decline</button><button type="button" className="btn btn-primary" onClick={() => choose("accepted")}>Accept cookies</button></div>
  </aside>;
}
