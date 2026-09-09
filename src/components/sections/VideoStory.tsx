import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Reveal } from "../ui/Reveal";
import { VideoPanel } from "../ui/VideoPanel";
import type { MediaKey } from "../../content/media";
export function VideoStory({
  clip = "collaboration",
  eyebrow = "People. Perspective. Progress.",
  title = "Great technology starts with a shared understanding.",
  description = "Bring business and engineering into the same conversation. Explore the problem, test the assumptions and turn a useful first step into a foundation for lasting change.",
  href = "/about",
  linkLabel = "Meet our approach",
}: {
  clip?: MediaKey;
  eyebrow?: string;
  title?: string;
  description?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <section className="section bg-brand-cream">
      <div className="container-shell grid items-center gap-10 lg:grid-cols-2">
        <Reveal>
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="display mt-6 text-4xl md:text-6xl">{title}</h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-brand-muted">
            {description}
          </p>
          <Link
            to={href}
            className="mt-8 inline-flex items-center gap-3 font-bold text-brand-orange"
          >
            {linkLabel}
            <ArrowUpRight size={18} />
          </Link>
        </Reveal>
        <Reveal delay={0.12}>
          <VideoPanel clip={clip} className="aspect-[4/3]" />
        </Reveal>
      </div>
    </section>
  );
}
