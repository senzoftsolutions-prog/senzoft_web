import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowUpRight, CheckCircle2, Users } from "lucide-react";
import { solutions, solutionUrl } from "../content/solutions";
import { serviceOutcomes } from "../content/serviceOutcomes";
import { contentRepository } from "../content/repository";
import { PageHero } from "../components/ui/PageHero";
import { Seo } from "../components/ui/Seo";
import { EditorialSections } from "../components/sections/EditorialSections";
import { CTA } from "../components/sections/CTA";
import { RelatedContent } from "../components/sections/RelatedContent";
import { NotFoundPage } from "./UtilityPages";

export default function SolutionPage() {
  const { slug, solutionSlug } = useParams();
  const item = solutions.find((solution) => solution.slug === solutionSlug);
  if (!item) return <NotFoundPage />;
  if (slug && `/services/${slug}/${item.slug}` !== solutionUrl(item)) {
    if (slug !== item.service) return <NotFoundPage />;
    return <Navigate to={solutionUrl(item)} replace />;
  }
  const parent = contentRepository.getServiceBySlug(item.service)!;
  const outcome = serviceOutcomes[item.service];
  const related = solutions.filter(
    (solution) =>
      solution.slug !== item.slug && solution.service === item.service,
  );
  const alternatives = related.length
    ? related
    : solutions.filter((solution) => solution.slug !== item.slug).slice(0, 3);
  const technologies = contentRepository
    .getTechnologiesForService(parent.slug)
    .slice(0, 8);
  const industries = contentRepository
    .getIndustriesForService(parent.slug)
    .slice(0, 6);
  const cases = contentRepository.getCaseStudiesForSolution(item.slug).length
    ? contentRepository.getCaseStudiesForSolution(item.slug)
    : contentRepository.getCaseStudiesForService(parent.slug).slice(0, 3);
  const insights = contentRepository
    .getInsightsForService(parent.slug)
    .slice(0, 3);
  return (
    <>
      <Seo
        title={`${item.title} | SENZOFT`}
        description={item.summary}
        canonical={solutionUrl(item)}
      />
      <PageHero
        eyebrow={parent.title}
        title={item.title}
        description={item.summary}
        imageSlug={item.slug}
      />
      <nav aria-label="Solution sections" className="solution-section-nav">
        <div className="container-shell">
          <a href="#solution-overview">Overview</a>
          <a href="#solution-scope">What we do</a>
          <a href="#solution-delivery">Delivery</a>
          <a href="#solution-questions">Your questions</a>
        </div>
      </nav>
      <section id="solution-overview" className="section">
        <div className="container-shell editorial-grid">
          <div>
            <span className="eyebrow">The business need</span>
            <h2 className="section-heading mt-5">
              Designed around
              <br />
              the work you do.
            </h2>
          </div>
          <div>
            <p className="text-xl leading-9">{item.challenge}</p>
            <p className="mt-6 leading-8 text-brand-muted">
              We begin by understanding your users, systems and operating
              constraints. Together, we define a manageable scope and the
              evidence needed to know whether it solves the problem.
              Architecture, experience and ongoing ownership are considered in
              the same plan.
            </p>
            <Link className="btn btn-dark mt-7" to="/contact">
              Discuss {item.title.toLowerCase()}
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>
      <div id="solution-scope">
        <EditorialSections
          eyebrow="What we do"
          title="The capabilities behind the solution."
          description={`Our ${item.title.toLowerCase()} work connects the experience users need with the implementation and operating practices that make it dependable. The engagement can cover an assessment, a defined delivery scope or continued improvement.`}
          items={item.scope}
        />
      </div>
      <section className="section bg-brand-cream">
        <div className="container-shell editorial-grid">
          <div>
            <span className="eyebrow">Who typically needs it</span>
            <h2 className="section-heading mt-5">
              For teams responsible for a measurable change.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Business and product owners",
              "Technology and architecture leaders",
              "Engineering and quality teams",
              "Operations and service owners",
            ].map((role) => (
              <article className="card p-6" key={role}>
                <Users className="text-brand-orange" />
                <h3 className="mt-5 text-xl font-bold">{role}</h3>
                <p className="mt-3 leading-7 text-brand-muted">
                  Align the problem, dependencies, acceptance evidence and
                  ownership needed to move forward.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section service-outcomes">
        <div className="container-shell">
          <span className="eyebrow">What you take forward</span>
          <h2 className="section-heading mt-5">
            Working outcomes.
            <br />
            Clear ownership.
          </h2>
          <p className="mt-6 max-w-3xl leading-8">
            Deliverables are agreed for your scope before implementation.
            Reviews connect the working result to the requirements and give the
            team responsible for it the information needed to operate and extend
            it.
          </p>
          <div className="deliverable-ledger">
            {item.deliverables.map((copy, i) => (
              <div key={copy}>
                <span>0{i + 1}</span>
                <h3>{copy}</h3>
                <CheckCircle2 size={22} />
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="solution-delivery" className="section">
        <div className="container-shell">
          <span className="eyebrow">How delivery works</span>
          <h2 className="section-heading mt-5">
            A clear route from
            <br />
            discovery to daily use.
          </h2>
          <div className="delivery-chapters">
            {[
              [
                "Understand the starting point",
                `Review the current process, users and dependencies for ${item.title.toLowerCase()}. Capture constraints, risks and acceptance criteria, and identify the first increment that can produce a useful result.`,
              ],
              [
                "Make the important choices",
                `Use prototypes, technical exploration and the scope above to compare options. Record decisions about interfaces, information ownership and operational behavior before they become expensive to change.`,
              ],
              [
                "Build and review the evidence",
                `Deliver in increments that can be demonstrated and tested. Validate the agreed business rules, document important changes and involve the people who will use or support the solution.`,
              ],
              [
                "Prepare ownership and improvement",
                `Review release readiness, deployment procedures and the support handoff together. Confirm the remaining backlog and how feedback, incidents or changing requirements will be prioritized after launch.`,
              ],
            ].map(([title, copy], i) => (
              <article key={title}>
                <span>0{i + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <EditorialSections
        eyebrow="Measure what matters"
        title={outcome.focus}
        description="Set targets against your current baseline. We use relevant measures to make tradeoffs visible and to evaluate the work, rather than applying the same target to every environment."
        items={outcome.measures}
        dark
      />
      <section className="section bg-brand-sage">
        <div className="container-shell editorial-grid">
          <div>
            <span className="eyebrow">Architecture considerations</span>
            <h2 className="section-heading mt-5">
              Design the boundaries before the build.
            </h2>
            <p className="mt-5 leading-8 text-brand-muted">
              Connect users, application behavior, interfaces, data ownership,
              security and operations in one decision model.
            </p>
          </div>
          <div className="delivery-chapters">
            {[
              "Experience and access",
              "Application and integration boundaries",
              "Data ownership and quality",
              "Operations, security and recovery",
            ].map((title, index) => (
              <article key={title}>
                <span>0{index + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>
                    Record the current constraint, target behavior, trade-offs
                    and accountable owner.
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container-shell">
          <span className="eyebrow">Technology choices</span>
          <h2 className="section-heading mt-5">
            Tools that support the solution—not the other way around.
          </h2>
          <div className="mt-8 flex flex-wrap gap-3">
            {technologies.map((technology) => (
              <Link
                className="rounded-full border border-black/15 px-5 py-3 font-bold hover:border-brand-orange hover:text-brand-orange"
                to={`/technology/${technology.slug}`}
                key={technology.slug}
              >
                {technology.title}
              </Link>
            ))}
          </div>
        </div>
      </section>
      <RelatedContent
        items={[
          ...industries.map((item) => ({
            ...item,
            href: `/industries/${item.slug}`,
            label: "Industry",
          })),
          ...cases.map((item) => ({
            ...item,
            href: `/case-studies/${item.slug}`,
            label: "Reference engagement",
          })),
          ...insights.map((item) => ({
            ...item,
            href: `/insights/${item.slug}`,
            label: item.type,
          })),
        ].slice(0, 6)}
        heading="Explore the context connected to this solution."
      />
      <section id="solution-questions" className="section">
        <div className="container-shell editorial-grid">
          <div>
            <span className="eyebrow">Before we begin</span>
            <h2 className="section-heading mt-5">
              The questions that
              <br />
              shape your scope.
            </h2>
            <p className="mt-6 leading-8 text-brand-muted">
              You do not need every answer before contacting us. These questions
              help identify the people and information that make discovery more
              useful.
            </p>
          </div>
          <div className="space-y-6">
            {item.considerations.map((question, i) => (
              <article className="question-row" key={question}>
                <span>0{i + 1}</span>
                <h3>{question}</h3>
              </article>
            ))}
            <p className="leading-8 text-brand-muted">{outcome.preparation}</p>
          </div>
        </div>
      </section>
      <section className="section bg-brand-cream">
        <div className="container-shell editorial-grid">
          <div>
            <span className="eyebrow">Frequently asked questions</span>
            <h2 className="section-heading mt-5">
              Plan with a clearer
              <br />
              understanding.
            </h2>
          </div>
          <div>
            {[
              [
                "Can you improve an existing solution?",
                "Yes. The first step is to review its architecture, dependencies and current behavior. The proposal can focus on a defined improvement, integration or staged replacement, depending on what the assessment establishes.",
              ],
              [
                "How are scope and timelines agreed?",
                "The team reviews requirements, dependencies and access needs before committing to a delivery plan. A proposal identifies deliverables, assumptions, responsibilities and acceptance criteria so changes can be discussed explicitly.",
              ],
              [
                "What happens after delivery?",
                "Handover includes the agreed documentation and operational guidance. Ongoing support, maintenance or feature development can be scoped separately, with clear ownership and service expectations.",
              ],
              [
                "Can you collaborate with our internal team?",
                "Yes. We can agree a blended delivery model with shared reviews and defined responsibilities. Existing standards, tools and approval processes are considered when planning the work.",
              ],
            ].map(([q, a]) => (
              <details className="studio-faq" key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container-shell">
          <span className="eyebrow">Connected expertise</span>
          <h2 className="section-heading mt-5">Continue exploring.</h2>
          <div className="offering-grid">
            {alternatives.map((solution) => (
              <Link
                className="offering-card"
                to={solutionUrl(solution)}
                key={solution.slug}
              >
                <h3>{solution.title}</h3>
                <p>{solution.summary}</p>
                <span className="offering-link">
                  View details
                  <ArrowUpRight size={18} />
                </span>
              </Link>
            ))}
          </div>
          <Link
            className="mt-8 inline-flex items-center gap-3 font-semibold"
            to={`/services/${parent.slug}`}
          >
            All {parent.title.toLowerCase()} capabilities
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
      <CTA />
    </>
  );
}
