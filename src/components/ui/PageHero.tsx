import { VideoPanel } from "./VideoPanel";
import type { MediaKey } from "../../content/media";
import { Reveal } from "./Reveal";
export function PageHero({
  eyebrow,
  title,
  description,
  media,
}: {
  eyebrow: string;
  title: string;
  description: string;
  media?: MediaKey;
}) {
  return (
    <section className="page-hero text-white pt-36 pb-16 md:pt-40 md:pb-20">
      <div
        className={`container-shell relative ${media ? "grid items-center gap-12 lg:grid-cols-[1.15fr_.85fr]" : ""}`}
      >
        <Reveal>
          <span className="eyebrow text-brand-amber!">{eyebrow}</span>
          <h1 className="display mt-6 max-w-4xl text-5xl md:text-7xl">
            {title}
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-brand-muted">
            {description}
          </p>
        </Reveal>
        {media && (
          <Reveal delay={0.15}>
            <VideoPanel clip={media} className="aspect-[4/3]" />
          </Reveal>
        )}
      </div>
    </section>
  );
}
