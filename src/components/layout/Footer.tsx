import { ArrowUpRight, Facebook, Instagram, Linkedin, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/senzoft-wordmark-transparent.png";

const socials = [
  { label: "X", icon: <span aria-hidden="true">X</span>, href: "https://x.com/" },
  { label: "Facebook", icon: <Facebook size={19}/>, href: "https://facebook.com/" },
  { label: "LinkedIn", icon: <Linkedin size={19}/>, href: "https://linkedin.com/" },
  { label: "Instagram", icon: <Instagram size={19}/>, href: "https://instagram.com/" },
];

export function Footer() {
  return <footer className="enterprise-footer">
    <div className="container-shell footer-main footer-main-compact">
      <div className="footer-brand"><Link to="/" className="footer-logo-link" aria-label="SENZOFT home"><img className="footer-logo" src={logo} alt="SENZOFT"/></Link><p>Technology grounded in business context. Ideas engineered into useful, lasting impact.</p></div>
      <div className="footer-contact-details"><span className="footer-label">Contact</span><a href="mailto:hello@senzoft.com"><Mail size={18}/> hello@senzoft.com</a><p><MapPin size={18}/> India</p><Link to="/contact">Start a conversation <ArrowUpRight size={17}/></Link></div>
      <div className="footer-social-block"><span className="footer-label">Follow SENZOFT</span><div className="footer-socials">{socials.map(({label, icon, href}) => <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={`SENZOFT on ${label}`}>{icon}</a>)}</div></div>
    </div>
    <div className="footer-legal"><div className="container-shell"><p>© {new Date().getFullYear()} SENZOFT</p><nav aria-label="Legal"><Link to="/privacy-policy">Privacy</Link><Link to="/terms-of-use">Terms</Link><Link to="/accessibility">Accessibility</Link></nav></div></div>
  </footer>;
}
