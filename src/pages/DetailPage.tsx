import { capabilityUrl } from "../content/solutions";
import { ArrowRight, CheckCircle2, ChevronDown } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import { CTA } from "../components/sections/CTA";
import { ContentGrid } from "../components/sections/ContentGrid";
import { PageHero } from "../components/ui/PageHero";
import { Seo } from "../components/ui/Seo";
import { contentRepository } from "../content/repository";
import {
  serviceDeliverables,
  deliverySteps,
} from "../content/serviceDeliverables";
import { serviceProfiles } from "../content/serviceProfiles";
import { serviceOutcomes } from "../content/serviceOutcomes";
import { SolutionDirectory } from "../components/sections/SolutionDirectory";
import { IndustryDetail } from "./EditorialDetail";
import type { Industry, Service } from "../types";

export default function DetailPage() {
  const { slug } = useParams();
  const root = useLocation().pathname.split("/")[1];
  const item =
    root === "services"
      ? contentRepository.getServiceBySlug(slug!)
      : root === "industries"
        ? contentRepository.getIndustryBySlug(slug!)
        : undefined;
  if (!item) return <Missing />;
  if (root === "services") return <ServiceDetail service={item as Service} />;
  if (root === "industries")
    return <IndustryDetail industry={item as Industry} />;
  return <Missing />;
}

function ServiceDetail({ service }: { service: Service }) {
  const profile = serviceProfiles[service.slug];
  const outcome = serviceOutcomes[service.slug];
  const related = contentRepository
    .getServices()
    .filter((item) => item.slug !== service.slug)
    .slice(0, 3);
  return (
    <>
      <Seo title={service.seo.title} description={service.seo.description} />
      <PageHero
        eyebrow="SENZOFT technology services"
        title={service.title}
        description={service.summary}
      />
      <nav
        className="sticky top-24 z-30 hidden border-b border-black/10 bg-white/95 backdrop-blur md:block"
        aria-label="On this page"
      >
        <div className="container-shell flex gap-8 overflow-x-auto py-4 text-sm font-bold">
          <a href="#overview">Overview</a>
          <a href="#capabilities">Capabilities</a>
          <a href="#approach">Our approach</a>
          <a href="#technology">Technology</a>
          <a href="#faq">FAQs</a>
        </div>
      </nav>
      <section id="overview" className="section">
        <div className="container-shell grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <span className="eyebrow">The opportunity</span>
            <h2 className="display mt-6 text-5xl">
              Make complexity work for your business.
            </h2>
          </div>
          <div>
            <p className="text-2xl leading-10 text-brand-ink">
              {profile.challenge}
            </p>
            <p className="mt-6 leading-8 text-brand-muted">
              SENZOFT combines industry context, modern architecture and
              hands-on engineering to move from ambition to dependable
              execution. We work with your teams, existing investments and
              operating realities.
            </p>
            <Link
              to="/contact"
              className="mt-8 inline-flex items-center gap-2 font-extrabold text-brand-orange"
            >
              Discuss your priorities <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
      <section className="section service-outcomes">
        <div className="container-shell">
          <span className="eyebrow">Define success together</span>
          <h2 className="section-heading mt-5 max-w-4xl">{outcome.focus}</h2>
          <p className="mt-6 max-w-3xl leading-8">
            Agree a baseline and acceptance criteria before implementation.
            These are useful measures to discuss for your engagement; targets
            depend on your systems, users and scope.
          </p>
          <div className="outcomes-grid">
            {outcome.measures.map(([title, copy], i) => (
              <article key={title}>
                <span>0{i + 1}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
          <div className="engagement-preparation">
            <h3>What to bring to the first conversation</h3>
            <p>{outcome.preparation}</p>
          </div>
        </div>
      </section>
      <SolutionDirectory service={service.slug} />
      <section id="capabilities" className="section bg-brand-peach">
        <div className="container-shell">
          <span className="eyebrow">What we deliver</span>
          <h2 className="display mt-6 max-w-4xl text-5xl md:text-6xl">
            Capabilities spanning strategy, build and scale.
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {service.capabilities.map((capability, index) => (
              <Link
                to={capabilityUrl(service.slug, index)}
                className="rounded-2xl bg-white p-8 shadow-sm"
                key={capability}
              >
                <span className="text-sm font-black text-brand-orange">
                  0{index + 1}
                </span>
                <h3 className="display mt-10 text-3xl">{capability}</h3>
                <p className="mt-4 leading-7 text-brand-muted">
                  {serviceDeliverables[service.slug][index]}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section id="approach" className="section">
        <div className="container-shell">
          <span className="eyebrow">How we work</span>
          <div className="mt-6 grid gap-8 lg:grid-cols-[.65fr_1.35fr]">
            <h2 className="display text-5xl md:text-6xl">
              Progress through a clear delivery path.
            </h2>
            <div className="border-t border-black/15">
              {profile.engagement.map((step, index) => (
                <div
                  className="grid gap-3 border-b border-black/15 py-7 sm:grid-cols-[4rem_1fr_1.4fr]"
                  key={step}
                >
                  <span className="font-black text-brand-orange">
                    0{index + 1}
                  </span>
                  <h3 className="text-xl font-bold">{step}</h3>
                  <p className="text-brand-muted">{deliverySteps[index]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section id="technology" className="section bg-brand-sage">
        <div className="container-shell grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <span className="eyebrow">Technology landscape</span>
            <h2 className="display mt-6 text-5xl">
              Modern capability. Practical choices.
            </h2>
            <p className="mt-6 leading-8 text-brand-muted">
              We select technology around fitness for purpose, integration,
              security, skills and long-term maintainability.
            </p>
          </div>
          <div className="flex content-start flex-wrap gap-3">
            {profile.technologies.map((item) => (
              <span
                className="rounded-full border border-brand-ink/15 bg-white px-5 py-3 font-bold"
                key={item}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>
      <section className="section bg-brand-wine text-white">
        <div className="container-shell">
          <span className="eyebrow text-brand-amber!">
            Outcomes that matter
          </span>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {service.outcomes.map((outcome, index) => (
              <div
                className="rounded-2xl border border-white/15 bg-white/6 p-7"
                key={outcome}
              >
                <CheckCircle2 className="text-brand-amber" />
                <p className="display mt-16 text-3xl">{outcome}</p>
                <p className="mt-4 text-sm leading-7 text-white/60">
                  Success measures are agreed for each engagement and tracked
                  from delivery through adoption.
                </p>
                <span className="mt-7 block text-xs font-black text-white/35">
                  0{index + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="faq" className="section">
        <div className="container-shell grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <span className="eyebrow">Common questions</span>
            <h2 className="display mt-6 text-5xl">
              Plan the next step with clarity.
            </h2>
          </div>
          <div className="border-t border-black/15">
            {profile.faqs.map(([question, answer]) => (
              <details
                className="group border-b border-black/15 py-6"
                key={question}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-xl font-bold">
                  {question}
                  <ChevronDown className="shrink-0 transition group-open:rotate-180" />
                </summary>
                <p className="max-w-2xl pt-4 leading-8 text-brand-muted">
                  {answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <section className="section bg-brand-peach">
        <div className="container-shell">
          <span className="eyebrow">Transformation priorities</span>
          <h2 className="display mt-6 max-w-4xl text-5xl md:text-6xl">
            Connect experience, intelligence and resilient technology.
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              [
                "Experience",
                "Design inclusive journeys around the needs of customers, employees and partners.",
              ],
              [
                "Intelligence",
                "Create trusted data foundations and place practical insight inside everyday decisions.",
              ],
              [
                "Resilience",
                "Modernize architecture, security and operations to support dependable change.",
              ],
            ].map(([title, text], index) => (
              <article className="rounded-2xl bg-white p-8" key={title}>
                <span className="font-black text-brand-orange">
                  0{index + 1}
                </span>
                <h3 className="display mt-10 text-3xl">{title}</h3>
                <p className="mt-4 leading-7 text-brand-muted">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container-shell grid gap-12 lg:grid-cols-[.75fr_1.25fr]">
          <div>
            <span className="eyebrow">A practical path</span>
            <h2 className="display mt-6 text-5xl">
              Transform without losing sight of today.
            </h2>
            <p className="mt-6 leading-8 text-brand-muted">
              Sequence change around value, readiness and operational
              continuity.
            </p>
          </div>
          <div className="border-t border-black/15">
            {[
              "Discover the priority and establish a measurable baseline",
              "Design the target experience, architecture and operating model",
              "Deliver in focused increments with quality and security built in",
              "Adopt, measure and continuously improve",
            ].map((step, index) => (
              <div
                className="grid grid-cols-[3rem_1fr] gap-4 border-b border-black/15 py-6"
                key={step}
              >
                <span className="font-black text-brand-orange">
                  0{index + 1}
                </span>
                <p className="text-lg font-bold">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section bg-brand-cream">
        <div className="container-shell">
          <span className="eyebrow">Connected expertise</span>
          <h2 className="display mt-6 text-5xl">Explore related services.</h2>
          <div className="mt-10">
            <ContentGrid items={related} basePath="/services" />
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}

function Missing() {
  return (
    <div className="container-shell py-48 text-center">
      <h1 className="display text-6xl">We couldn’t find that page.</h1>
      <Link className="btn btn-primary mt-8" to="/">
        Return home
      </Link>
    </div>
  );
}
