import { CheckCircle2 } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import { CTA } from "../components/sections/CTA";
import { PageHero } from "../components/ui/PageHero";
import { Seo } from "../components/ui/Seo";
import { contentRepository } from "../content/repository";

export default function DetailPage() {
  const { slug } = useParams();
  const root = useLocation().pathname.split("/")[1];
  const item =
    root === "services"
      ? contentRepository.getServiceBySlug(slug!)
      : root === "industries"
        ? contentRepository.getIndustryBySlug(slug!)
        : contentRepository.getInsightBySlug(slug!);
  if (!item) return <Missing />;
  const first =
    "capabilities" in item
      ? item.capabilities
      : "challenges" in item
        ? item.challenges
        : [
            "What this means for leaders",
            "Where to begin",
            "Building for lasting value",
          ];
  const second =
    "outcomes" in item
      ? item.outcomes
      : "solutions" in item
        ? item.solutions
        : [
            "Connect strategy to everyday work",
            "Design trust into the foundation",
            "Measure adoption and outcomes",
          ];
  return (
    <>
      <Seo title={item.seo.title} description={item.seo.description} />
      <PageHero
        eyebrow={"type" in item ? item.type : root.slice(0, -1)}
        title={item.title}
        description={item.summary}
      />
      <section className="section">
        <div className="container-shell grid gap-14 lg:grid-cols-2">
          <div>
            <span className="eyebrow">Our capabilities</span>
            <h2 className="display mt-6 text-4xl">
              Technology built around the outcome.
            </h2>
            <p className="mt-6 leading-8 text-brand-muted">
              We combine advisory, architecture, engineering and operational
              discipline. Every engagement is shaped around your systems, users
              and priorities.
            </p>
          </div>
          <div className="grid gap-4">
            {first.map((x) => (
              <div className="card flex gap-4 p-5" key={x}>
                <CheckCircle2 className="shrink-0 text-brand-orange" />
                <span className="font-bold">{x}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section bg-brand-cream">
        <div className="container-shell">
          <span className="eyebrow">Business value</span>
          <div className="mt-10 grid gap-px overflow-hidden rounded-3xl bg-black/10 md:grid-cols-3">
            {second.map((x, i) => (
              <div className="bg-white p-8" key={x}>
                <span className="text-sm font-black text-brand-orange">
                  0{i + 1}
                </span>
                <h3 className="mt-8 text-2xl font-bold">{x}</h3>
                <p className="mt-3 text-sm leading-6 text-brand-muted">
                  Delivered through a practical roadmap aligned to your
                  technology landscape and operating context.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
function Missing() {
  return (
    <div className="container-shell py-48 text-center">
      <h1 className="display text-6xl">We couldn’t find that page.</h1>
      <Link className="btn btn-primary mt-8" to="/">
        Return home
      </Link>
    </div>
  );
}
