import { ChevronDown, Menu, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/senzoft-wordmark-transparent.png";
import symbol from "../../assets/senzoft-symbol.png";
import { contentRepository } from "../../content/repository";
import { featuredServices, technologyAreas } from "../../content/presentation";

const links = [
  ["Services", "/services"],
  ["Industries", "/industries"],
  ["Technology", "/technology"],
  ["Case Studies", "/case-studies"],
  ["Insights", "/insights"],
  ["About", "/about"],
  ["Careers", "/careers"],
  ["Contact", "/contact"],
];

const megaMenus: Record<string, Array<[string, string]>> = {
  "/services": featuredServices.map((item) => [item.title, `/services/${item.slug}`]),
  "/industries": contentRepository.getIndustries().map((item) => [item.title, `/industries/${item.slug}`]),
  "/technology": technologyAreas.map((item) => [item.title, `/technology/${item.slug}`]),
};

export function Header() {
  const [open, setOpen] = useState(false);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const closeMenuTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
    setExpandedMobileMenu(null);
    setActiveMenu(null);
    if (closeMenuTimer.current) clearTimeout(closeMenuTimer.current);
    const active = document.activeElement;
    if (active instanceof HTMLElement && active.closest(".mega-menu")) active.blur();
  }, [pathname]);
  useEffect(() => () => {
    if (closeMenuTimer.current) clearTimeout(closeMenuTimer.current);
  }, []);

  const showMegaMenu = (path: string) => {
    if (closeMenuTimer.current) clearTimeout(closeMenuTimer.current);
    setActiveMenu(path);
  };
  const scheduleMegaMenuClose = () => {
    if (closeMenuTimer.current) clearTimeout(closeMenuTimer.current);
    closeMenuTimer.current = setTimeout(() => setActiveMenu(null), 140);
  };
  const goHome = () => {
    setOpen(false);
    setExpandedMobileMenu(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", escape);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 bg-transparent">
      <a className="skip-link pointer-events-auto" href="#main">
        Skip to content
      </a>
      <div className="container-shell relative pt-3 md:pt-4">
        <div className="responsive-header pointer-events-auto flex min-h-12 items-center gap-2 rounded-[1.1rem] border border-black/8 bg-white/92 px-2.5 shadow-[0_16px_45px_rgba(21,27,33,.14)] backdrop-blur-xl md:rounded-full md:px-3">
          <Link
            to="/"
            aria-label="SENZOFT home"
            className="header-brand flex shrink-0 items-center gap-2"
            onClick={goHome}
          >
            <img src={symbol} alt="" className="header-symbol" aria-hidden="true" />
            <img src={logo} alt="SENZOFT" className="header-logo" />
          </Link>
          <nav
            className="header-primary mx-auto flex items-center rounded-full bg-brand-cream px-2 py-1.5"
            aria-label="Primary"
          >
            {links.map(([label, path]) => (
              <div
                className={`header-nav-item ${megaMenus[path] ? "has-mega" : ""} ${activeMenu === path ? "mega-open" : ""}`}
                onMouseEnter={() => megaMenus[path] && showMegaMenu(path)}
                onMouseLeave={scheduleMegaMenuClose}
                onFocus={() => megaMenus[path] && showMegaMenu(path)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) scheduleMegaMenuClose();
                }}
                key={path}
              >
              <NavLink
                to={path}
                end={path === "/"}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-bold transition ${isActive ? "bg-white text-brand-orange shadow-sm" : "text-brand-ink hover:text-brand-orange"}`
                }
              >
                {label}
              </NavLink>
              {megaMenus[path] && <div className="mega-menu"><div className="mega-menu-head"><span>All {label}</span><small>{megaMenus[path].length} topics</small></div><div className="mega-menu-grid">{megaMenus[path].map(([title, href], index) => <Link to={href} onClick={() => setActiveMenu(null)} key={href}><span>{String(index + 1).padStart(2, "0")}</span><strong>{title}</strong></Link>)}</div></div>}
              </div>
            ))}
          </nav>
          <div className="header-search ml-auto flex items-center gap-2 lg:ml-0">
            <Link
              aria-label="Search SENZOFT"
              to="/search"
              className="grid size-9 place-items-center rounded-full border border-black/10 transition hover:border-brand-orange hover:text-brand-orange"
            >
              <Search size={19} />
            </Link>
          </div>
          <button ref={menuButton} type="button" className="mobile-nav-trigger" aria-label="Open navigation" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(true)}>
            <Menu size={22} />
          </button>
        </div>
      </div>
      <div className={`mobile-nav-layer ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <button className="mobile-nav-backdrop" aria-label="Close navigation" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)} />
        <aside id="mobile-navigation" className="mobile-nav-drawer" aria-label="Mobile navigation">
          <div className="mobile-nav-head">
            <Link to="/" className="mobile-nav-brand" aria-label="SENZOFT home" tabIndex={open ? 0 : -1} onClick={goHome}>
              <img src={logo} alt="SENZOFT" />
            </Link>
            <button ref={closeButton} type="button" aria-label="Close navigation" onClick={() => setOpen(false)}><X size={22}/></button>
          </div>
          <nav aria-label="Mobile primary">
            {links.map(([label, path]) => {
              const submenu = megaMenus[path];
              if (!submenu) {
                return <NavLink key={path} to={path} end={path === "/"} tabIndex={open ? 0 : -1}>{label}<span aria-hidden="true">→</span></NavLink>;
              }
              const expanded = expandedMobileMenu === path;
              return (
                <div className={`mobile-nav-group ${expanded ? "is-expanded" : ""}`} key={path}>
                  <button
                    type="button"
                    className="mobile-nav-parent"
                    aria-expanded={expanded}
                    onClick={() => setExpandedMobileMenu(expanded ? null : path)}
                    tabIndex={open ? 0 : -1}
                  >
                    {label}
                    <ChevronDown size={19} aria-hidden="true" />
                  </button>
                  <div className="mobile-nav-submenu" hidden={!expanded}>
                    <Link to={path} onClick={() => setOpen(false)} tabIndex={open && expanded ? 0 : -1}>View all {label}<span aria-hidden="true">→</span></Link>
                    {submenu.map(([title, href]) => <Link to={href} onClick={() => setOpen(false)} key={href} tabIndex={open && expanded ? 0 : -1}>{title}<span aria-hidden="true">→</span></Link>)}
                  </div>
                </div>
              );
            })}
          </nav>
          <Link className="btn btn-primary mobile-nav-cta" to="/contact" tabIndex={open ? 0 : -1}>Start a conversation</Link>
          <Link className="mobile-nav-search" to="/search" tabIndex={open ? 0 : -1}><Search size={19}/> Search SENZOFT</Link>
        </aside>
      </div>
    </header>
  );
}
