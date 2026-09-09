import { useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Reveal } from "../ui/Reveal";

const priorities = [
  {
    name: "Modernize critical systems",
    title: "Move forward without losing what already works.",
    problem:
      "An established application can hold years of business knowledge while making every change harder. Dependencies are unclear, releases need manual coordination and teams spend more time maintaining workarounds than improving the service.",
    approach:
      "Start with one important workflow. Map its dependencies, isolate a useful boundary and introduce a replacement alongside the existing system. Validate data and behavior before shifting traffic, with a clear rollback route at each step.",
    outputs: [
      "Application and dependency assessment",
      "Phased migration and coexistence plan",
      "Regression evidence and operational handover",
    ],
    measure:
      "Track release lead time, failed changes, support demand and the time users need to complete the workflow. Compare against a baseline agreed before implementation.",
    href: "/services/application-modernization",
    link: "Explore application modernization",
    theme: "modernize",
  },
  {
    name: "Make data useful",
    title: "Give decisions a dependable foundation.",
    problem:
      "Reports disagree, important information lives in separate systems and teams reconcile spreadsheets before they can act. Adding AI to that environment can amplify uncertainty instead of resolving it.",
    approach:
      "Choose a decision that needs better information. Establish shared definitions, trace the source data and build quality checks into the pipeline. Test analytics or automation with representative examples and a person accountable for reviewing exceptions.",
    outputs: [
      "Source inventory and shared data definitions",
      "Validated pipeline and decision-focused reporting",
      "Evaluation criteria and human review process",
    ],
    measure:
      "Review data freshness, reconciliation effort, exception rates and the usefulness of the output to the people making decisions. Evaluate AI against a simpler baseline before expanding it.",
    href: "/services/data-ai",
    link: "Explore data and AI",
    theme: "intelligence",
  },
  {
    name: "Strengthen operations",
    title: "Make dependable service part of the design.",
    problem:
      "A platform can be available and still be difficult to operate. Unclear alerts, manual deployments and fragmented ownership make routine changes stressful and extend the time needed to recover from an incident.",
    approach:
      "Understand the most important user journeys and their failure modes. Connect monitoring to service expectations, automate repeatable changes and rehearse recovery with the people who will own the platform.",
    outputs: [
      "Service ownership and observability map",
      "Repeatable deployment and recovery workflows",
      "Runbooks, escalation paths and improvement backlog",
    ],
    measure:
      "Establish targets for service availability, recovery time, deployment reliability and cost per useful unit of work. Review tradeoffs with the business as demand changes.",
    href: "/services/cloud-platforms",
    link: "Explore cloud platforms",
    theme: "operations",
  },
];

export function BusinessPriorities() {
  const [selected, setSelected] = useState(0);
  const item = priorities[selected];
  return (
    <section className="section business-priorities" id="business-priorities">
      <div className="container-shell">
        <Reveal className="section-intro">
          <div>
            <span className="eyebrow">
              Your priorities. A practical response.
            </span>
            <h2 className="section-heading mt-5">
              Start with the change
              <br />
              your business needs.
            </h2>
          </div>
          <p>
            Explore how a focused engagement can address a familiar business
            challenge. These illustrative approaches show the work, deliverables
            and measures to agree with your team.
          </p>
        </Reveal>
        <div
          className="priority-tabs"
          role="group"
          aria-label="Choose a business priority"
        >
          {priorities.map((p, i) => (
            <button
              key={p.name}
              onClick={() => setSelected(i)}
              aria-pressed={selected === i}
            >
              <span>0{i + 1}</span>
              {p.name}
              <ArrowUpRight size={18} />
            </button>
          ))}
        </div>
        <div
          className={`priority-story priority-${item.theme}`}
          aria-live="polite"
        >
          <div className="priority-narrative">
            <span className="micro-label">
              Illustrative engagement / 0{selected + 1}
            </span>
            <h3>{item.title}</h3>
            <h4>The challenge</h4>
            <p>{item.problem}</p>
            <h4>How we approach it</h4>
            <p>{item.approach}</p>
            <Link to={item.href}>
              {item.link}
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <aside className="priority-evidence">
            <span className="eyebrow">From intention to evidence</span>
            <h4>What your team takes forward</h4>
            <ul>
              {item.outputs.map((output) => (
                <li key={output}>
                  <Check size={18} />
                  {output}
                </li>
              ))}
            </ul>
            <div className="priority-measures">
              <h4>How to judge progress</h4>
              <p>{item.measure}</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

const readiness = [
  [
    "A specific business outcome",
    "Name the workflow, its users and the improvement you want to see. Bring a baseline or a concrete example of the current friction.",
  ],
  [
    "An owner for important decisions",
    "Identify who can prioritize requirements, resolve dependencies and accept the result. Include an operational owner before launch planning begins.",
  ],
  [
    "Access to systems and information",
    "List the applications, interfaces and data needed for discovery. Record access constraints and any third-party dependencies early.",
  ],
  [
    "A realistic first release",
    "Separate essential behavior from later improvements. Agree what evidence will show that the first increment is safe and useful.",
  ],
];

export function ProjectReadiness() {
  const [checked, setChecked] = useState<number[]>([]);
  return (
    <section className="section readiness-section">
      <div className="container-shell editorial-grid">
        <div>
          <span className="eyebrow">Prepare for a useful conversation</span>
          <h2 className="section-heading mt-5">
            What is ready.
            <br />
            What needs clarity.
          </h2>
          <p className="mt-6 leading-8">
            Use this short planning checklist to identify the questions worth
            resolving before delivery. You can begin a conversation at any
            stage.
          </p>
          <div className="readiness-count" role="status">
            <strong>{checked.length} / 4</strong>
            <span>
              {checked.length === 4
                ? "Your starting brief has the core ingredients."
                : "starting points clarified"}
            </span>
          </div>
          <Link to="/contact" className="btn btn-dark mt-6">
            Discuss your next step
            <ArrowUpRight size={18} />
          </Link>
          <p className="mt-4 text-sm">
            Selections stay on this page and are not submitted.
          </p>
        </div>
        <div className="readiness-list">
          {readiness.map(([title, copy], i) => (
            <label key={title}>
              <input
                type="checkbox"
                checked={checked.includes(i)}
                onChange={() =>
                  setChecked((current) =>
                    current.includes(i)
                      ? current.filter((n) => n !== i)
                      : [...current, i],
                  )
                }
              />
              <span>
                <strong>{title}</strong>
                <span>{copy}</span>
              </span>
            </label>
          ))}
        </div>
      </div>
    </section>
  );
}
