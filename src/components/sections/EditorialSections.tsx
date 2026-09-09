import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Reveal } from "../ui/Reveal";

export function EditorialSections({
  eyebrow,
  title,
  description,
  items,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  items: ReadonlyArray<readonly [string, string]>;
  dark?: boolean;
}) {
  return (
    <section
      className={`section ${dark ? "bg-brand-plum text-white" : "bg-brand-cream"}`}
    >
      <div className="container-shell editorial-grid">
        <Reveal>
          <span className={`eyebrow ${dark ? "!text-brand-amber" : ""}`}>
            {eyebrow}
          </span>
          <h2 className="section-heading mt-6">{title}</h2>
          <p
            className={`mt-6 leading-8 ${dark ? "text-white/75" : "text-brand-muted"}`}
          >
            {description}
          </p>
        </Reveal>
        <div>
          {items.map(([heading, copy], index) => (
            <Reveal key={heading} delay={index * 0.06}>
              <article
                className={`detail-row ${dark ? "!border-white/20" : ""}`}
              >
                <div className="flex gap-5">
                  <span
                    className={`pt-1 text-xs font-bold ${dark ? "text-brand-amber" : "text-brand-orange"}`}
                  >
                    0{index + 1}
                  </span>
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight">
                      {heading}
                    </h3>
                    <p
                      className={`mt-3 leading-7 ${dark ? "text-white/75" : "text-brand-muted"}`}
                    >
                      {copy}
                    </p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function EngagementOptions() {
  const options = [
    {
      title: "Find the right direction",
      label: "Discovery & advisory",
      copy: "For an important decision with unanswered questions. Map the current landscape, compare options and leave with priorities, dependencies and a delivery outline.",
      href: "/services/business-consulting",
      outputs: [
        "Current-state assessment and stakeholder priorities",
        "Options, dependencies and a sequenced roadmap",
        "A proposed scope for the first delivery phase",
      ],
      preparation:
        "Bring the decision you need to make, the systems involved and the constraints you already know.",
    },
    {
      title: "Build a defined outcome",
      label: "Project delivery",
      copy: "For a product, integration or modernization scope. Agree acceptance criteria, deliver in reviewable increments and prepare your team for launch and ongoing ownership.",
      href: "/services/digital-engineering",
      outputs: [
        "Reviewed designs and a prioritized delivery backlog",
        "Working increments with acceptance evidence",
        "Release documentation and a support handoff",
      ],
      preparation:
        "Bring your target users, required integrations and any timeline or platform commitments.",
    },
    {
      title: "Strengthen daily operations",
      label: "Ongoing partnership",
      copy: "For platforms that need sustained care. Define support responsibilities, establish operational visibility and maintain an improvement backlog around service needs.",
      href: "/services/managed-it-services",
      outputs: [
        "Service ownership and escalation responsibilities",
        "Operational reporting and maintained runbooks",
        "A prioritized backlog of recurring improvements",
      ],
      preparation:
        "Bring your current support model, recurring incidents and the workloads that matter most.",
    },
  ];
  return (
    <section className="section">
      <div className="container-shell">
        <Reveal>
          <span className="eyebrow">Ways to work together</span>
          <h2 className="section-heading mt-6">
            The right starting point for your next chapter.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {options.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08} className="h-full">
              <Link to={item.href} className="card flex h-full flex-col p-8">
                <span className="text-xs font-bold uppercase tracking-widest text-brand-orange">
                  {item.label}
                </span>
                <h3 className="mt-5 text-2xl font-bold tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-5 leading-7 text-brand-muted">{item.copy}</p>
                <p className="mt-5 text-xs font-bold uppercase tracking-widest text-brand-ink">
                  Typical outputs
                </p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-brand-muted">
                  {item.outputs.map((output) => (
                    <li className="border-t border-black/10 pt-2" key={output}>
                      {output}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-sm leading-6 text-brand-muted">
                  <strong className="text-brand-ink">To get started: </strong>
                  {item.preparation}
                </p>
                <span className="mt-auto flex items-center justify-between pt-8 text-sm font-bold">
                  Explore this approach
                  <ArrowUpRight size={20} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
