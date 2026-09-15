import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function CTA() {
  return <section className="cta-section">
    <div className="container-shell cta-card grid-lines text-white">
      <span className="eyebrow text-white!">Have a technology challenge?</span>
      <div className="cta-card-content">
        <h2 className="display">Let&apos;s build something<br/><span>that works for your business.</span></h2>
        <Link to="/contact" className="btn shrink-0 bg-white text-brand-ink hover:bg-brand-cream">Talk to our team <ArrowRight size={18}/></Link>
      </div>
    </div>
  </section>;
}
