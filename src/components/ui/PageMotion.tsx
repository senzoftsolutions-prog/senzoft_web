import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useEffectsPaused } from "./MotionPreferences";

export function PageMotion() {
  const reduced = useEffectsPaused();
  const [showTop, setShowTop] = useState(false);

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

  return <button className={`scroll-to-top ${showTop ? "is-visible" : ""}`} type="button" aria-label="Scroll back to top" onClick={() => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })}><ArrowUp size={20}/><span>Top</span></button>;
}
