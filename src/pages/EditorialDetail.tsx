import { Link } from "react-router-dom";
import type { Industry } from "../types";
import { CTA } from "../components/sections/CTA";
import { ContentGrid } from "../components/sections/ContentGrid";
import { RelatedContent } from "../components/sections/RelatedContent";
import { PageHero } from "../components/ui/PageHero";
import { Seo } from "../components/ui/Seo";
import { industryProfiles } from "../content/industryProfiles";
import { contentRepository } from "../content/repository";

export function IndustryDetail({ industry }: { industry: Industry }) {
  const profile = industryProfiles[industry.slug] || {
    introduction: industry.summary,
    scenarios: industry.challenges.map(
      (item) =>
        [
          item,
          `Define the affected workflow, its owners and the evidence required to improve ${item.toLowerCase()}.`,
        ] as [string, string],
    ),
    discovery: industry.challenges,
    measures: [
      "Journey quality",
      "Information reliability",
      "Operational readiness",
    ],
    services: [],
  };
  const services = contentRepository
    .getServicesForIndustry(industry.slug)
    .slice(0, 4);
  const serviceSlugs = services.map((item) => item.slug);
  const technologies = contentRepository
    .getTechnologiesForIndustry(industry.slug)
    .slice(0, 6);
  const solutions = contentRepository
    .getSolutions()
    .filter((item) => serviceSlugs.includes(item.service))
    .slice(0, 3);
  const cases = contentRepository
    .getCaseStudiesForIndustry(industry.slug)
    .slice(0, 2);
  return (
    <>
      <Seo title={industry.seo.title} description={industry.seo.description} />
      <PageHero
        eyebrow="Industry perspective"
        title={industry.title}
        description={industry.summary}
        imageSlug={industry.slug}
      />

      <section className="section">
        <div className="container-shell editorial-grid">
          <div>
            <span className="eyebrow">Industry challenges</span>
            <h2 className="section-heading mt-5">
              Start with the operating reality.
            </h2>
            <p className="mt-5 leading-8 text-brand-muted">
              {profile.introduction}
            </p>
          </div>
          <div className="reference-listing-points">
            {profile.scenarios.slice(0, 4).map(([title, copy], index) => (
              <article key={title}>
                <span>0{index + 1}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-brand-cream">
        <div className="container-shell">
          <span className="eyebrow">Relevant services</span>
          <h2 className="section-heading mt-5">
            Capabilities connected to your context.
          </h2>
          <div className="mt-10">
            <ContentGrid items={services} basePath="/services" />
          </div>
        </div>
      </section>

      <section className="section bg-brand-ink text-white">
        <div className="container-shell editorial-grid">
          <div>
            <span className="eyebrow text-brand-amber!">Technology</span>
            <h2 className="section-heading mt-5">Selected for the workflow.</h2>
            <p className="mt-5 leading-8 text-white/70">
              Supporting technologies are chosen around integration, governance,
              security and long-term ownership.
            </p>
          </div>
          <div className="flex flex-wrap content-start gap-3">
            {technologies.map((item) => (
              <Link
                className="rounded-full border border-white/25 px-5 py-3 font-bold hover:border-brand-amber hover:text-brand-amber"
                to={`/technology/${item.slug}`}
                key={item.slug}
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <RelatedContent
        items={[
          ...solutions.map((item) => ({
            ...item,
            href: `/solutions/${item.slug}`,
            label: "Solution concept",
          })),
          ...services.map((item) => ({
            ...item,
            href: `/services/${item.slug}`,
            label: "Service",
          })),
          ...cases.map((item) => ({
            ...item,
            href: `/case-studies/${item.slug}`,
            label: "Reference engagement",
          })),
        ].slice(0, 6)}
        heading="Explore the capabilities connected to this industry."
      />
      <CTA />
    </>
  );
}
