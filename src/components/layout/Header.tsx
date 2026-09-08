import { ArrowUpRight, Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import symbol from "../../assets/senzoft-symbol.png";
import { contentRepository } from "../../content/repository";

const links = [
  ["Services", "/services"],
  ["Industries", "/industries"],
  ["Insights", "/insights"],
  ["About", "/about"],
  ["Careers", "/careers"],
];
const serviceLinks = contentRepository
  .getServices()
  .map((service) => [service.title, `/services/${service.slug}`]);

export function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 bg-transparent">
      <a className="skip-link pointer-events-auto" href="#main">
        Skip to content
      </a>
      <div className="container-shell relative pt-3 md:pt-4">
        <div className="pointer-events-auto flex min-h-18 items-center gap-3 rounded-[1.4rem] border border-black/8 bg-white/92 px-3 shadow-[0_16px_45px_rgba(21,27,33,.14)] backdrop-blur-xl md:rounded-full md:px-4">
          <button
            className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-cream transition hover:bg-brand-orange hover:text-white"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
          <Link
            to="/"
            aria-label="SENZOFT home"
            className="flex shrink-0 items-center gap-2"
          >
            <img src={symbol} alt="" className="size-11 object-contain" />
            <span className="hidden font-display text-xl font-black tracking-[-.06em] text-brand-ink sm:block">
              SEN<span className="text-brand-orange">ZOFT</span>
            </span>
          </Link>
          <nav
            className="mx-auto hidden items-center rounded-full bg-brand-cream px-2 py-1.5 lg:flex"
            aria-label="Primary"
          >
            {links.map(([label, path]) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-bold transition ${isActive ? "bg-white text-brand-orange shadow-sm" : "text-brand-ink hover:text-brand-orange"}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Link
              aria-label="Search SENZOFT"
              to="/search"
              className="grid size-11 place-items-center rounded-full border border-black/10 transition hover:border-brand-orange hover:text-brand-orange"
            >
              <Search size={19} />
            </Link>
            <Link to="/contact" className="btn btn-dark hidden sm:inline-flex">
              Talk to us <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
        {open && (
          <div
            id="site-menu"
            className="pointer-events-auto absolute left-0 right-0 top-[5.8rem] overflow-hidden rounded-[1.5rem] border border-black/8 bg-white p-5 shadow-[0_22px_60px_rgba(21,27,33,.18)] md:p-7"
          >
            <div className="grid gap-7 lg:grid-cols-[.7fr_1.3fr]">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[.2em] text-brand-orange">
                  Explore SENZOFT
                </p>
                <nav
                  className="mt-4 grid sm:grid-cols-2 lg:grid-cols-1"
                  aria-label="Expanded navigation"
                >
                  {links.map(([label, path]) => (
                    <NavLink
                      key={path}
                      to={path}
                      className="border-b border-black/8 py-3 text-xl font-bold transition hover:pl-2 hover:text-brand-orange"
                    >
                      {label}
                    </NavLink>
                  ))}
                </nav>
              </div>
              <div className="rounded-2xl bg-brand-peach p-6 text-brand-ink">
                <p className="text-xs font-extrabold uppercase tracking-[.2em] text-brand-amber">
                  Featured capabilities
                </p>
                <div className="mt-4 grid gap-px overflow-hidden rounded-xl bg-brand-orange/15 sm:grid-cols-2 lg:grid-cols-3">
                  {serviceLinks.map(([label, path]) => (
                    <Link
                      className="flex items-center justify-between bg-white p-4 text-sm font-bold transition hover:bg-brand-orange hover:text-white"
                      key={path}
                      to={path}
                    >
                      {label}
                      <ArrowUpRight size={16} />
                    </Link>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link to="/contact" className="btn btn-primary">
                    Start a conversation
                  </Link>
                  <Link
                    to="/search"
                    className="btn border border-brand-ink/20 text-brand-ink"
                  >
                    <Search size={17} /> Search
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
