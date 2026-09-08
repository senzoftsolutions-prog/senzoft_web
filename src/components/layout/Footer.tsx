import { ArrowUpRight, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/senzoft-logo.png";

export function Footer() {
  return (
    <footer className="bg-brand-ink text-white">
      <div className="container-shell grid gap-12 py-16 md:grid-cols-[1.4fr_2fr]">
        <div>
          <img
            src={logo}
            alt="SENZOFT Software Solutions Private Limited"
            className="h-28 w-auto rounded-xl bg-white p-2"
          />
          <p className="mt-5 max-w-sm text-white/60">
            Ideas to Impact. We bring engineering, intelligence and business
            context together to create technology that matters.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div>
            <p className="mb-4 font-bold text-brand-amber">Explore</p>
            <Link className="mb-3 block text-sm text-white/65" to="/services">
              Services
            </Link>
            <Link className="mb-3 block text-sm text-white/65" to="/industries">
              Industries
            </Link>
            <Link className="mb-3 block text-sm text-white/65" to="/insights">
              Insights
            </Link>
          </div>
          <div>
            <p className="mb-4 font-bold text-brand-amber">Company</p>
            <Link className="mb-3 block text-sm text-white/65" to="/about">
              About
            </Link>
            <Link className="mb-3 block text-sm text-white/65" to="/careers">
              Careers
            </Link>
            <Link className="mb-3 block text-sm text-white/65" to="/contact">
              Contact
            </Link>
          </div>
          <div>
            <p className="mb-4 font-bold text-brand-amber">Connect</p>
            <a
              className="mb-3 flex items-center gap-2 text-sm text-white/65"
              href="mailto:hello@senzoft.com"
            >
              hello@senzoft.com <ArrowUpRight size={14} />
            </a>
            <a
              aria-label="LinkedIn"
              className="inline-flex p-2 text-white/65"
              href="#"
            >
              <Linkedin size={19} />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-shell flex flex-col gap-3 py-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} SENZOFT Software Solutions Private
            Limited.
          </p>
          <div className="flex gap-5">
            <Link to="/privacy-policy">Privacy</Link>
            <Link to="/terms-of-use">Terms</Link>
            <Link to="/accessibility">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
