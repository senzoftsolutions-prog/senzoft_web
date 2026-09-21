import { ArrowRight, ChevronDown, Menu, Search, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/senzoft-wordmark-transparent.png";
import symbol from "../../assets/senzoft-symbol.png";
import { contentRepository } from "../../content/repository";
import { featuredServices, technologyAreas } from "../../content/presentation";

const MENU_TIMING = { open: 80, close: 190 } as const;
type MenuKey = "services" | "industries" | "technology";
type MenuItem = { title: string; summary: string; href: string };
type NavigationItem = { label: string; path: string; menu?: MenuKey };

const navigation: NavigationItem[] = [
  { label: "Services", path: "/services", menu: "services" },
  { label: "Industries", path: "/industries", menu: "industries" },
  { label: "Technology", path: "/technology", menu: "technology" },
  { label: "Case Studies", path: "/case-studies" },
  { label: "Insights", path: "/insights" },
  { label: "About", path: "/about" },
  { label: "Careers", path: "/careers" },
  { label: "Contact", path: "/contact" },
];

const menuContent: Record<MenuKey, { eyebrow: string; description: string; items: MenuItem[] }> = {
  services: { eyebrow: "What we do", description: "Connected strategy, engineering and operations for meaningful business outcomes.", items: featuredServices.map((item) => ({ title: item.title, summary: item.summary, href: `/services/${item.slug}` })) },
  industries: { eyebrow: "Where we work", description: "Technology capabilities shaped around the realities of each operating environment.", items: contentRepository.getIndustries().map((item) => ({ title: item.title, summary: item.summary, href: `/industries/${item.slug}` })) },
  technology: { eyebrow: "How we build", description: "Modern platforms, data and engineering practices chosen for durable value.", items: technologyAreas.map((item) => ({ title: item.title, summary: item.summary, href: `/technology/${item.slug}` })) },
};

export function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<MenuKey | null>(null);
  const [activeMenu, setActiveMenu] = useState<MenuKey | null>(null);
  const [intentMenu, setIntentMenu] = useState<MenuKey | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressFocusOpen = useRef(false);
  const keyboardNavigation = useRef(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const drawer = useRef<HTMLElement>(null);
  const mobileLayer = useRef<HTMLDivElement>(null);
  const navigationShell = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<Record<MenuKey, HTMLButtonElement | null>>({ services: null, industries: null, technology: null });
  const { pathname } = useLocation();

  const clearTimers = useCallback(() => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    openTimer.current = null;
    closeTimer.current = null;
  }, []);
  const closeNavigation = useCallback((restoreFocus = false) => {
    clearTimers(); setIntentMenu(null); setActiveMenu(null); setDrawerOpen(false); setExpandedMobileMenu(null);
    if (restoreFocus) requestAnimationFrame(() => menuButton.current?.focus());
  }, [clearTimers]);
  const requestOpen = (menu: MenuKey) => {
    clearTimers();
    if (activeMenu) { setActiveMenu(menu); return; }
    setIntentMenu(menu);
    openTimer.current = setTimeout(() => { setActiveMenu(menu); setIntentMenu(null); openTimer.current = null; }, MENU_TIMING.open);
  };
  const requestClose = () => {
    clearTimers();
    setIntentMenu(null);
    if (activeMenu) closeTimer.current = setTimeout(() => setActiveMenu(null), MENU_TIMING.close);
  };
  const cancelClose = () => { if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; } };

  useEffect(() => closeNavigation(), [pathname, closeNavigation]);
  useEffect(() => () => clearTimers(), [clearTimers]);
  useEffect(() => {
    let ticking = false;
    const onScroll = () => { if (!ticking) requestAnimationFrame(() => { setIsScrolled(window.scrollY > 24); ticking = false; }); ticking = true; };
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (!activeMenu && !drawerOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!navigationShell.current?.contains(target) && !mobileLayer.current?.contains(target)) closeNavigation();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const menu = activeMenu; closeNavigation(drawerOpen);
      if (menu) {
        suppressFocusOpen.current = true;
        triggerRefs.current[menu]?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown); document.addEventListener("keydown", onKeyDown);
    return () => { document.removeEventListener("pointerdown", onPointerDown); document.removeEventListener("keydown", onKeyDown); };
  }, [activeMenu, drawerOpen, closeNavigation]);
  useEffect(() => {
    if (!drawerOpen) return;
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    requestAnimationFrame(() => drawer.current?.querySelector<HTMLElement>(".mobile-nav-head button")?.focus());
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !drawer.current) return;
      const focusable = [...drawer.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]):not([tabindex="-1"])')];
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", trapFocus);
    return () => { document.body.style.overflow = previousOverflow; document.body.style.paddingRight = previousPadding; document.removeEventListener("keydown", trapFocus); };
  }, [drawerOpen]);

  const renderedMenu = activeMenu ?? intentMenu;
  const menu = renderedMenu ? menuContent[renderedMenu] : null;
  return <header className={`site-header pointer-events-none fixed inset-x-0 top-0 z-50 ${isScrolled ? "is-scrolled" : ""}`}>
    <a className="skip-link pointer-events-auto" href="#main">Skip to content</a>
    <div className={`navigation-shell container-shell relative pt-3 md:pt-4 ${activeMenu ? "menu-open" : ""} ${intentMenu ? "menu-intent" : ""}`} ref={navigationShell} onPointerEnter={cancelClose} onPointerLeave={(event) => { if (event.pointerType === "mouse" && !(keyboardNavigation.current && navigationShell.current?.contains(document.activeElement))) requestClose(); }} onPointerDown={() => { keyboardNavigation.current = false; }} onKeyDownCapture={() => { keyboardNavigation.current = true; }} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) requestClose(); }}>
      <div className="responsive-header pointer-events-auto flex min-h-12 items-center gap-2 rounded-[1.1rem] border border-black/8 bg-white/92 px-2.5 shadow-[0_16px_45px_rgba(21,27,33,.14)] backdrop-blur-xl md:rounded-full md:px-3">
        <Link to="/" aria-label="SENZOFT home" className="header-brand flex shrink-0 items-center gap-2" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><img src={symbol} alt="" className="header-symbol" width="32" height="32" aria-hidden="true" /><img src={logo} alt="SENZOFT" className="header-logo" width="142" height="32" /></Link>
        <nav className="header-primary mx-auto flex items-center rounded-full bg-brand-cream px-2 py-1.5" aria-label="Primary" onKeyDown={(event) => {
          if (!activeMenu || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
          event.preventDefault(); const menus: MenuKey[] = ["services", "industries", "technology"];
          const next = menus[(menus.indexOf(activeMenu) + (event.key === "ArrowRight" ? 1 : -1) + menus.length) % menus.length];
          setIntentMenu(null); setActiveMenu(next); triggerRefs.current[next]?.focus();
        }}>
          {navigation.map((item) => item.menu ? <div className={`header-nav-item has-mega ${activeMenu === item.menu ? "mega-open" : ""}`} key={item.path} onPointerEnter={(event) => { if (event.pointerType === "mouse") requestOpen(item.menu!); }}>
            <button ref={(node) => { triggerRefs.current[item.menu!] = node; }} type="button" className="nav-menu-trigger" aria-expanded={activeMenu === item.menu} aria-controls="desktop-mega-menu" aria-haspopup="true" onPointerDown={() => { suppressFocusOpen.current = true; }} onClick={(event) => { suppressFocusOpen.current = false; clearTimers(); setIntentMenu(null); setActiveMenu(event.detail === 0 || activeMenu !== item.menu ? item.menu! : null); }} onKeyDown={(event) => { if (event.key === "ArrowDown") { event.preventDefault(); clearTimers(); setIntentMenu(null); setActiveMenu(item.menu!); requestAnimationFrame(() => navigationShell.current?.querySelector<HTMLAnchorElement>("#desktop-mega-menu a")?.focus()); } }} onFocus={() => { if (suppressFocusOpen.current) { suppressFocusOpen.current = false; return; } clearTimers(); setIntentMenu(null); setActiveMenu(item.menu!); }}>{item.label}<ChevronDown size={14} aria-hidden="true" /></button>
          </div> : <NavLink key={item.path} to={item.path} onPointerEnter={(event) => { if (event.pointerType === "mouse") closeNavigation(); }} onFocus={() => closeNavigation()} className={({ isActive }) => `header-direct-link ${isActive ? "active" : ""}`}>{item.label}</NavLink>)}
        </nav>
        <div className="header-search ml-auto flex items-center gap-2 lg:ml-0"><Link aria-label="Search SENZOFT" to="/search" className="grid size-9 place-items-center rounded-full border border-black/10 transition hover:border-brand-orange hover:text-brand-orange"><Search size={19} /></Link></div>
        <button ref={menuButton} type="button" className="mobile-nav-trigger" aria-label="Open navigation" aria-expanded={drawerOpen} aria-controls="mobile-navigation" onClick={() => setDrawerOpen(true)}><Menu size={22} /></button>
      </div>
      <div id="desktop-mega-menu" className={`enterprise-mega-menu pointer-events-auto ${activeMenu ? "is-open" : intentMenu ? "is-pending" : ""}`} aria-hidden={!activeMenu} onPointerEnter={cancelClose}>
        {menu && <div className="enterprise-mega-inner" key={renderedMenu}><div className="mega-intro"><span>{menu.eyebrow}</span><h2>{navigation.find((item) => item.menu === renderedMenu)?.label}</h2><p>{menu.description}</p><Link to={`/${renderedMenu}`} tabIndex={activeMenu ? 0 : -1}>Explore all <ArrowRight size={16} /></Link></div><div className="enterprise-mega-grid">{menu.items.map((item, index) => <Link to={item.href} key={item.href} tabIndex={activeMenu ? 0 : -1} style={{ "--menu-index": index } as CSSProperties}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{item.title}</strong><small>{item.summary}</small></div><ArrowRight size={16} aria-hidden="true" /></Link>)}</div></div>}
      </div>
    </div>
    <button className={`desktop-menu-backdrop ${activeMenu ? "is-open" : ""}`} type="button" aria-label="Close menu" tabIndex={activeMenu ? 0 : -1} onClick={() => closeNavigation()} />
    <div ref={mobileLayer} className={`mobile-nav-layer ${drawerOpen ? "is-open" : ""}`} aria-hidden={!drawerOpen} onPointerDown={(event) => event.stopPropagation()}><button className="mobile-nav-backdrop" aria-label="Close navigation" tabIndex={drawerOpen ? 0 : -1} onClick={() => closeNavigation(true)} /><aside ref={drawer} id="mobile-navigation" className="mobile-nav-drawer" aria-label="Mobile navigation" aria-modal="true" role="dialog">
      <div className="mobile-nav-head"><Link to="/" className="mobile-nav-brand" aria-label="SENZOFT home" tabIndex={drawerOpen ? 0 : -1}><img className="mobile-nav-symbol" src={symbol} alt="" width="36" height="36" aria-hidden="true" /><img className="mobile-nav-wordmark" src={logo} alt="SENZOFT" width="176" height="36" /></Link><button type="button" aria-label="Close navigation" onClick={() => closeNavigation(true)}><X size={22}/></button></div>
      <nav aria-label="Mobile primary">{navigation.map((item) => {
        if (!item.menu) return <NavLink key={item.path} to={item.path} tabIndex={drawerOpen ? 0 : -1}>{item.label}<ArrowRight size={16} aria-hidden="true" /></NavLink>;
        const expanded = expandedMobileMenu === item.menu;
        return <div className={`mobile-nav-group ${expanded ? "is-expanded" : ""}`} key={item.path}><button type="button" className="mobile-nav-parent" aria-expanded={expanded} aria-controls={`mobile-${item.menu}`} onClick={() => setExpandedMobileMenu(expanded ? null : item.menu!)} tabIndex={drawerOpen ? 0 : -1}>{item.label}<ChevronDown size={19} aria-hidden="true" /></button><div id={`mobile-${item.menu}`} className="mobile-nav-submenu" aria-hidden={!expanded}><div><Link to={item.path} tabIndex={drawerOpen && expanded ? 0 : -1}>View all {item.label}<ArrowRight size={15} /></Link>{menuContent[item.menu].items.map((entry) => <Link to={entry.href} key={entry.href} tabIndex={drawerOpen && expanded ? 0 : -1}>{entry.title}<ArrowRight size={15} /></Link>)}</div></div></div>;
      })}</nav><Link className="btn btn-primary mobile-nav-cta" to="/contact" tabIndex={drawerOpen ? 0 : -1}>Start a conversation</Link><Link className="mobile-nav-search" to="/search" tabIndex={drawerOpen ? 0 : -1}><Search size={19}/> Search SENZOFT</Link>
    </aside></div>
  </header>;
}
