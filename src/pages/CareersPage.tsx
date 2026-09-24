import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Reveal } from "../components/ui/Reveal";
import { Seo } from "../components/ui/Seo";
import "../styles/careers.css";

const chapters = [
  {
    title: "Life at Senzoft",
    description: "Discover how thoughtful teams collaborate, share knowledge and turn complex challenges into useful work.",
    image: "/media/careers-life-office.webp",
    alt: "Illustrative view of technology professionals working together in a modern office",
    to: "/careers/life-at-senzoft",
  },
  {
    title: "Benefits and support",
    description: "Explore the experiences that help people do meaningful work and keep developing their careers.",
    image: "/media/careers-growth-conversation.webp",
    alt: "Illustrative professional mentoring conversation in a modern office",
    to: "/careers/benefits",
  },
  {
    title: "Grow your career",
    description: "Take on practical challenges, build your craft and learn with colleagues across engineering and design.",
    image: "/media/careers-team-collaboration.webp",
    alt: "Illustrative software team discussing a digital product at work",
    to: "/careers/life-at-senzoft#growth",
  },
  {
    title: "A culture of ideas",
    description: "See what happens when different perspectives meet with curiosity, clarity and shared ownership.",
    image: "/media/careers-culture-meeting.webp",
    alt: "Illustrative technology team exchanging ideas in a meeting room",
    to: "/careers/life-at-senzoft#culture",
  },
] as const;

const values = ["Curiosity in every question", "Ownership of the outcome", "Learning through doing", "Progress built together"];

export default function CareersPage() {
  return (
    <>
      <Seo title="Careers at Senzoft | Build What Comes Next" description="Explore life, growth and career opportunities at Senzoft." />

      <section className="career-editorial-hero" aria-labelledby="career-title">
        <div className="career-editorial-hero-copy">
          <div>
            <p className="career-editorial-kicker">At the heart of what comes next</p>
            <h1 id="career-title">Careers at Senzoft</h1>
            <p className="career-editorial-hero-summary">Bring your perspective to work that makes technology more useful for people and businesses.</p>
            <Link to="/careers/openings" className="career-editorial-link">Explore roles <ArrowRight size={20} /></Link>
          </div>
        </div>
        <div className="career-editorial-hero-image">
          <img src="/media/careers-hero-professional.webp" alt="Illustrative portrait of a technology professional in a modern office" fetchPriority="high" />
        </div>
      </section>

      <section className="career-editorial-intro" aria-labelledby="career-intro-title">
        <div className="career-editorial-intro-image">
          <img src="/media/cta-software-engineering-v2.png" alt="Illustrative software engineering team reviewing application architecture" loading="lazy" />
        </div>
        <div className="career-editorial-intro-copy">
          <div>
            <p className="career-editorial-kicker">Make an impact together</p>
            <h2 id="career-intro-title">Technology moves forward when people do.</h2>
            <p>At Senzoft, we bring different skills together to solve real business problems. Explore how our teams learn, collaborate and turn ideas into dependable digital experiences.</p>
            <Link to="/careers/life-at-senzoft" className="career-editorial-link">Discover life at Senzoft <ArrowRight size={20} /></Link>
          </div>
        </div>
      </section>

      <section className="career-editorial-values" aria-label="What shapes our work">
        <div className="container-shell">
          <p className="career-editorial-kicker">What shapes our work</p>
          <div className="career-editorial-values-grid">{values.map((value, index) => <Reveal key={value} delay={index * .08}><span className="career-editorial-value-number">0{index + 1}</span><strong>{value}</strong></Reveal>)}</div>
        </div>
      </section>

      <section className="career-editorial-chapters" aria-labelledby="career-chapters-title">
        <div className="career-editorial-chapter-heading">
          <p className="career-editorial-kicker">Explore your next chapter</p>
          <h2 id="career-chapters-title">Your next chapter starts here.</h2>
        </div>
        <div className="career-editorial-chapter-list">
          {chapters.map((chapter, index) => (
            <article className={`career-editorial-chapter ${index % 2 ? "is-reversed" : ""}`} key={chapter.title}>
              <Link to={chapter.to} className="career-editorial-chapter-image" aria-label={`Explore ${chapter.title}`}><img src={chapter.image} alt={chapter.alt} loading="lazy" /></Link>
              <div className="career-editorial-chapter-copy">
                <div>
                  <h3>{chapter.title}</h3>
                  <p>{chapter.description}</p>
                  <Link to={chapter.to} className="career-editorial-button">Learn more <ArrowRight size={20} /></Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="career-editorial-final" aria-label="Careers next steps"><div className="container-shell career-editorial-final-grid"><div><p className="career-editorial-kicker">Your next step</p><h2>Explore a role that moves you.</h2><Link to="/careers/openings" className="career-editorial-link">Browse roles <ArrowRight size={20} /></Link></div><div><p className="career-editorial-kicker">Stay connected</p><h2>Keep the conversation open.</h2><a href="mailto:careers@senzoft.com?subject=Talent%20Network%20Interest" className="career-editorial-link">Join the talent network <ArrowRight size={20} /></a></div></div></section>
    </>
  );
}
