import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useEffectsPaused } from "./MotionPreferences";

export function ScrollReveal() {
  const { pathname } = useLocation();
  const reduced = useEffectsPaused();
  useEffect(() => {
    const main = document.getElementById("main");
    if (!main || reduced) return;
    const observed = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("scroll-entered");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -35px 0px", threshold: 0 },
    );
    const collect = () => {
      main.querySelectorAll("section > .container-shell").forEach((element) => {
        if (
          observed.has(element) ||
          element.closest(".page-hero, .studio-hero, .careers-hero")
        )
          return;
        observed.add(element);
        if (element.getBoundingClientRect().top < window.innerHeight) return;
        element.classList.add("scroll-enter");
        observer.observe(element);
      });
    };
    collect();
    const mutation = new MutationObserver(collect);
    mutation.observe(main, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      mutation.disconnect();
      observed.forEach((element) =>
        element.classList.remove("scroll-enter", "scroll-entered"),
      );
    };
  }, [pathname, reduced]);
  return null;
}
