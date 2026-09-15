import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

const tones = {
  light: "",
  cream: "bg-brand-cream",
  sage: "bg-brand-sage",
  peach: "bg-brand-peach",
  ink: "bg-brand-ink text-white",
  wine: "bg-brand-wine text-white",
} as const;

export function Section({ tone = "light", eyebrow, heading, description, children, className = "", id }: {
  tone?: keyof typeof tones; eyebrow?: string; heading?: string; description?: string;
  children: ReactNode; className?: string; id?: string;
}) {
  const dark = tone === "ink" || tone === "wine";
  return <section id={id} className={`section ${tones[tone]} ${className}`}><div className="container-shell">
    {(eyebrow || heading || description) && <Reveal className="section-intro"><div>{eyebrow && <span className={`eyebrow ${dark ? "text-brand-amber!" : ""}`}>{eyebrow}</span>}{heading && <h2 className="section-heading mt-5">{heading}</h2>}</div>{description && <p className={dark ? "text-white/70" : "text-brand-muted"}>{description}</p>}</Reveal>}
    {children}
  </div></section>;
}
