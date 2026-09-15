import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useEffectsPaused } from "./MotionPreferences";

export function PageMotion() {
  const { pathname } = useLocation();
  const reduced = useEffectsPaused();
  const [showTop, setShowTop] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const motionFamily = pathname.split("/").filter(Boolean)[0] || "home";
    document.documentElement.dataset.motionFamily = motionFamily;
    const main = document.getElementById("main");
    main?.classList.remove("page-loaded");
    const frame = requestAnimationFrame(() => main?.classList.add("page-loaded"));
    return () => cancelAnimationFrame(frame);
  }, [pathname, reduced]);

  useEffect(() => {
    if (reduced || document.readyState === "complete") return;
    const slowTimer = window.setTimeout(() => setLoading(true), 900);
    const complete = () => { window.clearTimeout(slowTimer); setLoading(false); };
    window.addEventListener("load", complete, { once: true });
    return () => { window.clearTimeout(slowTimer); window.removeEventListener("load", complete); };
  }, [reduced]);

  useEffect(() => {
    let previous = window.scrollY;
    let ticking = false;
    const update = () => {
      const current = window.scrollY;
      const maximum = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      document.documentElement.style.setProperty("--scroll-progress", `${Math.min(1, current / maximum)}`);
      document.documentElement.dataset.scrollDirection = current > previous ? "down" : "up";
      setShowTop(current > 650);
      previous = current;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.documentElement.style.removeProperty("--scroll-progress");
    };
  }, []);

  return <>{loading && <div className="page-loader" aria-label="Loading page" role="status"><div className="loader-mark"><i/><i/><i/></div><span>Ideas to impact</span></div>}<button className={`scroll-to-top ${showTop ? "is-visible" : ""}`} type="button" aria-label="Scroll back to top" onClick={() => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })}><ArrowUp size={20}/><span>Top</span></button></>;
}
