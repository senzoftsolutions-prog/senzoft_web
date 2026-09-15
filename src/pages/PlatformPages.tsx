import { useMemo, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { PageHero } from "../components/ui/PageHero";
import { Seo } from "../components/ui/Seo";
import { CTA } from "../components/sections/CTA";
import { solutions } from "../content/solutions";
import {
  caseStudies,
  getCaseStudy,
  getCaseStudiesFor,
  getTechnology,
} from "../content/platform";
import { contentRepository } from "../content/repository";
import { technologyAreas } from "../content/presentation";
import { FieldMedia } from "../components/sections/ContentGrid";
import { NotFoundPage } from "./UtilityPages";

const Card = ({
  to,
  label,
  title,
  copy,
}: {
  to: string;
  label: string;
  title: string;
  copy: string;
}) => (
  <Link to={to} className="card content-card group flex min-h-64 flex-col p-7">
    <FieldMedia slug={to.split("/").filter(Boolean).at(-1) ?? ""} />
    <span className="micro-label">{label}</span>
    <h3 className="display mt-5 text-2xl">{title}</h3>
    <p className="mt-4 grow leading-7 text-brand-muted">{copy}</p>
    <span className="mt-6 inline-flex items-center gap-2 font-bold">
      Explore <ArrowUpRight size={18} />
    </span>
  </Link>
);

export function TechnologyPage() {
  return (
    <>
      <Seo
        title="Technology | SENZOFT"
        description="Technology that enables better business outcomes."
      />
      <PageHero
        eyebrow="Technology"
        title="Technology that enables better business outcomes."
        description="Explore eight connected capability areas. Languages and frameworks remain supporting implementation choices, selected around the work."
        imageSlug="cloud-engineering"
      />
      <section className="section">
        <div className="container-shell">
          <span className="eyebrow">Eight technology areas</span>
          <h2 className="section-heading mt-5">Capability before tooling.</h2>
          <div className="offering-grid mt-10">
            {technologyAreas.map((item) => (
              <Card
                key={item.slug}
                to={`/technology/${item.slug}`}
                label="Technology area"
                title={item.title}
                copy={item.summary}
              />
            ))}
          </div>
        </div>
      </section>
      <section className="section bg-brand-sage">
        <div className="container-shell editorial-grid">
          <div>
            <span className="eyebrow">Selection principles</span>
            <h2 className="section-heading mt-5">Fit before fashion.</h2>
          </div>
          <div className="reference-listing-points">
            {[
              [
                "Context",
                "Choose around users, constraints and existing investments.",
              ],
              [
                "Longevity",
                "Consider skills, maintainability, security and exit paths.",
              ],
              [
                "Evidence",
                "Validate architecture decisions through working increments.",
              ],
            ].map(([h, c], i) => (
              <article key={h}>
                <span>0{i + 1}</span>
                <h3>{h}</h3>
                <p>{c}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}

export function TechnologyDetailPage() {
  const { slug } = useParams();
  const item = getTechnology(slug!);
  if (!item) return <NotFoundPage />;
  const services = contentRepository
    .getServices()
    .filter((s) => item.services.includes(s.slug))
    .slice(0, 4);
  const cases = getCaseStudiesFor(item.slug).slice(0, 1);
  const relatedSolutions = contentRepository
    .getSolutionsForTechnology(item.slug)
    .slice(0, 3);
  const relatedIndustries = contentRepository
    .getIndustries()
    .filter((industry) => item.industries.includes(industry.slug))
    .slice(0, 4);
  const relatedInsights = [
    ...new Map(
      item.services
        .flatMap((service) => contentRepository.getInsightsForService(service))
        .map((insight) => [insight.slug, insight]),
    ).values(),
  ].slice(0, 1);
  return (
    <>
      <Seo
        title={`${item.title} | Technology | SENZOFT`}
        description={item.summary}
      />
      <PageHero
        eyebrow={item.category}
        title={item.title}
        description={item.summary}
        imageSlug={
          item.slug === "devops-platform-engineering" ? undefined : item.slug
        }
        media={
          item.slug === "devops-platform-engineering" ? "devops" : undefined
        }
      />
      <section className="section">
        <div className="container-shell editorial-grid">
          <div>
            <span className="eyebrow">Why it matters</span>
            <h2 className="section-heading mt-5">Capability in context.</h2>
          </div>
          <p className="text-xl leading-9">
            We evaluate {item.title} against the workflow, architecture,
            security needs and operating model—not as an isolated tool choice.
          </p>
        </div>
      </section>
      <section className="section bg-brand-peach">
        <div className="container-shell">
          <span className="eyebrow">Capabilities</span>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {item.capabilities.map((x, i) => (
              <article className="rounded-2xl bg-white p-8" key={x}>
                <span className="text-brand-orange">0{i + 1}</span>
                <h3 className="display mt-8 text-3xl">{x}</h3>
                <p className="mt-4 text-brand-muted">
                  Designed with integration, quality and long-term ownership in
                  view.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container-shell editorial-grid">
          <div>
            <span className="eyebrow">Use cases</span>
            <h2 className="section-heading mt-5">Where it creates value.</h2>
          </div>
          <div className="delivery-chapters">
            {item.useCases.map((x, i) => (
              <article key={x}>
                <span>0{i + 1}</span>
                <div>
                  <h3>{x}</h3>
                  <p>
                    Define the user need, integration boundary and measurable
                    acceptance criteria before implementation.
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section bg-brand-sage">
        <div className="container-shell">
          <span className="eyebrow">Connected services</span>
          <div className="offering-grid">
            {services.map((s) => (
              <Card
                key={s.slug}
                to={`/services/${s.slug}`}
                label="Service"
                title={s.title}
                copy={s.summary}
              />
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container-shell">
          <span className="eyebrow">Connected solutions</span>
          <div className="offering-grid">
            {relatedSolutions.map((solution) => (
              <Card
                key={solution.slug}
                to={`/solutions/${solution.slug}`}
                label="Solution"
                title={solution.title}
                copy={solution.summary}
              />
            ))}
          </div>
        </div>
      </section>
      <section className="section bg-brand-cream">
        <div className="container-shell">
          <span className="eyebrow">Industry context</span>
          <div className="offering-grid">
            {relatedIndustries.map((industry) => (
              <Card
                key={industry.slug}
                to={`/industries/${industry.slug}`}
                label="Industry"
                title={industry.title}
                copy={industry.summary}
              />
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container-shell">
          <span className="eyebrow">Related proof framework</span>
          <div className="offering-grid">
            {cases.map((c) => (
              <Card
                key={c.slug}
                to={`/case-studies/${c.slug}`}
                label={c.industry}
                title={c.title}
                copy={c.summary}
              />
            ))}
          </div>
        </div>
      </section>
      <section className="section bg-brand-sage">
        <div className="container-shell">
          <span className="eyebrow">Related thinking</span>
          <div className="offering-grid">
            {relatedInsights.map((insight) => (
              <Card
                key={insight.slug}
                to={`/insights/${insight.slug}`}
                label={insight.type}
                title={insight.title}
                copy={insight.summary}
              />
            ))}
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}

export function SolutionsPage() {
  const clusters = [
    ["Modernize the core", ["application-modernization", "cloud-platforms"]],
    ["Build digital products", ["digital-engineering"]],
    ["Connect data and intelligence", ["data-ai", "enterprise-applications"]],
    [
      "Strengthen trust and delivery",
      ["cybersecurity", "quality-engineering", "managed-it-services"],
    ],
  ] as const;
  const cases = contentRepository.getCaseStudies().slice(0, 3);
  const knowledge = contentRepository.getInsights().slice(0, 3);
  return (
    <>
      <Seo
        title="Solutions | SENZOFT"
        description="Outcome-led technology solutions from SENZOFT."
      />
      <PageHero
        eyebrow="Business solutions"
        title="Solutions for the problems technology teams need to solve."
        description="Start with a business problem, then explore the SENZOFT service, technologies, industry context and evidence pathway behind each solution."
        media="dataAnalytics"
      />
      <section className="section bg-brand-cream">
        <div className="container-shell">
          <span className="eyebrow">Problem clusters</span>
          <h2 className="section-heading mt-5">
            Find the right starting point.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {clusters.map(([title, services]) => (
              <article className="card p-8" key={title}>
                <h3 className="display text-3xl">{title}</h3>
                <p className="mt-4 leading-7 text-brand-muted">
                  Explore focused solutions delivered through{" "}
                  {services
                    .map((s) => contentRepository.getServiceBySlug(s)?.title)
                    .filter(Boolean)
                    .join(", ")}
                  .
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {services.map((s) => (
                    <Link className="surface-tag" to={`/services/${s}`} key={s}>
                      {contentRepository.getServiceBySlug(s)?.title}
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      {clusters.map(([title, serviceSlugs]) => (
        <section className="section" key={title}>
          <div className="container-shell">
            <span className="eyebrow">{title}</span>
            <div className="offering-grid">
              {solutions
                .filter((s) =>
                  (serviceSlugs as readonly string[]).includes(s.service),
                )
                .map((s) => (
                  <Card
                    key={`${s.service}-${s.slug}`}
                    to={`/solutions/${s.slug}`}
                    label={
                      contentRepository.getServiceBySlug(s.service)?.title ||
                      "Solution"
                    }
                    title={s.title}
                    copy={s.summary}
                  />
                ))}
            </div>
          </div>
        </section>
      ))}
      <section className="section bg-brand-sage">
        <div className="container-shell editorial-grid">
          <div>
            <span className="eyebrow">Delivery journey</span>
            <h2 className="section-heading mt-5">
              A solution is more than a technology choice.
            </h2>
          </div>
          <div className="delivery-chapters">
            {[
              "Discover the business problem",
              "Design experience and architecture",
              "Build a reviewable increment",
              "Validate quality and readiness",
              "Launch with clear ownership",
              "Improve using real signals",
            ].map((x, i) => (
              <article key={x}>
                <span>0{i + 1}</span>
                <div>
                  <h3>{x}</h3>
                  <p>
                    Connect decisions, evidence and accountability throughout
                    delivery.
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container-shell">
          <span className="eyebrow">Reference engagements</span>
          <div className="offering-grid">
            {cases.map((c) => (
              <Card
                key={c.slug}
                to={`/case-studies/${c.slug}`}
                label={c.industry}
                title={c.title}
                copy={c.summary}
              />
            ))}
          </div>
        </div>
      </section>
      <section className="section bg-brand-cream">
        <div className="container-shell">
          <span className="eyebrow">Decision support</span>
          <div className="offering-grid">
            {knowledge.map((i) => (
              <Card
                key={i.slug}
                to={`/insights/${i.slug}`}
                label={i.type}
                title={i.title}
                copy={i.summary}
              />
            ))}
          </div>
          <div className="mt-12 max-w-3xl">
            {[
              "How do we choose the right solution?",
              "Can a solution begin with an assessment?",
              "How do solutions work with existing systems?",
              "How is progress measured?",
            ].map((q) => (
              <details className="studio-faq" key={q}>
                <summary>{q}</summary>
                <p>
                  Begin with the workflow and desired outcome, then evaluate
                  dependencies, risks and readiness with the primary service
                  team. Scope the first increment around explicit acceptance
                  evidence.
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}

export function CaseStudiesPage() {
  const [query, setQuery] = useState("");
  const [industry, setIndustry] = useState("All");
  const items = useMemo(
    () =>
      caseStudies
        .filter(
          (c) =>
            (industry === "All" || c.industry === industry) &&
            `${c.title} ${c.summary}`
              .toLowerCase()
              .includes(query.toLowerCase()),
        )
        .slice(0, 3),
    [query, industry],
  );
  const industries = [
    "All",
    ...new Set(caseStudies.slice(0, 3).map((c) => c.industry)),
  ];
  return (
    <>
      <Seo
        title="Case Studies | SENZOFT"
        description="Explore SENZOFT reference engagements and verified delivery evidence."
      />
      <PageHero
        eyebrow="Case studies"
        title="Proof needs context, not just numbers."
        description="Explore selected engagement frameworks. Client claims and outcomes remain unpublished until verified."
        media="strategy"
      />
      <section className="section">
        <div className="container-shell">
          <div className="mb-10 grid gap-4 md:grid-cols-[1fr_auto]">
            <label className="field flex items-center gap-3">
              <Search size={18} />
              <span className="sr-only">Search case studies</span>
              <input
                className="w-full bg-transparent outline-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search selected stories"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              {industries.map((x) => (
                <button
                  className={`btn ${industry === x ? "btn-dark" : "btn-outline"}`}
                  onClick={() => setIndustry(x)}
                  key={x}
                >
                  {x}
                </button>
              ))}
            </div>
          </div>
          <div className="offering-grid">
            {items.map((c) => (
              <Card
                key={c.slug}
                to={`/case-studies/${c.slug}`}
                label={c.industry}
                title={c.title}
                copy={c.summary}
              />
            ))}
          </div>
        </div>
      </section>
      <section className="section bg-brand-peach">
        <div className="container-shell editorial-grid">
          <div>
            <span className="eyebrow">Our evidence standard</span>
            <h2 className="section-heading mt-5">
              Transparent until verified.
            </h2>
          </div>
          <p className="text-xl leading-9">
            Client names, outcomes, metrics and testimonials are published only
            after company verification.
          </p>
        </div>
      </section>
      <CTA />
    </>
  );
}

export function CaseStudyDetailPage() {
  const { slug } = useParams();
  const item = getCaseStudy(slug!);
  if (!item) return <NotFoundPage />;
  const services = contentRepository
    .getServices()
    .filter((s) => item.services.includes(s.slug));
  const relatedTechnologies = contentRepository
    .getTechnologies()
    .filter((t) => item.technologies.includes(t.slug));
  const relatedSolutions = contentRepository
    .getSolutions()
    .filter((s) => item.solutions.includes(s.slug));
  const relatedInsights = contentRepository.getInsightsForCaseStudy(item.slug);
  return (
    <>
      <Seo
        title={`${item.title} | Case Study | SENZOFT`}
        description={item.summary}
      />
      <PageHero
        eyebrow={`${item.industry} reference engagement`}
        title={item.title}
        description={item.summary}
        imageSlug={item.slug}
      />
      <section className="section">
        <div className="container-shell editorial-grid">
          <div>
            <span className="eyebrow">Challenge</span>
            <h2 className="section-heading mt-5">
              Understand the operating reality.
            </h2>
          </div>
          <p className="text-xl leading-9">{item.challenge}</p>
        </div>
      </section>
      <section className="section bg-brand-peach">
        <div className="container-shell">
          <span className="eyebrow">Approach</span>
          <div className="delivery-chapters">
            {item.approach.map((x, i) => (
              <article key={x}>
                <span>0{i + 1}</span>
                <div>
                  <h3>{x}</h3>
                  <p>
                    Review decisions with users and owners, and keep the
                    evidence required for the next stage explicit.
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section bg-brand-wine text-white">
        <div className="container-shell editorial-grid">
          <div>
            <span className="eyebrow text-brand-amber!">Evidence status</span>
            <h2 className="section-heading mt-5">
              Results pending company verification.
            </h2>
          </div>
          <p className="text-xl leading-9 text-white/70">
            This is a reference engagement framework, not a published client
            claim. Outcomes, attribution and metrics remain intentionally
            unpublished until SENZOFT verifies them.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container-shell">
          <span className="eyebrow">Related services</span>
          <div className="offering-grid">
            {services.map((s) => (
              <Card
                key={s.slug}
                to={`/services/${s.slug}`}
                label="Service"
                title={s.title}
                copy={s.summary}
              />
            ))}
          </div>
        </div>
      </section>
      <section className="section bg-brand-cream">
        <div className="container-shell">
          <span className="eyebrow">Solution and technology</span>
          <div className="offering-grid">
            {relatedSolutions.map((s) => (
              <Card
                key={s.slug}
                to={`/solutions/${s.slug}`}
                label="Solution"
                title={s.title}
                copy={s.summary}
              />
            ))}
            {relatedTechnologies.map((t) => (
              <Card
                key={t.slug}
                to={`/technology/${t.slug}`}
                label={t.category}
                title={t.title}
                copy={t.summary}
              />
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container-shell">
          <span className="eyebrow">Related insights</span>
          <div className="offering-grid">
            {relatedInsights.map((i) => (
              <Card
                key={i.slug}
                to={`/insights/${i.slug}`}
                label={i.type}
                title={i.title}
                copy={i.summary}
              />
            ))}
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
