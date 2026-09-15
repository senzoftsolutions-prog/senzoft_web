import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { FieldMedia } from "./ContentGrid";

export function CompanyOverview() {
  const areas = [
    [
      "Software for customers and teams",
      "Websites, mobile applications and custom business software connect the people using a service with the operations behind it. We work through the journeys, business rules and integrations together, then deliver the interface and application layers needed to support them.",
      "/services/application-modernization",
      "about-software-products",
    ],
    [
      "Information, automation and intelligence",
      "Data engineering and analytics bring consistency to information that is spread across systems. Automation and AI are considered around a defined workflow, with evaluation, access and human review built into the approach.",
      "/services/data-ai",
      "about-data-intelligence",
    ],
    [
      "Platforms that sustain the business",
      "Cloud, application modernization and enterprise integrations support how software is delivered and operated. We connect technical changes to reliability, cost visibility and ownership so the platform can keep evolving after the first release.",
      "/services/cloud-platforms",
      "about-cloud-platforms",
    ],
    [
      "Quality, security and ongoing care",
      "Testing, security review and managed services help maintain confidence in daily operations. Clear acceptance criteria, accountable remediation and practical runbooks make the work useful to the teams who rely on it.",
      "/services/managed-it-services",
      "about-quality-security",
    ],
  ];
  return (
    <section className="section company-overview">
      <div className="container-shell">
        <span className="eyebrow">Who we are</span>
        <h2 className="section-heading mt-5">
          One technology partner.
          <br />A connected range of capabilities.
        </h2>
        <div className="company-story">
          <p>
            SENZOFT Software Solutions Private Limited provides IT consulting,
            software development and technology services. We help organizations
            plan new digital experiences, improve established systems and
            support the software that enables day-to-day work.
          </p>
          <p>
            Our work spans the full delivery lifecycle: understanding the
            problem, designing the experience and architecture, building and
            validating the solution, and preparing it for ongoing use. The scope
            can begin with a focused assessment or bring several capabilities
            together around a larger business priority.
          </p>
        </div>
        <div className="company-capability-grid">
          {areas.map(([title, copy, href, imageSlug], i) => (
            <Link
              to={href}
              key={title}
              className="company-capability content-card"
            >
              <FieldMedia slug={imageSlug} />
              <span>0{i + 1}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
              <span className="offering-link">
                Explore this expertise
                <ArrowUpRight size={18} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ContactPlanning() {
  return (
    <>
      <section className="section bg-brand-cream">
        <div className="container-shell">
          <span className="eyebrow">Find the right conversation</span>
          <h2 className="section-heading mt-5">
            Tell us where you
            <br />
            want to make progress.
          </h2>
          <div className="offering-grid">
            {[
              [
                "Build something new",
                "You have a product idea, a website requirement or a business process that needs its own application. Explore our development services, then share the intended users, essential behavior and any systems the solution needs to connect with.",
                "/services/application-modernization",
              ],
              [
                "Improve what you have",
                "An application, integration or platform is holding back change. Share examples of the friction, known dependencies and the outcome you want to improve. We can discuss an assessment or a bounded implementation scope.",
                "/services/application-modernization",
              ],
              [
                "Support ongoing operations",
                "You need clearer ownership, more reliable releases or sustained care for existing technology. Start with the services in scope, current support responsibilities and the issues that recur most often.",
                "/services/managed-it-services",
              ],
            ].map(([title, copy, href]) => (
              <Link className="offering-card" to={href} key={title}>
                <h3>{title}</h3>
                <p>{copy}</p>
                <span className="offering-link">
                  Read about this service
                  <ArrowUpRight size={18} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container-shell editorial-grid">
          <div>
            <span className="eyebrow">Before sending an enquiry</span>
            <h2 className="section-heading mt-5">
              A useful brief can
              <br />
              start with a few details.
            </h2>
            <p className="mt-6 leading-8 text-brand-muted">
              Share enough context to make the initial conversation productive.
              A detailed specification can follow once the problem and
              responsibilities are clearer.
            </p>
          </div>
          <div>
            {[
              [
                "Do I need a finished specification?",
                "No. Describe the problem, who it affects and what you want to change. Existing screenshots, a workflow description or a short list of questions can help frame discovery; use the initial message to describe these rather than sending sensitive materials.",
              ],
              [
                "Can we discuss an existing system?",
                "Yes. Explain the application or platform, the main dependencies and the issue you want to resolve. We can discuss the access and documentation needed for an assessment before any technical work begins.",
              ],
              [
                "How is a proposal prepared?",
                "A proposal follows clarification of the scope, assumptions and delivery dependencies. It sets out the work, responsibilities, acceptance criteria and commercial terms for the agreed engagement.",
              ],
              [
                "Can we ask about a partnership?",
                "Choose Partnership in the enquiry form and describe the capability or delivery need. Include how you expect the teams to work together and the responsibilities you want to discuss.",
              ],
              [
                "Where should career enquiries go?",
                "Visit Careers to explore disciplines and register interest. Career messages should describe your skills and experience; avoid including confidential material from another employer or client.",
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
    </>
  );
}
