import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageHero } from "../components/ui/PageHero";
import { ContentGrid } from "../components/sections/ContentGrid";
import { CTA } from "../components/sections/CTA";
import { Seo } from "../components/ui/Seo";
import { contentRepository } from "../content/repository";

function Listing({
  kind,
  title,
  description,
  items,
  basePath,
}: {
  kind: string;
  title: string;
  description: string;
  items: Array<{
    slug: string;
    title: string;
    summary: string;
    icon?: string;
    eyebrow?: string;
    status?: string;
  }>;
  basePath: string;
}) {
  return (
    <>
      <Seo title={`${title} | SENZOFT`} description={description} />
      <PageHero eyebrow={kind} title={title} description={description} />
      <section className="section bg-brand-peach">
        <div className="container-shell grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <span className="eyebrow">Built for meaningful change</span>
            <h2 className="display mt-6 text-5xl">
              Business context first. Technology with purpose.
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              [
                "Understand",
                "Begin with users, operations, systems and the outcome that matters.",
              ],
              [
                "Connect",
                "Bring experience, data, applications, cloud and security into one roadmap.",
              ],
              [
                "Deliver",
                "Build in focused increments and improve continuously through measurable signals.",
              ],
            ].map(([heading, copy], index) => (
              <article
                key={heading}
                className="border-t-2 border-brand-orange pt-5"
              >
                <span className="text-xs font-black text-brand-orange">
                  0{index + 1}
                </span>
                <h3 className="mt-5 text-xl font-bold">{heading}</h3>
                <p className="mt-3 text-sm leading-7 text-brand-muted">
                  {copy}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container-shell">
          <ContentGrid items={items} basePath={basePath} />
        </div>
      </section>
      <section className="section bg-brand-sage">
        <div className="container-shell">
          <span className="eyebrow">Connected capability</span>
          <h2 className="display mt-6 max-w-4xl text-5xl md:text-6xl">
            Change works when the pieces work together.
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              "Strategy & consulting",
              "Experience & engineering",
              "Data, AI & cloud",
              "Security & operations",
            ].map((item, index) => (
              <div key={item} className="rounded-2xl bg-white p-7">
                <span className="text-sm font-black text-brand-orange">
                  0{index + 1}
                </span>
                <h3 className="display mt-12 text-3xl">{item}</h3>
                <p className="mt-4 text-sm leading-7 text-brand-muted">
                  Integrated into delivery around your priorities, teams and
                  technology landscape.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
export const ServicesPage = () => (
  <Listing
    kind="Capabilities"
    title="Expertise built around your ambition."
    description="From strategy through engineering and operations, we help organizations create confident, lasting change."
    items={contentRepository.getServices()}
    basePath="/services"
  />
);
export const IndustriesPage = () => (
  <Listing
    kind="Industry context"
    title="Technology grounded in your world."
    description="Focused solutions that combine sector understanding with modern engineering, data and experience capabilities."
    items={contentRepository.getIndustries()}
    basePath="/industries"
  />
);
export function InsightsPage() {
  const [query, setQuery] = useState("");
  const items = useMemo(() => contentRepository.getInsights(query), [query]);
  return (
    <>
      <Seo
        title="Insights | SENZOFT"
        description="Perspectives on engineering, AI and enterprise transformation."
      />
      <PageHero
        eyebrow="Insights"
        title="Useful thinking for consequential change."
        description="Perspectives designed to make emerging technology and transformation decisions clearer."
      />
      <section className="section bg-brand-peach">
        <div className="container-shell grid items-center gap-8 lg:grid-cols-[1.2fr_.8fr]">
          <div>
            <span className="eyebrow">Featured theme</span>
            <h2 className="display mt-6 text-5xl md:text-6xl">
              What separates AI activity from AI value?
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-brand-muted">
              Explore the roles of trusted data, modern architecture,
              responsible governance and workflow adoption in moving
              intelligence into the enterprise.
            </p>
          </div>
          <div className="rounded-[2rem] bg-brand-orange p-8 text-white md:p-10">
            <p className="text-xs font-extrabold uppercase tracking-[.2em] text-white/70">
              Research agenda
            </p>
            <ul className="mt-8 space-y-5 text-xl font-bold">
              <li>Responsible enterprise AI</li>
              <li>Cloud economics</li>
              <li>Modern software delivery</li>
              <li>Digital trust</li>
            </ul>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container-shell">
          <label className="relative mb-10 block max-w-2xl">
            <span className="sr-only">Search insights</span>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted"
              size={20}
            />
            <input
              type="search"
              className="field field-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search insights"
              autoComplete="off"
            />
          </label>
          {items.length ? (
            <ContentGrid items={items} basePath="/insights" />
          ) : (
            <div className="rounded-2xl bg-brand-cream p-10">
              <h2 className="text-2xl font-bold">No matching insights</h2>
              <p className="mt-2 text-brand-muted">
                Try a broader phrase or clear your search.
              </p>
            </div>
          )}
        </div>
      </section>
      <section className="section bg-brand-sage">
        <div className="container-shell grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <span className="eyebrow">Stay informed</span>
            <h2 className="display mt-6 text-5xl">
              Technology perspectives, without the noise.
            </h2>
            <p className="mt-5 max-w-2xl text-brand-muted">
              Newsletter delivery will be connected when the backend service is
              available.
            </p>
          </div>
          <a
            href="mailto:hello@senzoft.com?subject=SENZOFT insights"
            className="btn btn-primary"
          >
            Register your interest
          </a>
        </div>
      </section>
      <CTA />
    </>
  );
}
export function CaseStudiesPage() {
  return (
    <>
      <Seo
        title="Case Studies | SENZOFT"
        description="SENZOFT client outcome stories."
      />
      <PageHero
        eyebrow="Client outcomes"
        title="Impact needs evidence."
        description="Approved client stories will appear here. We never publish unverified claims, logos or performance metrics."
      />
      <section className="section">
        <div className="container-shell rounded-3xl border border-dashed border-black/20 p-12 text-center">
          <h2 className="display text-4xl">Case studies in review</h2>
          <p className="mx-auto mt-4 max-w-xl text-brand-muted">
            We are preparing client-approved stories. Talk to our team about
            experience relevant to your goals.
          </p>
        </div>
      </section>
      <CTA />
    </>
  );
}
