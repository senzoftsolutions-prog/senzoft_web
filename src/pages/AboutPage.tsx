import { Link } from "react-router-dom";
import { DeliveryJourney } from "../components/sections/DeliveryJourney";
import { CompanyOverview } from "../components/sections/CompanyOverview";
import { EditorialSections } from "../components/sections/EditorialSections";
import { VideoStory } from "../components/sections/VideoStory";
import { Compass, Handshake, Lightbulb, ShieldCheck } from "lucide-react";
import { CTA } from "../components/sections/CTA";
import { PageHero } from "../components/ui/PageHero";
import { Reveal } from "../components/ui/Reveal";
import { Seo } from "../components/ui/Seo";
const values = [
  [
    "Clarity",
    "Turn an open question into a decision the team can act on. We make assumptions, priorities and acceptance criteria visible so business and engineering share the same understanding.",
    Compass,
  ],
  [
    "Ownership",
    "Connect delivery decisions with the people who will maintain the result. We define responsibilities, document important choices and prepare operational guidance alongside implementation.",
    ShieldCheck,
  ],
  [
    "Curiosity",
    "Explore the reason behind a requirement before choosing a solution. Research, prototypes and technical investigation help uncover constraints and test whether an approach is useful.",
    Lightbulb,
  ],
  [
    "Partnership",
    "Work with the knowledge already in your organization. Shared reviews, clear communication and practical knowledge transfer help your team participate in the change and sustain it.",
    Handshake,
  ],
] as const;
export default function AboutPage() {
  return (
    <>
      <Seo
        title="About SENZOFT"
        description="Learn about SENZOFT Software Solutions Private Limited."
      />
      <PageHero
        eyebrow="About SENZOFT"
        title="Built to turn ideas into meaningful impact."
        description="SENZOFT Software Solutions Private Limited brings consulting, software engineering and managed IT services together to help organizations navigate change with confidence."
      />
      <CompanyOverview />
      <section className="section reference-story-section">
        <div className="container-shell reference-story-grid">
          <Reveal>
            <span className="eyebrow accent">Our purpose</span>
            <h2 className="reference-text-block">
              Make technology useful, trusted and human.
            </h2>
          </Reveal>
          <div className="reference-story-copy">
            <p>
              We believe transformation works when business context, thoughtful
              design and disciplined engineering move together.
            </p>
            <p>
              Our teams are shaped around the problem—not a predetermined
              solution. We listen, simplify and build with the people who will
              use and sustain the change.
            </p>
          </div>
        </div>
      </section>
      <section className="section reference-values-section">
        <div className="container-shell">
          <span className="eyebrow accent">Our values</span>
          <div className="reference-value-grid">
            {values.map(([title, text, Icon], index) => (
              <Link
                to={
                  [
                    "/services/business-consulting",
                    "/services/managed-it-services",
                    "/services/application-modernization",
                    "/services/enterprise-applications",
                  ][index]
                }
                className="reference-value-card"
                key={title}
              >
                <Icon className="text-brand-orange" />
                <h3>{title}</h3>
                <p>{text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section reference-impact-section">
        <div className="container-shell">
          <span className="eyebrow accent">How we create impact</span>
          <h2 className="reference-impact-title">
            Small enough to stay close. Structured to deliver well.
          </h2>
          <div className="reference-impact-grid">
            {[
              [
                "Business-led",
                "Every technology decision connects to a user, operational or growth outcome.",
              ],
              [
                "Engineering-minded",
                "Architecture, quality, security and maintainability are part of the work from day one.",
              ],
              [
                "Built together",
                "Open collaboration and knowledge transfer help change last beyond delivery.",
              ],
            ].map(([title, copy]) => (
              <article className="reference-impact-card" key={title}>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section reference-commitment-section">
        <div className="container-shell reference-commitment-grid">
          <div>
            <span className="eyebrow accent">Our commitment</span>
            <h2 className="reference-commitment-title">
              Responsible progress by design.
            </h2>
          </div>
          <div className="reference-commitment-list">
            {[
              "Accessible and inclusive digital experiences",
              "Responsible use of data and artificial intelligence",
              "Security and privacy built into delivery",
              "Sustainable, maintainable technology choices",
            ].map((item) => (
              <div key={item}>{item}</div>
            ))}
          </div>
        </div>
      </section>
      <VideoStory
        clip="collaboration"
        eyebrow="A shared way of working"
        title="Good partnerships make the work clearer."
        description="We value direct conversations, visible decisions and useful feedback. Business specialists, designers and engineers contribute different perspectives to the same delivery problem."
        href="/services"
        linkLabel="Explore our expertise"
      />
      <EditorialSections
        eyebrow="Partnership in practice"
        title="Clarity at every handoff."
        description="A working relationship should make it easier to understand progress and make decisions. These principles guide how we shape an engagement."
        items={[
          [
            "A shared definition of done",
            "Agree the scope, acceptance criteria and responsibilities before delivery begins. Make tradeoffs visible when priorities change.",
          ],
          [
            "Progress you can review",
            "Use working demonstrations and written decisions to build a shared view of progress. Address uncertainty while there is still time to adapt.",
          ],
          [
            "Knowledge that stays with you",
            "Treat documentation, operational guidance and knowledge transfer as delivery work. Prepare the people who will maintain and evolve the result.",
          ],
        ]}
      />
      <DeliveryJourney />
      <CTA />
    </>
  );
}
export function LeadershipPage() {
  return (
    <>
      <Seo
        title="Leadership | SENZOFT"
        description="SENZOFT leadership information."
      />
      <PageHero
        eyebrow="Leadership"
        title="Clear direction. Shared accountability."
        description="Our leadership perspective connects business priorities, engineering judgment and responsible delivery. Verified individual profiles will be added after review."
      />
      <EditorialSections
        eyebrow="Accountability in delivery"
        title="Know who owns the next decision."
        description="A useful leadership structure gives each engagement clear decision rights. Responsibilities are agreed for the scope of work and reviewed as the delivery team takes shape."
        items={[
          [
            "Business priorities and sponsorship",
            "The business owner clarifies the intended outcome, resolves priority conflicts and confirms acceptance. Regular checkpoints connect the delivery backlog to changing customer and operational needs.",
          ],
          [
            "Architecture and engineering judgment",
            "Technical ownership covers system boundaries, integration choices and quality expectations. Significant decisions should include the alternatives considered, the reasons for the choice and the consequences for future maintenance.",
          ],
          [
            "Delivery and operational readiness",
            "Delivery ownership keeps dependencies, risks and progress visible. Operational responsibilities include release readiness, support handoffs and a clear route for escalating issues after launch.",
          ],
        ]}
      />
      <EditorialSections
        eyebrow="Leadership perspective"
        title="Create the conditions for good decisions."
        description="The following principles describe our approach to leading delivery. They are not individual biographies or claims of formal governance certifications."
        dark
        items={[
          [
            "Keep purpose visible",
            "Connect technical decisions to the people and processes they affect. Revisit the intended outcome when the scope or business context changes.",
          ],
          [
            "Invite different expertise",
            "Bring business, design, engineering and operations into important decisions early. Make room for questions and evidence that challenge an assumption.",
          ],
          [
            "Own the follow-through",
            "Assign responsibility for decisions, risks and operational handoffs. Review what happened after delivery and carry the learning into the next engagement.",
          ],
        ]}
      />
      <section className="section">
        <div className="container-shell editorial-grid">
          <div>
            <span className="eyebrow">Working through uncertainty</span>
            <h2 className="section-heading mt-5">
              Make tradeoffs visible early.
            </h2>
            <p className="mt-5 leading-8 text-brand-muted">
              A delivery plan becomes more useful when people can raise a
              concern, understand its implications and identify who can resolve
              it.
            </p>
          </div>
          <div className="space-y-5">
            <div>
              <h3 className="text-xl font-bold">When scope changes</h3>
              <p className="mt-3 leading-7 text-brand-muted">
                Describe the new requirement and compare its value, dependencies
                and delivery effort with the existing priorities. Record what
                moves, what remains in scope and who accepts the revised plan.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold">
                When a risk becomes an issue
              </h3>
              <p className="mt-3 leading-7 text-brand-muted">
                Identify the affected workflow and the immediate decision
                needed. Assign an owner, communicate the options and maintain a
                record of the response so the team can learn from it.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold">
                When delivery is ready to hand over
              </h3>
              <p className="mt-3 leading-7 text-brand-muted">
                Review acceptance evidence with business and operational owners.
                Confirm documentation, support responsibilities and the
                improvement work that should continue after release.
              </p>
            </div>
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
