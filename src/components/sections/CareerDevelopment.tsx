import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { EditorialSections } from "./EditorialSections";
import { careersData } from "../../content/careers";

export function CareerDevelopment({ engineering }: { engineering?: boolean }) {
  const practice: [string, string][] =
    engineering === undefined
      ? [
          [
            "Understand the purpose",
            "Connect each task with the person or process it should help. Ask what a useful result looks like, which constraints matter and how the team will know whether the work is ready.",
          ],
          [
            "Collaborate across disciplines",
            "Business analysis, design, engineering and quality contribute different information. Learn to explain your work clearly, listen to another perspective and capture decisions so the next person has the context they need.",
          ],
          [
            "Learn from the result",
            "Follow your contribution through review and use. Pay attention to feedback, questions and unexpected behavior, then turn the learning into a concrete improvement in your next piece of work.",
          ],
        ]
      : engineering
        ? [
            [
              "Translate the journey into components",
              "Understand what a user is trying to accomplish before choosing the interface structure. Build semantic markup, clear states and reusable components that remain understandable to another engineer. Consider keyboard use, responsive behavior and content from the beginning.",
            ],
            [
              "Connect behavior with reliable data",
              "Work through loading, error and empty states as carefully as the successful path. Review application interfaces with backend colleagues, validate user input and avoid presenting uncertain information as a completed action.",
            ],
            [
              "Review the result in context",
              "Use a browser, representative devices and automated checks to assess the user journey. Explain the tradeoffs in a review, investigate regressions and leave notes that help the next person understand the implementation.",
            ],
          ]
        : [
            [
              "Understand the process as it operates",
              "Listen to the people doing the work and distinguish the intended process from the exceptions they manage every day. Map handoffs, information sources and decision rights before proposing a change.",
            ],
            [
              "Turn needs into testable requirements",
              "Describe the user, intended behavior and conditions for acceptance. Make dependencies and unresolved questions visible so design and engineering can compare options with business stakeholders.",
            ],
            [
              "Keep decisions connected to delivery",
              "Support clarification during implementation and review working increments against the intended outcome. Record changes in assumptions, help organize acceptance feedback and prepare the information needed for adoption.",
            ],
          ];
  return (
    <>
      <EditorialSections
        eyebrow="The work in practice"
        title={
          engineering === undefined
            ? "Contribute with context and care."
            : engineering
              ? "Build interfaces with depth behind the detail."
              : "Make a complex situation easier to act on."
        }
        description="These examples explain the contribution we value in this career discipline. Responsibilities for a particular opportunity are discussed when a relevant vacancy is available."
        items={practice}
        dark
      />
      <section className="section">
        <div className="container-shell">
          <span className="eyebrow">Growing your contribution</span>
          <h2 className="section-heading mt-5">
            Develop the craft.
            <br />
            Expand your perspective.
          </h2>
          <div className="delivery-chapters">
            {[
              [
                "Strengthen your foundations",
                engineering === undefined
                  ? "Develop the fundamentals of your chosen discipline through practical work. Explain the purpose, review the result and use feedback to identify a concrete area for further practice."
                  : engineering
                    ? "Practice accessible HTML, layout, application state and the behavior of the browser. Explain why an implementation works and identify what could fail when the data, screen size or user interaction changes."
                    : "Practice structured questioning, process mapping and writing acceptance criteria. Explain how a requirement relates to the original problem and where more evidence is needed before making a recommendation.",
              ],
              [
                "Learn through collaboration",
                "Use feedback to improve the next decision. Bring questions to design walkthroughs, code reviews or planning conversations, and make your reasoning clear enough for people with different expertise to contribute.",
              ],
              [
                "Follow the outcome",
                "Take an interest in what happens after your contribution is handed over. Understand the feedback from users, the questions raised during testing and the information that operations needs to sustain the result.",
              ],
              [
                "Build accountable ownership",
                "Keep commitments and dependencies visible. Raise uncertainty while there is time to respond, and document the decisions that another person will need to maintain or extend the work.",
              ],
            ].map(([title, copy], i) => (
              <article key={title}>
                <span>0{i + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <EditorialSections
        eyebrow="Preparing your examples"
        title="Show the thinking behind your work."
        description="A portfolio or discussion is most useful when it explains your contribution and the decisions behind it. Select examples you are permitted to share and remove private client or employer information."
        items={[
          [
            "Describe the starting point",
            "Explain the user or business problem, the constraints and the part you owned. A short, concrete explanation helps the team understand the context without needing access to the original system.",
          ],
          [
            "Explain an important tradeoff",
            "Choose a decision where you considered more than one approach. Describe the evidence you had, why you chose the direction and what you learned once the work was reviewed or used.",
          ],
          [
            "Reflect on what changed",
            "Talk about a setback, a review comment or feedback that improved your work. Include what you would repeat and what you would approach differently with the same problem today.",
          ],
        ]}
      />
      <section className="section">
        <div className="container-shell editorial-grid">
          <div>
            <span className="eyebrow">A conversation with context</span>
            <h2 className="section-heading mt-5">Understand the next steps.</h2>
            <p className="mt-6 leading-8 text-brand-muted">
              Registering interest helps introduce your background. When a
              relevant opportunity is available, the team can discuss the role,
              working arrangements and any assessment before you commit to the
              process.
            </p>
            <Link
              to={
                engineering
                  ? "/services/digital-engineering"
                  : "/services/business-consulting"
              }
              className="btn btn-dark mt-7"
            >
              Explore the work behind this discipline
              <ArrowUpRight size={17} />
            </Link>
          </div>
          <div>
            {careersData.faqs.map((faq) => (
              <details key={faq.q} className="studio-faq">
                <summary>{faq.q}</summary>
                <p>{faq.a}</p>
              </details>
            ))}
            <Link
              to="/careers"
              className="mt-8 inline-flex items-center gap-3 font-semibold"
            >
              Explore life at SENZOFT
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
