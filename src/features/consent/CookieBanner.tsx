import { Link } from "react-router-dom";

export function CookieBanner({ acceptAll, rejectOptional, manage }: { acceptAll: () => void; rejectOptional: () => void; manage: () => void }) {
  return <aside className="cookie-banner" aria-label="Cookie consent" role="dialog" aria-live="polite"><div><strong>Your privacy, your choice.</strong><p>Necessary browser storage keeps the website and secure sign-in working. Optional categories remain off until you choose them. <Link to="/privacy-policy">Learn more</Link></p></div><div className="cookie-actions"><button type="button" className="btn btn-outline" onClick={rejectOptional}>Reject optional</button><button type="button" className="btn btn-outline" onClick={manage}>Manage cookies</button><button type="button" className="btn btn-primary" onClick={acceptAll}>Accept all</button></div></aside>;
}

