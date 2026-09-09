import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Reveal } from "../ui/Reveal";

const stages = [
  {
    name: "Understand",
    subtitle: "Give the ambition a useful shape.",
    copy: "Start with the people, process and systems behind the request. Trace the current journey, ask where work becomes difficult and agree which change would make the biggest difference.",
    outputs: [
      "Shared problem statement",
      "Current-state and dependency map",
      "Prioritized opportunities",
    ],
    question: "What needs to be different for this work to matter?",
  },
  {
    name: "Design",
    subtitle: "Make the important decisions tangible.",
    copy: "Explore the experience and technical foundation together. Use prototypes and architecture reviews to test assumptions before committing to the build, with security and accessibility included in the decisions.",
    outputs: [
      "Reviewed journeys and prototypes",
      "Architecture and integration boundaries",
      "Acceptance criteria and delivery scope",
    ],
    question:
      "Can the people using and operating this solution see how it will work?",
  },
  {
    name: "Engineer",
    subtitle: "Build progress you can review.",
    copy: "Deliver focused increments with clear ownership and representative tests. Demonstrate working software, record tradeoffs and use feedback to improve the next increment while the work is still easy to change.",
    outputs: [
      "Working, tested increments",
      "Automated delivery checks",
      "Decision records and documentation",
    ],
    question: "What evidence shows that this increment is ready?",
  },
  {
    name: "Evolve",
    subtitle: "Make launch the start of useful learning.",
    copy: "Prepare the teams who will support and own the solution. Agree release readiness, monitor the actual user journey and turn operational feedback into a manageable improvement backlog.",
    outputs: [
      "Release and recovery guidance",
      "Knowledge transfer and ownership",
      "A measurable improvement backlog",
    ],
    question: "Who owns the next improvement after launch?",
  },
];
export function DeliveryJourney() {
  const [selected, setSelected] = useState(0);
  const stage = stages[selected];
  return (
    <section className="section">
      <div className="container-shell">
        <Reveal className="section-intro">
          <div>
            <span className="eyebrow">A deliberate delivery process</span>
            <h2 className="section-heading mt-5">Momentum, with direction.</h2>
          </div>
          <p>
            Explore how a problem becomes a working solution. Every stage
            connects decisions with concrete outputs and a clear next step.
          </p>
        </Reveal>
        <div
          className="journey-steps mt-10"
          role="group"
          aria-label="Delivery stages"
        >
          {stages.map((item, i) => (
            <button
              key={item.name}
              aria-pressed={selected === i}
              onClick={() => setSelected(i)}
            >
              <span>0{i + 1}</span>
              <strong>{item.name}</strong>
              <ArrowRight size={17} />
            </button>
          ))}
        </div>
        <div className="journey-detail" aria-live="polite">
          <div>
            <p className="micro-label">
              Stage 0{selected + 1} / {stage.name}
            </p>
            <h3 className="mt-4 text-3xl font-semibold tracking-tight">
              {stage.subtitle}
            </h3>
            <p className="mt-5 max-w-2xl leading-8 text-brand-muted">
              {stage.copy}
            </p>
          </div>
          <div className="journey-outputs">
            <h4 className="text-sm font-semibold">What moves forward</h4>
            {stage.outputs.map((output) => (
              <p key={output} className="mt-4 flex items-center gap-3 text-sm">
                <CheckCircle2 size={16} className="text-brand-orange" />
                {output}
              </p>
            ))}
            <p className="mt-6 border-t border-black/10 pt-5 text-sm leading-6 text-brand-muted">
              The question to answer:
              <br />
              <strong className="text-brand-ink">{stage.question}</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
