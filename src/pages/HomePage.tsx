import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Cloud,
  CodeXml,
  Database,
  Layers3,
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
      <section className="grid-lines relative min-h-[760px] overflow-hidden bg-brand-plum pt-32 text-white">
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
      <section className="section overflow-hidden bg-brand-wine text-white">
        <div className="container-shell grid items-stretch gap-6 lg:grid-cols-[1.15fr_.85fr]">
          <Reveal className="rounded-[2rem] border border-white/10 bg-white/4 p-8 md:p-12">
            <span className="eyebrow text-brand-amber!">
              Featured perspective
            </span>
            <p className="mt-8 text-sm font-bold uppercase tracking-[.2em] text-white/45">
              Enterprise AI
            </p>
            <h2 className="display mt-4 max-w-3xl text-5xl md:text-7xl">
              Move AI from isolated experiments into{" "}
              <span className="gradient-text">everyday value.</span>
            </h2>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/60">
              Sustainable AI begins with trusted data, fit-for-purpose
              architecture, responsible controls and workflows designed for
              adoption.
            </p>
            <Link
              to="/services/data-ai"
              className="mt-9 inline-flex items-center gap-2 font-extrabold text-brand-amber"
            >
              Explore Data & AI <ArrowUpRight size={18} />
            </Link>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            <Reveal className="rounded-[2rem] bg-brand-orange p-8 text-white md:p-10">
              <p className="text-xs font-extrabold uppercase tracking-[.2em] text-white/75">
                Modernize the core
              </p>
              <h3 className="display mt-5 text-4xl">
                Renew applications without losing momentum.
              </h3>
              <Link
                to="/services/application-modernization"
                className="mt-8 inline-flex items-center gap-2 font-bold"
              >
                Explore modernization <ArrowUpRight size={18} />
              </Link>
            </Reveal>
            <Reveal className="rounded-[2rem] bg-white p-8 text-brand-ink md:p-10">
              <p className="text-xs font-extrabold uppercase tracking-[.2em] text-brand-orange">
                Secure by design
              </p>
              <h3 className="display mt-5 text-4xl">
                Make trust part of the architecture.
              </h3>
              <Link
                to="/services/cybersecurity"
                className="mt-8 inline-flex items-center gap-2 font-bold"
              >
                Explore cybersecurity <ArrowUpRight size={18} />
              </Link>
            </Reveal>
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
      <section className="section">
        <div className="container-shell">
          <Reveal>
            <span className="eyebrow">From strategy to operations</span>
            <h2 className="display mt-6 max-w-4xl text-5xl md:text-6xl">
              One connected technology journey.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-brand-muted">
              Engage SENZOFT at one stage or across the lifecycle. We keep
              business intent connected to architecture, engineering and
              continuous improvement.
            </p>
          </Reveal>
          <div className="mt-12 grid overflow-hidden rounded-[2rem] border border-black/10 md:grid-cols-2 lg:grid-cols-4">
            {[
              [
                "01",
                "Advise",
                "Clarify priorities, assess the landscape and shape an actionable roadmap.",
                Layers3,
              ],
              [
                "02",
                "Engineer",
                "Design and build secure applications, platforms and digital experiences.",
                CodeXml,
              ],
              [
                "03",
                "Modernize",
                "Renew applications, cloud foundations and enterprise data with control.",
                Cloud,
              ],
              [
                "04",
                "Operate",
                "Support, observe and continuously improve business-critical technology.",
                Database,
              ],
            ].map(([number, title, text, Icon]) => {
              const ItemIcon = Icon as typeof Layers3;
              return (
                <div
                  className="border-b border-black/10 p-7 last:border-0 md:border-r lg:border-b-0"
                  key={title as string}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-brand-orange">
                      {number as string}
                    </span>
                    <ItemIcon size={24} className="text-brand-muted" />
                  </div>
                  <h3 className="display mt-16 text-3xl">{title as string}</h3>
                  <p className="mt-4 text-sm leading-7 text-brand-muted">
                    {text as string}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="bg-brand-cream py-12">
        <div className="container-shell">
          <p className="text-center text-xs font-extrabold uppercase tracking-[.25em] text-brand-muted">
            Capabilities across the modern technology landscape
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-x-10 gap-y-5 text-lg font-extrabold text-brand-ink/65">
            {[
              "Cloud native",
              "Generative AI",
              "Data platforms",
              "DevSecOps",
              "Microservices",
              "ERP & CRM",
              "Automation",
              "Digital workplace",
            ].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>
      <section className="section bg-brand-plum text-white">
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
      <section className="section">
        <div className="container-shell grid items-center gap-10 rounded-[2rem] bg-brand-cream p-8 md:p-14 lg:grid-cols-[1fr_.7fr]">
          <div>
            <span className="eyebrow">Careers at SENZOFT</span>
            <h2 className="display mt-6 text-5xl md:text-6xl">
              Build technology. Grow with the challenge.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-brand-muted">
              Join a collaborative team where curiosity, engineering craft and
              ownership turn complex problems into useful outcomes.
            </p>
            <Link to="/careers" className="btn btn-dark mt-8">
              Explore careers <ArrowRight size={18} />
            </Link>
          </div>
          <div className="grid-lines grid min-h-72 place-items-center rounded-[1.5rem] bg-brand-wine p-8 text-center text-white">
            <div>
              <p className="display text-6xl gradient-text">Ideas</p>
              <p className="mt-3 text-sm font-extrabold uppercase tracking-[.25em] text-white/55">
                become impact through people
              </p>
            </div>
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
