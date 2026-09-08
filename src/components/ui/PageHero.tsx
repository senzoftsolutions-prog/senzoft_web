import { Reveal } from "./Reveal";
export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="bg-brand-plum grid-lines text-white pt-36 pb-20 md:pt-44 md:pb-28">
      <div className="container-shell">
        <Reveal>
          <span className="eyebrow text-brand-amber!">{eyebrow}</span>
          <h1 className="display mt-6 max-w-4xl text-5xl md:text-7xl">
            {title}
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-white/68">
            {description}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
