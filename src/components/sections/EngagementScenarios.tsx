import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "../ui/Reveal";

const scenarios = [
  {
    title: "Renew a customer-facing application",
    service: "application-modernization",
    problem:
      "A customer portal depends on a legacy application, with manual support needed when a request fails. The business needs a clearer journey while keeping the existing transaction system available.",
    approach:
      "Map one end-to-end customer task, introduce a documented interface to the current system and deliver a bounded replacement journey. Rehearse data reconciliation and rollback before moving traffic.",
    evidence:
      "Compare journey completion, support requests and release failures against a recorded baseline. Review the operating cost of running both systems and agree when the older workflow can be retired.",
  },
  {
    title: "Make reporting useful in daily operations",
    service: "data-ai",
    problem:
      "Operational teams maintain separate spreadsheets and spend time reconciling conflicting numbers. Decisions are delayed because the meaning and freshness of each metric are unclear.",
    approach:
      "Agree metric definitions with process owners, identify authoritative sources and build a small reporting pipeline with validation and exception handling. Design the view around the decision each team needs to make.",
    evidence:
      "Track reconciliation effort, data freshness and unresolved quality exceptions. Ask users whether the report helps them identify an issue and take the next action without another manual export.",
  },
  {
    title: "Create a more dependable release process",
    service: "quality-engineering",
    problem:
      "A product team relies on manual release steps and discovers integration issues late. Increasing the number of deployments without changing the process would increase operational risk.",
    approach:
      "Map the release path, automate representative journey checks and establish consistent environments. Add observable deployments, explicit acceptance criteria and a rehearsed recovery procedure.",
    evidence:
      "Review lead time, escaped defects and time to recover together. Look for recurring failure categories and use them to prioritize improvements to the test strategy and delivery pipeline.",
  },
];

export function EngagementScenarios() {
  return (
    <section className="section">
      <div className="container-shell">
        <span className="eyebrow">Illustrative engagement scenarios</span>
        <h2 className="section-heading mt-5">
          See how a challenge becomes a delivery plan.
        </h2>
        <p className="mt-5 max-w-3xl leading-8 text-brand-muted">
          These examples explain possible approaches, not completed client
          projects. They show the questions, delivery decisions and evidence
          that a scoped engagement could address.
        </p>
        <div className="mt-8 space-y-5">
          {scenarios.map((item, index) => (
            <Reveal key={item.title}>
              <article className="rounded-2xl border border-black/10 p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <span className="pt-1 text-sm font-bold text-brand-orange">
                    0{index + 1}
                  </span>
                  <h3 className="text-2xl font-bold">{item.title}</h3>
                </div>
                <div className="mt-6 grid gap-6 lg:grid-cols-3">
                  {[
                    ["The situation", item.problem],
                    ["A possible approach", item.approach],
                    ["Evidence to review", item.evidence],
                  ].map(([label, copy]) => (
                    <div key={label}>
                      <h4 className="text-sm font-bold text-brand-orange">
                        {label}
                      </h4>
                      <p className="mt-3 leading-7 text-brand-muted">{copy}</p>
                    </div>
                  ))}
                </div>
                <Link
                  to={`/services/${item.service}`}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold"
                >
                  Explore the relevant capability
                  <ArrowUpRight size={17} />
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
