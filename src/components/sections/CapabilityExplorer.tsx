import { capabilityUrl } from "../../content/solutions";
import { useState } from "react";
import { ArrowUpRight, Check, Layers3 } from "lucide-react";
import { Link } from "react-router-dom";
import { contentRepository } from "../../content/repository";
import { serviceDeliverables } from "../../content/serviceDeliverables";
import { Reveal } from "../ui/Reveal";

export function CapabilityExplorer() {
  const services = contentRepository.getServices();
  const [selected, setSelected] = useState(0);
  const item = services[selected];
  return (
    <section className="section explorer-section">
      <div className="container-shell">
        <Reveal className="section-intro">
          <div>
            <span className="eyebrow">Explore the possibilities</span>
            <h2 className="section-heading mt-5">
              Different capabilities.
              <br />
              <span className="ink-gradient">One connected ambition.</span>
            </h2>
          </div>
          <p>
            Start with the change you want to make. Explore the expertise,
            practical deliverables and foundations behind each service.
          </p>
        </Reveal>
        <div className="capability-explorer mt-10">
          <div
            className="capability-selector"
            role="group"
            aria-label="Choose a capability"
          >
            {services.map((service, i) => (
              <button
                key={service.slug}
                aria-pressed={selected === i}
                onClick={() => setSelected(i)}
              >
                <span className="text-xs tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{service.title}</span>
                <ArrowUpRight size={16} />
              </button>
            ))}
          </div>
          <div className="capability-detail" aria-live="polite">
            <div className="flex items-center justify-between gap-4">
              <span className="micro-label">{item.eyebrow}</span>
              <span className="feature-icon">
                <Layers3 size={22} />
              </span>
            </div>
            <h3 className="mt-5 text-3xl font-semibold tracking-tight md:text-4xl">
              {item.title}
            </h3>
            <p className="mt-4 max-w-2xl leading-7 text-brand-muted">
              {item.summary}
            </p>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {item.capabilities.map((capability, i) => (
                <Link
                  to={capabilityUrl(item.slug, i)}
                  key={capability}
                  className="capability-output"
                >
                  <Check size={16} />
                  <h4 className="mt-3 font-semibold">{capability}</h4>
                  <p className="mt-2 text-sm leading-6 text-brand-muted">
                    {serviceDeliverables[item.slug][i]}
                  </p>
                </Link>
              ))}
            </div>
            <Link to={`/services/${item.slug}`} className="btn btn-dark mt-7">
              Explore {item.title}
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
