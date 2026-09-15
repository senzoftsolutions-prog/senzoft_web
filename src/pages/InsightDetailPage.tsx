import { ArrowUpRight, Clock3 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { CTA } from "../components/sections/CTA";
import { RelatedContent } from "../components/sections/RelatedContent";
import { PageHero } from "../components/ui/PageHero";
import { Seo } from "../components/ui/Seo";
import { articles } from "../content/articles";
import { insights } from "../content/insights";
import { contentRepository } from "../content/repository";
import { NotFoundPage } from "./UtilityPages";

export default function InsightDetailPage() {
  const { slug } = useParams();
  const insight = insights.find((item) => item.slug === slug);
  if (!insight) return <NotFoundPage />;
  const article = (slug && articles[slug]) || {
    thesis: insight.summary,
    service: insight.title.toLowerCase().includes("cloud")
      ? "cloud-platforms"
      : insight.title.toLowerCase().includes("ai") ||
          insight.title.toLowerCase().includes("data")
        ? "data-ai"
        : "digital-engineering",
    sections: [
      {
        title: "Begin with the operating question",
        paragraphs: [
          "A useful technology decision starts with the people, workflow and outcome involved. Document the current friction, the systems that participate and the evidence that would demonstrate improvement.",
          "This framing keeps implementation choices connected to business context and exposes dependencies before they become delivery surprises.",
        ],
      },
      {
        title: "Make trade-offs explicit",
        paragraphs: [
          "Compare options across usability, integration, security, maintainability and operating effort. A recommendation should explain what is gained, what remains constrained and which assumptions still need validation.",
          "Use a focused prototype or assessment where uncertainty is high. The objective is to learn enough to make the next commitment responsibly.",
        ],
      },
      {
        title: "Deliver with evidence",
        paragraphs: [
          "Break the work into increments that users and operators can review. Define acceptance criteria, quality signals and recovery behavior alongside functional scope.",
          "After launch, combine product feedback with reliability and support signals. Assign ownership so learning becomes a prioritized improvement backlog rather than an unattended report.",
        ],
      },
      {
        title: "Prepare for long-term ownership",
        paragraphs: [
          "Document architecture boundaries, access responsibilities and operational procedures in the course of delivery. Teams should understand how to diagnose problems and make safe changes.",
          "Success measures should use an agreed baseline and named owner. Avoid generic targets that cannot be traced to the workflow being improved.",
        ],
      },
    ],
    questions: [
      "Which business decision or workflow should improve?",
      "What evidence would make the next investment responsible?",
      "Who will own operation and continuous improvement?",
    ],
  };
  const related = contentRepository
    .getServices()
    .find((service) => service.slug === article.service);
  const technologies = contentRepository
    .getTechnologiesForService(article.service)
    .slice(0, 6);
  const solutions = contentRepository
    .getSolutionsForService(article.service)
    .slice(0, 3);
  const cases = contentRepository
    .getCaseStudiesForService(article.service)
    .slice(0, 3);
  return (
    <>
      <Seo title={insight.seo.title} description={insight.seo.description} />
      <PageHero
        eyebrow={`${insight.type} · ${insight.readTime}`}
        title={insight.title}
        description={insight.summary}
        imageSlug={insight.slug}
      />
      <section className="section">
        <div className="container-shell insight-article-layout">
          <aside className="insight-article-meta">
            <span className="eyebrow">SENZOFT insights</span>
            <div className="mt-5 flex items-center gap-2 text-sm text-brand-muted">
              <Clock3 size={16} /> {insight.readTime}
            </div>
            <p className="mt-5 text-sm leading-7 text-brand-muted">
              Published{" "}
              {new Date(insight.publishedAt).toLocaleDateString("en-GB", {
                dateStyle: "long",
              })}
            </p>
            {related && (
              <Link
                to={`/services/${related.slug}`}
                className="mt-8 inline-flex items-center gap-2 font-bold text-brand-orange"
              >
                Related capability <ArrowUpRight size={16} />
              </Link>
            )}
          </aside>
          <article className="insight-article-copy">
            <p className="insight-thesis">{article.thesis}</p>
            {article.sections.map((section, index) => (
              <section key={section.title}>
                <span className="text-sm font-black text-brand-orange">
                  0{index + 1}
                </span>
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}
            <div className="insight-questions">
              <span className="eyebrow">Questions to carry forward</span>
              <ul>
                {article.questions.map((question) => (
                  <li key={question}>{question}</li>
                ))}
              </ul>
            </div>
          </article>
        </div>
      </section>
      <RelatedContent
        tone="sage"
        eyebrow="From insight to action"
        heading="Explore the connected solution."
        items={[
          ...solutions.map((item) => ({
            ...item,
            href: `/solutions/${item.slug}`,
            label: "Solution",
          })),
          ...cases.map((item) => ({
            ...item,
            href: `/case-studies/${item.slug}`,
            label: "Reference engagement",
          })),
          ...technologies.map((item) => ({
            ...item,
            href: `/technology/${item.slug}`,
            label: item.category,
          })),
          ...insights
            .filter((item) => item.slug !== insight.slug)
            .slice(0, 3)
            .map((item) => ({
              ...item,
              href: `/insights/${item.slug}`,
              label: item.type,
            })),
        ].slice(0, 6)}
      />
      <CTA />
    </>
  );
}
