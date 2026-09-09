import { CapabilityExplorer } from "../components/sections/CapabilityExplorer";
import { SolutionDirectory } from "../components/sections/SolutionDirectory";
import {
  BusinessPriorities,
  ProjectReadiness,
} from "../components/sections/BusinessPriorities";
import {
  EditorialSections,
  EngagementOptions,
} from "../components/sections/EditorialSections";

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
      {basePath === "/services" && <SolutionDirectory />}
      {basePath === "/services" && <BusinessPriorities />}
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
      {basePath === "/services" ? (
        <CapabilityExplorer />
      ) : (
        <section className="section">
          <div className="container-shell">
            <ContentGrid items={items} basePath={basePath} />
          </div>
        </section>
      )}
      {basePath === "/industries" && <ProjectReadiness />}
      <section className="section bg-brand-sage">
        <div className="container-shell">
          <span className="eyebrow">Connected capability</span>
          <h2 className="display mt-6 max-w-4xl text-5xl md:text-6xl">
            Change works when the pieces work together.
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              [
                "Strategy & consulting",
                "Clarify the decision, compare options and sequence investment around business priorities. Discovery connects stakeholder expectations to a scope the delivery team can act on.",
              ],
              [
                "Experience & engineering",
                "Translate user needs into accessible journeys and maintainable software. Review the design, integration boundaries and acceptance criteria together before release.",
              ],
              [
                "Data, AI & cloud",
                "Connect dependable information with the platforms that process it. Establish data ownership, evaluation practices and operational visibility before expanding automation.",
              ],
              [
                "Security & operations",
                "Define access, monitoring and support responsibilities alongside implementation. Prepare runbooks and recovery paths so teams can sustain the solution after launch.",
              ],
            ].map(([item, copy], index) => (
              <div key={item} className="rounded-2xl bg-white p-7">
                <span className="text-sm font-black text-brand-orange">
                  0{index + 1}
                </span>
                <h3 className="display mt-6 text-3xl">{item}</h3>
                <p className="mt-4 text-sm leading-7 text-brand-muted">
                  {copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {basePath === "/services" ? (
        <EngagementOptions />
      ) : (
        <EditorialSections
          eyebrow="Cross-sector perspective"
          title="Different industries. Connected challenges."
          description="Sector knowledge makes technology decisions more useful. We examine the specific workflow before choosing the architecture or platform."
          items={[
            [
              "Customer and employee journeys",
              "Map the full task across channels, teams and systems. Identify where people lose context, repeat information or need assistance.",
            ],
            [
              "Information that supports action",
              "Agree the meaning, source and ownership of operational data before introducing dashboards, automation or intelligent features.",
            ],
            [
              "Change that teams can sustain",
              "Plan integration, adoption and operational handoffs alongside engineering so improvements remain useful after launch.",
            ],
          ]}
        />
      )}
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
