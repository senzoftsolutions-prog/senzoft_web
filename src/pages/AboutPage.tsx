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
