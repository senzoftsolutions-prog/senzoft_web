import { Link } from "react-router-dom";
import symbol from "../../assets/senzoft-symbol.png";
import wordmark from "../../assets/senzoft-wordmark-transparent.png";

export function PortalBrand({ to, label, dark = false }: { to: string; label: string; dark?: boolean }) {
  return <Link to={to} className={`portal-brand ${dark ? "portal-brand-dark" : ""}`} aria-label={label}>
    <img className="portal-brand-symbol" src={symbol} alt="" />
    <img className="portal-brand-wordmark" src={wordmark} alt="SENZOFT" />
    <span>{label.replace(/^SENZOFT\s*/i, "")}</span>
  </Link>;
}
