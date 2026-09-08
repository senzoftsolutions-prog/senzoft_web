import { ArrowUpRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { CTA } from "../components/sections/CTA";
import { PageHero } from "../components/ui/PageHero";
import { Seo } from "../components/ui/Seo";
import { contentRepository } from "../content/repository";
export default function CareersPage() {
  const jobs = contentRepository.getJobs();
  return (
    <>
      <Seo
        title="Careers | SENZOFT"
        description="Explore opportunities to create impact at SENZOFT."
      />
      <PageHero
        eyebrow="Careers"
        title="Do work that moves ideas forward."
        description="Join a team where curiosity, ownership and craft turn meaningful problems into useful technology."
      />
      <section className="section">
        <div className="container-shell">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              [
                "Learn continuously",
                "Grow through useful feedback and challenging work.",
              ],
              [
                "Build together",
                "Work across disciplines with openness and respect.",
              ],
              [
                "Own the outcome",
                "Connect your craft to the impact it creates.",
              ],
            ].map(([a, b]) => (
              <div key={a} className="card p-7">
                <h2 className="text-2xl font-bold">{a}</h2>
                <p className="mt-3 leading-7 text-brand-muted">{b}</p>
              </div>
            ))}
          </div>
          <div className="mt-20 flex items-end justify-between">
            <div>
              <span className="eyebrow">Open roles</span>
              <h2 className="display mt-5 text-5xl">
                Find your next challenge.
              </h2>
            </div>
          </div>
          <div className="mt-9 divide-y divide-black/10 border-y border-black/10">
            {jobs.map((job) => (
              <Link
                key={job.slug}
                to={`/careers/${job.slug}`}
                className="group grid gap-3 py-7 md:grid-cols-[1fr_auto_auto] md:items-center"
              >
                <div>
                  <span className="text-xs font-bold text-brand-orange">
                    {job.department} · Preview
                  </span>
                  <h3 className="mt-2 text-2xl font-bold group-hover:text-brand-orange">
                    {job.title}
                  </h3>
                </div>
                <span className="flex items-center gap-2 text-sm text-brand-muted">
                  <MapPin size={16} />
                  {job.location}
                </span>
                <ArrowUpRight />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section bg-brand-peach">
        <div className="container-shell">
          <span className="eyebrow">Life at SENZOFT</span>
          <h2 className="display mt-6 max-w-4xl text-5xl md:text-6xl">
            A place to deepen your craft and widen your perspective.
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              [
                "Meaningful work",
                "Solve practical technology and business challenges.",
              ],
              [
                "Learning culture",
                "Build skills through delivery, feedback and shared practice.",
              ],
              [
                "Inclusive teams",
                "Work with respect across experiences and disciplines.",
              ],
              [
                "Room to own",
                "Take responsibility and see how your work creates value.",
              ],
            ].map(([title, copy]) => (
              <article className="rounded-2xl bg-white p-7" key={title}>
                <h3 className="text-2xl font-bold">{title}</h3>
                <p className="mt-4 leading-7 text-brand-muted">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container-shell grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <span className="eyebrow">Hiring journey</span>
            <h2 className="display mt-6 text-5xl">
              Clear steps. Human conversations.
            </h2>
          </div>
          <div className="border-t border-black/15">
            {[
              "Application and profile review",
              "Introductory conversation",
              "Role-relevant discussion or practical exercise",
              "Final conversation and decision",
            ].map((step, index) => (
              <div
                className="grid grid-cols-[3rem_1fr] border-b border-black/15 py-6"
                key={step}
              >
                <span className="font-black text-brand-orange">
                  0{index + 1}
                </span>
                <p className="text-lg font-bold">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
