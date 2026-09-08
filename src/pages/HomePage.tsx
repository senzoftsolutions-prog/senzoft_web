import {
  ArrowRight,
  CheckCircle2,
  MoveDownRight,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ContentGrid } from "../components/sections/ContentGrid";
import { CTA } from "../components/sections/CTA";
import { Reveal } from "../components/ui/Reveal";
import { Seo } from "../components/ui/Seo";
import { contentRepository } from "../content/repository";

export default function HomePage() {
  const services = contentRepository.getServices();
  const industries = contentRepository.getIndustries();
  const insights = contentRepository.getInsights();
  return (
    <>
      <Seo
        title="SENZOFT | Software & IT Services"
        description="Software engineering, cloud, data, AI, cybersecurity and managed IT services for ambitious enterprises."
      />
      <section className="grid-lines relative min-h-[760px] overflow-hidden bg-brand-ink pt-32 text-white">
        <div className="absolute -right-32 top-10 size-150 rounded-full bg-brand-orange/12 blur-3xl" />
        <div className="container-shell relative grid min-h-[620px] items-center gap-12 py-14 lg:grid-cols-[1.2fr_.8fr]">
          <Reveal>
            <span className="eyebrow text-brand-amber!">
              Software · Cloud · Data · AI
            </span>
            <h1 className="display mt-7 text-6xl sm:text-7xl lg:text-[6.7rem]">
              Engineering the digital core of{" "}
              <span className="gradient-text">modern business.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-white/65">
              SENZOFT designs, builds, modernizes and manages software and
              technology platforms for ambitious Indian enterprises.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/contact" className="btn btn-primary">
                Talk to an expert <ArrowRight size={18} />
              </Link>
              <Link
                to="/services"
                className="btn border border-white/25 text-white"
              >
                Explore IT services
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="relative mx-auto aspect-square max-w-md">
              <div className="absolute inset-4 rotate-6 rounded-[3rem] border border-brand-orange/30 bg-white/4" />
              <div className="absolute inset-12 -rotate-3 rounded-[2.5rem] border border-white/15 bg-white/6 backdrop-blur">
                <Sparkles
                  className="absolute right-8 top-8 text-brand-amber"
                  size={38}
                />
                <div className="absolute bottom-9 left-9">
                  <p className="text-xs font-extrabold uppercase tracking-[.25em] text-brand-amber">
                    Ideas to Impact
                  </p>
                  <p className="mt-3 max-w-48 text-2xl font-bold">
                    Software engineered for change, scale and trust.
                  </p>
                </div>
              </div>
              <MoveDownRight
                className="absolute bottom-1 right-1 text-brand-orange"
                size={80}
              />
            </div>
          </Reveal>
        </div>
      </section>
      <section className="border-b border-black/10 bg-brand-cream py-8">
        <div className="container-shell grid gap-5 text-sm font-extrabold uppercase tracking-wider text-brand-muted sm:grid-cols-2 lg:grid-cols-4">
          {[
            "Application engineering",
            "Cloud modernization",
            "Data & AI",
            "Cybersecurity",
          ].map((item) => (
            <div className="flex items-center gap-3" key={item}>
              <CheckCircle2 size={18} className="text-brand-orange" />
              {item}
            </div>
          ))}
        </div>
      </section>
      <section className="section">
        <div className="container-shell">
          <Reveal>
            <span className="eyebrow">Technology services</span>
            <div className="mt-6 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <h2 className="display max-w-3xl text-5xl md:text-6xl">
                End-to-end expertise for your{" "}
                <span className="gradient-text">digital enterprise.</span>
              </h2>
              <Link to="/services" className="font-extrabold text-brand-orange">
                View all services →
              </Link>
            </div>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-brand-muted">
              From advisory and architecture to engineering, assurance and
              operations, SENZOFT helps technology deliver sustained business
              value.
            </p>
          </Reveal>
          <div className="mt-12">
            <ContentGrid items={services} basePath="/services" />
          </div>
        </div>
      </section>
      <section className="section bg-brand-cream">
        <div className="container-shell">
          <Reveal>
            <span className="eyebrow">Industry solutions</span>
            <h2 className="display mt-6 max-w-3xl text-5xl md:text-6xl">
              Technology grounded in business context.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-brand-muted">
              We connect modern technology capabilities with the operating
              realities of your sector.
            </p>
          </Reveal>
          <div className="mt-12">
            <ContentGrid items={industries} basePath="/industries" />
          </div>
        </div>
      </section>
      <section className="section bg-brand-ink text-white">
        <div className="container-shell">
          <span className="eyebrow text-brand-amber!">Technology insights</span>
          <div className="mt-6 flex items-end justify-between">
            <h2 className="display text-5xl">Ideas for the work ahead.</h2>
            <Link
              to="/insights"
              className="hidden font-bold text-brand-amber sm:block"
            >
              View all insights →
            </Link>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {insights.map((item) => (
              <Link
                key={item.slug}
                to={`/insights/${item.slug}`}
                className="group border-t border-white/20 py-7"
              >
                <span className="text-xs font-bold text-brand-amber">
                  {item.type} · {item.readTime}
                </span>
                <h3 className="mt-5 text-2xl font-bold group-hover:text-brand-amber">
                  {item.title}
                </h3>
                <p className="mt-4 leading-7 text-white/55">{item.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
