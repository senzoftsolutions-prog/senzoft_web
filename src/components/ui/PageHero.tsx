import { VideoPanel } from "./VideoPanel";
import type { MediaKey } from "../../content/media";
import { Reveal } from "./Reveal";
import pexelsImages from "../../content/pexels-images.json";
type FieldImage = { src: string; srcSet: string; alt: string };
const fieldImages = pexelsImages as Record<string, FieldImage>;
export function PageHero({
  eyebrow,
  title,
  description,
  media,
  imageSlug,
}: {
  eyebrow: string;
  title: string;
  description: string;
  media?: MediaKey;
  imageSlug?: string;
}) {
  const image = imageSlug ? fieldImages[imageSlug] : undefined;
  const hasVisual = Boolean(image || media);
  return (
    <section className="reference-page-hero">
      <div
        className={`container-shell relative ${hasVisual ? "grid items-center gap-12 lg:grid-cols-[1.15fr_.85fr]" : ""}`}
      >
        <Reveal>
          <span className="reference-page-kicker">{eyebrow}</span>
          <h1 className="reference-page-title">{title}</h1>
          <p className="reference-page-description">{description}</p>
        </Reveal>
        {image ? (
          <Reveal delay={0.15}>
            <div className="reference-page-image">
              <img
                src={image.src}
                alt={image.alt}
                decoding="async"
              />
            </div>
          </Reveal>
        ) : media ? (
          <Reveal delay={0.15}>
            <VideoPanel clip={media} className="aspect-[4/3]" />
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
