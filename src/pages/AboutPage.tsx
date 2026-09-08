import { Compass, Handshake, Lightbulb, ShieldCheck } from "lucide-react";
import { CTA } from "../components/sections/CTA";
import { PageHero } from "../components/ui/PageHero";
import { Reveal } from "../components/ui/Reveal";
import { Seo } from "../components/ui/Seo";
const values = [
  ["Clarity", "Make complex decisions understandable.", Compass],
  ["Ownership", "Stay accountable from intent to outcome.", ShieldCheck],
  ["Curiosity", "Look deeper and keep learning.", Lightbulb],
  ["Partnership", "Build progress together.", Handshake],
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
      <section className="section">
        <div className="container-shell grid gap-12 lg:grid-cols-2">
          <Reveal>
            <span className="eyebrow">Our purpose</span>
            <h2 className="display mt-6 text-5xl">
              Make technology useful, trusted and human.
            </h2>
          </Reveal>
          <div className="space-y-6 text-lg leading-8 text-brand-muted">
            <p>
              We believe transformation works when business context, thoughtful
              design and disciplined engineering move together.
            </p>
            <p>
              Our teams are shaped around the problem—not a predetermined
              solution. We listen, simplify and build with the people who will
              use and sustain the change.
            </p>
            <p className="rounded-xl bg-brand-cream p-4 text-sm">
              <strong className="text-brand-ink">Content note:</strong> Company
              history, leadership, locations and certifications will be
              published after formal approval.
            </p>
          </div>
        </div>
      </section>
      <section className="section bg-brand-cream">
        <div className="container-shell">
          <span className="eyebrow">Our values</span>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {values.map(([title, text, Icon]) => (
              <div className="card p-7" key={title}>
                <Icon className="text-brand-orange" />
                <h3 className="mt-8 text-2xl font-bold">{title}</h3>
                <p className="mt-3 leading-7 text-brand-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container-shell">
          <span className="eyebrow">How we create impact</span>
          <h2 className="display mt-6 max-w-4xl text-5xl md:text-6xl">
            Small enough to stay close. Structured to deliver well.
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
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
              <article className="rounded-2xl bg-brand-peach p-8" key={title}>
                <h3 className="display text-3xl">{title}</h3>
                <p className="mt-5 leading-7 text-brand-muted">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section bg-brand-sage">
        <div className="container-shell grid gap-10 lg:grid-cols-2">
          <div>
            <span className="eyebrow">Our commitment</span>
            <h2 className="display mt-6 text-5xl">
              Responsible progress by design.
            </h2>
          </div>
          <div className="grid gap-4">
            {[
              "Accessible and inclusive digital experiences",
              "Responsible use of data and artificial intelligence",
              "Security and privacy built into delivery",
              "Sustainable, maintainable technology choices",
            ].map((item) => (
              <div className="rounded-xl bg-white p-5 font-bold" key={item}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
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
        title="Leadership profiles are being prepared."
        description="We will publish verified profiles after review and approval. No placeholder identities are presented as fact."
      />
      <section className="section">
        <div className="container-shell text-center">
          <p className="text-brand-muted">
            For company or leadership enquiries, please contact our team.
          </p>
        </div>
      </section>
      <CTA />
    </>
  );
}
