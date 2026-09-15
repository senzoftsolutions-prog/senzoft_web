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
      const selectors = [
        "section:not(.reference-hero) .eyebrow",
        "section:not(.reference-hero) .section-heading",
        "section:not(.reference-hero) article",
        "section:not(.reference-hero) .offering-card",
        "section:not(.reference-hero) .content-card",
        "section:not(.reference-hero) .reference-contact-copy",
        "section:not(.reference-hero) .reference-contact-form",
        "section:not(.reference-hero) .video-panel",
        "section:not(.reference-hero) .section-intro > *",
        "section:not(.reference-hero) .readiness-list > label",
        "section:not(.reference-hero) .priority-tabs > button",
        "section:not(.reference-hero) .editorial-grid > *",
        "section:not(.reference-hero) .industry-directory > a",
        "section:not(.reference-hero) .delivery-chapters > article",
        "section:not(.reference-hero) .reference-listing-points > article",
        "section:not(.reference-hero) .architecture-grid > div",
        "section:not(.reference-hero) li",
        "section:not(.reference-hero) .detail-row",
        "section:not(.reference-hero) .studio-faq",
        "section:not(.reference-hero) table",
      ].join(",");
      main.querySelectorAll(selectors).forEach((element, index) => {
        if (
          observed.has(element) ||
          element.closest(".page-hero, .studio-hero, .careers-hero")
        )
          return;
        observed.add(element);
        (element as HTMLElement).style.setProperty("--reveal-delay", `${(index % 4) * 70}ms`);
        (element as HTMLElement).style.setProperty("--reveal-x", `${index % 2 ? 28 : -28}px`);
        const host = element.closest("section");
        (element as HTMLElement).dataset.reveal = element.classList.contains("content-card")
          ? "rise"
          : element.closest(".industry-directory")
            ? "sweep"
          : element.closest(".capability-explorer")
            ? "clip"
            : host?.className.includes("career")
              ? "mosaic"
              : element.closest(".architecture-grid")
                ? "connect"
                : ["rise", "turn", "focus", "unfold"][index % 4];
        if (element.getBoundingClientRect().top < window.innerHeight) return;
        element.classList.add("scroll-reveal-item");
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
        element.classList.remove("scroll-reveal-item", "scroll-entered"),
      );
    };
  }, [pathname, reduced]);
  return null;
}
