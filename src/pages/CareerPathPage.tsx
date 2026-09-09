import { Link, useParams } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "../components/ui/PageHero";
import { Seo } from "../components/ui/Seo";
import { EditorialSections } from "../components/sections/EditorialSections";
import { CareerDevelopment } from "../components/sections/CareerDevelopment";
import { NotFoundPage } from "./UtilityPages";

const paths: Record<
  string,
  { title: string; intro: string; focus: [string, string][] }
> = {
  "early-careers": {
    title: "Early Careers",
    intro:
      "Build a foundation for a career in software and technology. Explore the habits, practical skills and examples that help you contribute to a delivery team, whether your first interest is engineering, analysis or quality.",
    focus: [
      [
        "Connect learning to a real problem",
        "Choose a small project with a clear user and purpose. Explain what the application or process should do, then use the work to practice the fundamentals rather than collecting features without a reason.",
      ],
      [
        "Make your reasoning visible",
        "Use a README, a short walkthrough or a process diagram to show the decisions behind your work. Describe what you built yourself, the help you used and what you would improve with more time.",
      ],
      [
        "Build constructive working habits",
        "Practice asking focused questions, responding to feedback and keeping small commitments. Working well with others includes making uncertainty visible and understanding when another perspective is needed.",
      ],
    ],
  },
  "experienced-professionals": {
    title: "Experienced Professionals",
    intro:
      "Bring depth in your discipline and a wider view of delivery. We value people who can connect technical or business judgment with clear communication, practical ownership and the ability to help colleagues succeed.",
    focus: [
      [
        "Show the depth of your contribution",
        "Describe an important decision from your work and the constraints around it. Explain how you compared options, involved other specialists and checked whether the chosen approach solved the intended problem.",
      ],
      [
        "Connect delivery with operations",
        "Share how your work was released, adopted or handed over. Discuss reliability, support, documentation and the changes you made in response to what happened after the initial delivery.",
      ],
      [
        "Multiply the team's understanding",
        "Leadership can appear in a clear review, a useful technical explanation or a difficult tradeoff made visible. Give examples of how you helped others make better decisions while keeping ownership and accountability clear.",
      ],
    ],
  },
  internships: {
    title: "Internship Pathways",
    intro:
      "Explore the transition from structured learning to collaborative project work. Internship opportunities depend on available scope and supervision; you can register interest and describe the skills and learning goals you want to develop.",
    focus: [
      [
        "Identify a practical learning goal",
        "Choose an area such as interface development, analysis or testing, and explain the foundations you have already practiced. A clear learning goal helps frame the kind of project contribution that would be useful.",
      ],
      [
        "Prepare a small body of work",
        "Share an appropriate academic or personal project and explain its purpose. Include the decisions, limitations and learning, rather than presenting a finished screen without the thinking behind it.",
      ],
      [
        "Discuss availability and expectations",
        "Be ready to explain your study commitments, availability and any academic requirements. The scope, supervision and working arrangements would be discussed for a confirmed opportunity before participation begins.",
      ],
    ],
  },
};
export default function CareerPathPage() {
  const { pathSlug } = useParams();
  const path = paths[pathSlug ?? ""];
  if (!path) return <NotFoundPage />;
  return (
    <>
      <Seo title={`${path.title} | SENZOFT Careers`} description={path.intro} />
      <PageHero
        eyebrow="Careers at SENZOFT"
        title={path.title}
        description={path.intro}
      />
      <EditorialSections
        eyebrow="Find your starting point"
        title="Make your next step a considered one."
        description="This pathway explains how to prepare and the contribution we value. Availability, eligibility and working arrangements are confirmed for each opportunity; registering interest does not promise a vacancy or placement."
        items={path.focus}
      />
      <CareerDevelopment />
      <section className="section bg-brand-peach">
        <div className="container-shell">
          <span className="eyebrow">Explore career disciplines</span>
          <h2 className="section-heading mt-5">
            See where your skills can contribute.
          </h2>
          <div className="offering-grid">
            {[
              [
                "Frontend engineering",
                "Explore interface development, application behavior and quality, and introduce your experience in building digital products.",
                "/careers/frontend-engineer",
              ],
              [
                "Business analysis",
                "Explore how process understanding, requirements and stakeholder communication connect business goals with delivery.",
                "/careers/business-analyst",
              ],
              [
                "Stay connected",
                "Return to Careers to register with the talent network and tell us you would like to hear about future opportunities.",
                "/careers",
              ],
            ].map(([title, copy, href]) => (
              <Link className="offering-card" key={title} to={href}>
                <h3>{title}</h3>
                <p>{copy}</p>
                <span className="offering-link">
                  Explore further
                  <ArrowUpRight size={18} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
