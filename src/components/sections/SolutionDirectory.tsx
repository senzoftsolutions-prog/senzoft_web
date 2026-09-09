import { Link } from "react-router-dom";
import { ArrowUpRight, Code2, Layers3, Workflow } from "lucide-react";
import { solutions, solutionUrl } from "../../content/solutions";
import { Reveal } from "../ui/Reveal";

export function SolutionDirectory({
  service,
}: {
  service?: string | string[];
}) {
  const items = service
    ? solutions.filter((item) =>
        typeof service === "string"
          ? item.service === service
          : service.includes(item.service),
      )
    : solutions;
  return (
    <section className="section solution-directory" id="software-solutions">
      <div className="container-shell">
        <Reveal>
          <span className="eyebrow">Software and IT solutions</span>
          <h2 className="section-heading mt-5">
            From the first interface
            <br />
            to the systems behind it.
          </h2>
          <p className="mt-6 max-w-3xl leading-8 text-brand-muted">
            Explore the work in detail: the business problems we address, what
            an engagement includes and how we prepare the result for daily use.
            Select a solution to understand the scope and the decisions
            involved.
          </p>
        </Reveal>
        <div className="offering-grid">
          {items.map((item, i) => {
            const Icon = [Code2, Layers3, Workflow][i % 3];
            return (
              <Reveal key={item.slug} delay={(i % 3) * 0.06}>
                <Link className="offering-card" to={solutionUrl(item)}>
                  <div className="offering-card-top">
                    <Icon size={26} />
                    <span>{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <span className="offering-link">
                    Explore the solution
                    <ArrowUpRight size={18} />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
