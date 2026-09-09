import type { Industry } from "../types";
import { industryProfiles } from "../content/industryProfiles";
import { industryDelivery } from "../content/industryDelivery";
import { contentRepository } from "../content/repository";
import { PageHero } from "../components/ui/PageHero";
import { Seo } from "../components/ui/Seo";
import { CTA } from "../components/sections/CTA";
import { ContentGrid } from "../components/sections/ContentGrid";
import { EditorialSections } from "../components/sections/EditorialSections";
import { SolutionDirectory } from "../components/sections/SolutionDirectory";

export function IndustryDetail({ industry }: { industry: Industry }) {
  const profile = industryProfiles[industry.slug];
  const delivery = industryDelivery[industry.slug];
  const related = contentRepository
    .getServices()
    .filter((service) => profile.services.includes(service.slug));
  return (
    <>
      <Seo title={industry.seo.title} description={industry.seo.description} />
      <PageHero
        eyebrow="Industry perspective"
        title={industry.title}
        description={industry.summary}
      />
      <EditorialSections
        eyebrow="Where technology can help"
        title="Built around the realities of your sector."
        description={profile.introduction}
        items={profile.scenarios}
      />
      <section className="section">
        <div className="container-shell editorial-grid">
          <div>
            <span className="eyebrow">Start with the right questions</span>
            <h2 className="section-heading mt-6">Make discovery specific.</h2>
            <p className="mt-6 leading-8 text-brand-muted">
              These questions help define a useful first engagement. The scope,
              controls and delivery plan are shaped with your domain and
              operational teams.
            </p>
          </div>
          <ol className="space-y-4">
            {profile.discovery.map((question, i) => (
              <li key={question} className="card flex gap-5 p-6">
                <span className="font-bold text-brand-orange">0{i + 1}</span>
                <p className="text-lg font-semibold">{question}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="section bg-brand-plum text-white">
        <div className="container-shell">
          <span className="eyebrow !text-brand-amber">
            Define success together
          </span>
          <h2 className="section-heading mt-6">
            Measure the change that matters.
          </h2>
          <p className="mt-5 max-w-2xl leading-7 text-white/75">
            Suggested measures for discovery, rather than claims of achieved
            results. Agree a baseline, owner and review cadence for each
            selected measure.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {profile.measures.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/20 p-7 text-xl font-bold"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section bg-brand-cream">
        <div className="container-shell editorial-grid">
          <div>
            <span className="eyebrow">A focused first engagement</span>
            <h2 className="section-heading mt-5">
              Turn the priority into a practical scope.
            </h2>
            <p className="mt-5 leading-8 text-brand-muted">{delivery.scope}</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold">What the work could produce</h3>
            <ul className="mt-5 space-y-3">
              {delivery.deliverables.map((item) => (
                <li
                  key={item}
                  className="border-b border-black/10 pb-3 font-semibold"
                >
                  {item}
                </li>
              ))}
            </ul>
            <h3 className="mt-7 text-xl font-bold">
              Before expanding the solution
            </h3>
            <p className="mt-3 leading-8 text-brand-muted">
              {delivery.readiness}
            </p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container-shell">
          <span className="eyebrow">Relevant expertise</span>
          <h2 className="section-heading mt-6 mb-10">
            Connect the capabilities you need.
          </h2>
          <ContentGrid items={related} basePath="/services" />
        </div>
      </section>
      <SolutionDirectory service={profile.services} />
      <EditorialSections
        eyebrow="From pilot to ongoing service"
        title={`Prepare the people behind ${industry.title.toLowerCase()}.`}
        description="A technical release changes how information and responsibilities move between teams. Operational readiness is part of the delivery scope, with domain specialists involved in the decisions that affect daily work."
        items={[
          [
            "Agree information ownership",
            "Identify the source of each important record and who can resolve an exception. Document access permissions, update rules and the checks needed when information moves between systems. Validate the interpretation with the business teams who use it.",
          ],
          [
            "Prepare a controlled rollout",
            "Choose a bounded workflow and define the conditions for expanding access. Rehearse representative transactions, recovery and the support handoff before launch. Make remaining limitations visible so users understand the first release.",
          ],
          [
            "Support adoption and improvement",
            "Give users task-focused guidance and a clear route for reporting a problem. Review feedback alongside operational measures, and agree which improvements belong in the next release. Keep ownership current as the service evolves.",
          ],
        ]}
      />
      <CTA />
    </>
  );
}
