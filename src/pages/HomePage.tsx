import { SolutionDirectory } from "../components/sections/SolutionDirectory";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Code2,
  Database,
  Layers3,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Seo } from "../components/ui/Seo";
import { Reveal } from "../components/ui/Reveal";
import { SystemCanvas } from "../components/sections/SystemCanvas";
import { CapabilityExplorer } from "../components/sections/CapabilityExplorer";
import { DeliveryJourney } from "../components/sections/DeliveryJourney";
import { TechnologyRibbon } from "../components/sections/TechnologyRibbon";
import { VideoPanel } from "../components/ui/VideoPanel";
import {
  BusinessPriorities,
  ProjectReadiness,
} from "../components/sections/BusinessPriorities";
import { EngagementOptions } from "../components/sections/EditorialSections";
import { CTA } from "../components/sections/CTA";
import { contentRepository } from "../content/repository";
import { homeFaqs, solutionPaths } from "../content/homeExperience";

export default function HomePage() {
  const industries = contentRepository.getIndustries();
  return (
    <>
      <Seo
        title="SENZOFT | Software, Cloud & Intelligent Solutions"
        description="Thoughtful digital products, connected data and dependable technology. Explore SENZOFT software engineering, cloud, AI and modernization services."
      />
      <section className="studio-hero enterprise-hero">
        <div className="hero-aura aura-coral" aria-hidden="true" />
        <div className="hero-aura aura-violet" aria-hidden="true" />
        <div className="container-shell hero-layout">
          <Reveal>
            <span className="hero-pill">
              <span />
              Software engineering. Human perspective.
            </span>
            <h1 className="hero-title">
              Engineering the digital core.
              <br />
              <span className="ink-gradient">
                Designed for
                <br />
                what comes next.
              </span>
            </h1>
            <p className="hero-description">
              From the first idea to the systems behind your business. We bring
              software, cloud and intelligence together to create technology
              that works for people.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/services" className="btn btn-dark">
                Explore our expertise
                <ArrowUpRight size={17} />
              </Link>
              <Link to="/contact" className="btn btn-outline">
                Let's build something
                <ArrowRight size={17} />
              </Link>
            </div>
            <div className="hero-principles">
              {[
                [Code2, "Thoughtful engineering"],
                [Layers3, "Connected capabilities"],
                [ShieldCheck, "Trust by design"],
              ].map(([Icon, label]) => {
                const ItemIcon = Icon as typeof Code2;
                return (
                  <span key={label as string}>
                    <ItemIcon size={15} />
                    {label as string}
                  </span>
                );
              })}
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="enterprise-film">
              <VideoPanel clip="digital" className="aspect-[4/5]" />
              <div className="enterprise-film-caption">
                <span>Built around people</span>
                <strong>
                  Technology that moves
                  <br />
                  your business forward.
                </strong>
              </div>
            </div>
          </Reveal>
        </div>
        <div className="container-shell hero-bottom">
          <span>IDEAS TO IMPACT</span>
          <p>
            A clear purpose. A considered approach. A foundation for change.
          </p>
          <a href="#possibilities" aria-label="Explore what we can build">
            <ArrowRight size={19} />
          </a>
        </div>
      </section>
      <section className="enterprise-introduction">
        <div className="container-shell">
          <div>
            <span className="eyebrow">The work behind progress</span>
            <h2>
              Business understanding.
              <br />
              Engineering depth.
              <br />
              <em>Shared ownership.</em>
            </h2>
          </div>
          <div>
            <p>
              New products, established systems and everyday operations are
              connected. Improving one means understanding the people,
              information and dependencies around it.
            </p>
            <p>
              SENZOFT brings consulting, software delivery, data and cloud
              capabilities into a shared plan. We help define the first useful
              outcome, build the foundations around it and prepare your team to
              own what comes next.
            </p>
            <Link to="/about">
              Discover our approach <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </section>
      <div className="enterprise-feature-strip container-shell">
        <span>In focus</span>
        <Link to="/services/data-ai">
          Turning AI experiments into useful work <ArrowUpRight size={18} />
        </Link>
        <Link to="/services/application-modernization">
          A practical path through modernization <ArrowUpRight size={18} />
        </Link>
      </div>
      <TechnologyRibbon />
      <section id="possibilities" className="section">
        <div className="container-shell">
          <Reveal className="section-intro">
            <div>
              <span className="eyebrow">Built around your next move</span>
              <h2 className="section-heading mt-5">
                Ambitious ideas.
                <br />
                Practical possibilities.
              </h2>
            </div>
            <p>
              Choose a starting point that reflects your business. We connect
              the experience people see with the technology and operations that
              make it work.
            </p>
          </Reveal>
          <div className="solution-grid mt-10">
            {solutionPaths.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08} className="h-full">
                <Link
                  to={item.href}
                  className={`solution-card solution-${item.kind}`}
                >
                  <div className="solution-visual" aria-hidden="true">
                    {item.kind === "product" ? (
                      <>
                        <div className="mini-browser">
                          <i />
                          <i />
                          <i />
                          <div />
                          <span />
                          <span />
                          <span />
                        </div>
                        <span className="mini-badge">
                          <Code2 size={18} />
                        </span>
                      </>
                    ) : item.kind === "data" ? (
                      <>
                        <div className="data-bars">
                          {[36, 60, 44, 82, 66, 94, 73].map((h, j) => (
                            <i key={j} style={{ height: h }} />
                          ))}
                        </div>
                        <span className="mini-badge">
                          <Database size={18} />
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="platform-stack">
                          <span />
                          <span />
                          <span />
                        </div>
                        <span className="mini-badge">
                          <ShieldCheck size={18} />
                        </span>
                      </>
                    )}
                  </div>
                  <div className="p-7">
                    <p className="micro-label">{item.category}</p>
                    <h3 className="mt-3 text-2xl font-semibold tracking-tight">
                      {item.title}
                    </h3>
                    <p className="mt-4 leading-7 text-brand-muted">
                      {item.copy}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span className="surface-tag" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="mt-7 flex items-center justify-between text-sm font-semibold">
                      Explore this direction
                      <ArrowUpRight size={19} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <CapabilityExplorer />
      <section className="section">
        <div className="container-shell product-story">
          <Reveal>
            <span className="eyebrow">
              The experience is only the beginning
            </span>
            <h2 className="section-heading mt-5">
              Beautiful on the surface.
              <br />
              <span className="ink-gradient">Considered at every layer.</span>
            </h2>
            <p className="mt-6 max-w-xl leading-8 text-brand-muted">
              A useful digital product connects a clear interface with reliable
              information, well-defined services and an operating model people
              can sustain. We design those layers together.
            </p>
            <div className="mt-6 space-y-4">
              {[
                "Journeys that make the next step clear",
                "Architecture with room for useful change",
                "Quality and security throughout delivery",
              ].map((item) => (
                <p
                  key={item}
                  className="flex items-center gap-3 text-sm font-medium"
                >
                  <Check size={17} className="text-brand-orange" />
                  {item}
                </p>
              ))}
            </div>
            <Link
              className="mt-7 inline-flex items-center gap-2 font-semibold"
              to="/services/digital-engineering"
            >
              Explore digital engineering
              <ArrowUpRight size={17} />
            </Link>
          </Reveal>
          <Reveal delay={0.12}>
            <div
              className="layer-composition"
              aria-label="Four connected layers of a digital product"
            >
              {[
                ["01", "Experience", "Clear journeys. Accessible interfaces."],
                ["02", "Intelligence", "Useful data. Thoughtful automation."],
                [
                  "03",
                  "Engineering",
                  "Connected services. Dependable releases.",
                ],
                ["04", "Operations", "Visible performance. Shared ownership."],
              ].map(([n, title, copy]) => (
                <div className="product-layer" key={n}>
                  <span>{n}</span>
                  <div>
                    <strong>{title}</strong>
                    <p>{copy}</p>
                  </div>
                  <Layers3 size={20} />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
      <section className="section industry-section">
        <div className="container-shell">
          <Reveal className="section-intro">
            <div>
              <span className="eyebrow">Technology meets context</span>
              <h2 className="section-heading mt-5">
                Your industry.
                <br />
                Its own set of possibilities.
              </h2>
            </div>
            <p>
              Every sector has different users, dependencies and operating
              pressures. Explore approaches grounded in those realities.
            </p>
          </Reveal>
          <div className="industry-directory mt-9">
            {industries.map((item, i) => (
              <Link key={item.slug} to={`/industries/${item.slug}`}>
                <span className="text-xs text-brand-orange">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                </div>
                <ArrowUpRight size={21} />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <DeliveryJourney />
      <BusinessPriorities />
      <section className="section engineering-model">
        <div className="container-shell editorial-grid">
          <div>
            <span className="eyebrow">One connected engineering model</span>
            <h2 className="section-heading mt-5">
              The right connections
              <br />
              make change possible.
            </h2>
            <p className="mt-6 leading-8 text-brand-muted">
              Experience, applications and platforms need to evolve together.
              Explore how our engineering model connects delivery, information
              and continuous improvement.
            </p>
            <p className="mt-5 leading-8 text-brand-muted">
              Each engagement defines the boundaries between systems, the people
              who own them and the evidence needed to release with confidence.
              That shared understanding supports both the first launch and the
              changes that follow.
            </p>
            <Link to="/services" className="btn btn-dark mt-6">
              See our connected capabilities
              <ArrowUpRight size={17} />
            </Link>
          </div>
          <SystemCanvas />
        </div>
      </section>
      <SolutionDirectory />
      <EngagementOptions />
      <ProjectReadiness />
      <section className="section faq-section">
        <div className="container-shell editorial-grid">
          <Reveal>
            <span className="eyebrow">Before we begin</span>
            <h2 className="section-heading mt-5">
              Good questions.
              <br />
              Clearer next steps.
            </h2>
            <p className="mt-5 leading-8 text-brand-muted">
              A few things you might want to know about working with us. Have a
              different question? Start a conversation with the team.
            </p>
            <Link to="/contact" className="btn btn-dark mt-6">
              Talk to SENZOFT
              <ArrowUpRight size={16} />
            </Link>
          </Reveal>
          <div>
            {homeFaqs.map(([question, answer]) => (
              <details key={question} className="studio-faq">
                <summary>
                  {question}
                  <ChevronDown size={18} />
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container-shell careers-invite">
          <div>
            <span className="eyebrow">Create your next chapter</span>
            <h2 className="section-heading mt-5">
              Good work starts
              <br />
              with curious people.
            </h2>
            <p className="mt-5 max-w-xl leading-8 text-brand-muted">
              Bring your perspective to meaningful engineering challenges.
              Explore our working principles, career pathways and areas of
              opportunity.
            </p>
            <Link to="/careers" className="btn btn-dark mt-6">
              Explore careers
              <ArrowUpRight size={17} />
            </Link>
          </div>
          <div className="craft-composition" aria-hidden="true">
            <span>Think.</span>
            <span>Build.</span>
            <span>Evolve.</span>
            <Code2 size={36} />
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
