import { submitTalentInterest } from "../services/api";
import { VideoStory } from "../components/sections/VideoStory";
import { FormEvent, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  Code2,
  GraduationCap,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Reveal } from "../components/ui/Reveal";
import { Seo } from "../components/ui/Seo";
import { careersData } from "../content/careers";
import { contentRepository } from "../content/repository";

const pathIcons = [GraduationCap, BriefcaseBusiness, Sparkles];

export default function CareersPage() {
  const jobs = contentRepository.getJobs();
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("All");
  const departments = ["All", ...new Set(jobs.map((job) => job.department))];
  const filtered = useMemo(
    () =>
      jobs.filter(
        (job) =>
          `${job.title} ${job.summary} ${job.department}`
            .toLowerCase()
            .includes(query.toLowerCase()) &&
          (department === "All" || job.department === department),
      ),
    [department, jobs, query],
  );
  const [joining, setJoining] = useState(false);
  async function join(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const element = event.currentTarget;
    setJoining(true);
    try {
      const result = await submitTalentInterest(
        String(new FormData(element).get("email")),
      );
      toast.success(result.message);
      element.reset();
    } catch {
      toast.error(
        "Your request was not sent. Please try again or email hello@senzoft.com.",
      );
    } finally {
      setJoining(false);
    }
  }
  return (
    <>
      <Seo
        title="Careers at SENZOFT | Build What's Next"
        description="Explore careers at SENZOFT and discover how our teams build meaningful software, AI and digital experiences."
      />
      <section className="careers-hero page-hero relative isolate overflow-hidden">
        <div
          className="grid-lines absolute inset-0 opacity-60"
          aria-hidden="true"
        />
        <div
          className="tech-orb absolute -right-8 top-40 size-80 rounded-full bg-[radial-gradient(circle_at_35%_35%,#ffcf91,#f04a16_42%,#74301b_72%)] opacity-80"
          aria-hidden="true"
        />
        <div className="container-shell relative flex flex-col justify-end pb-20 pt-36 md:pb-24">
          <Reveal>
            <span className="eyebrow !text-orange-200">Careers at SENZOFT</span>
            <h1 className="display mt-7 max-w-5xl text-[clamp(3rem,7vw,6rem)]">
              Build. Learn.
              <span className="block ink-gradient">Create what’s next.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-orange-50/90 md:text-xl">
              Join a team building software, AI and digital experiences that
              solve real business problems.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#open-roles" className="btn btn-dark">
                Explore career disciplines <ArrowDown size={17} />
              </a>
              <a href="#life-at-senzoft" className="btn btn-outline">
                Life at SENZOFT <ArrowRight size={17} />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="open-roles" className="relative z-10 -mt-8 pb-24">
        <div className="container-shell rounded-[2rem] border border-orange-100 bg-white p-5 shadow-[0_30px_80px_#5b2b1818] md:p-9">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <span className="eyebrow">Opportunity finder</span>
              <h2 className="display mt-4 text-4xl md:text-5xl">
                Find your next challenge.
              </h2>
            </div>
            <p className="text-sm font-bold text-brand-muted">
              {jobs.length} career disciplines to explore
            </p>
          </div>
          <div className="mt-7 grid gap-3 md:grid-cols-[1.6fr_1fr]">
            <label className="relative">
              <span className="sr-only">Search roles</span>
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted"
                size={19}
              />
              <input
                className="field field-search h-14"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Role, skill or keyword"
              />
            </label>
            <label>
              <span className="sr-only">Department</span>
              <select
                className="field h-14"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                {departments.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {departments.map((item) => (
              <button
                key={item}
                onClick={() => setDepartment(item)}
                aria-pressed={department === item}
                className={`rounded-full px-4 py-2 text-sm font-bold ${department === item ? "bg-brand-orange text-white" : "bg-brand-cream hover:bg-brand-peach"}`}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-2" aria-live="polite">
            {filtered.map((job) => (
              <Link
                key={job.slug}
                to={`/careers/${job.slug}`}
                className="card group flex min-h-64 flex-col p-6 md:p-8"
              >
                <div className="flex justify-between gap-5">
                  <span className="rounded-full bg-brand-peach px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-brand-plum">
                    {job.department} · Preview
                  </span>
                  <ArrowUpRight />
                </div>
                <h3 className="mt-7 text-3xl font-bold">{job.title}</h3>
                <p className="mt-3 leading-7 text-brand-muted">{job.summary}</p>
                <div className="mt-auto flex flex-wrap gap-4 pt-7 text-sm font-semibold text-brand-muted">
                  <span className="flex items-center gap-2">
                    <MapPin size={16} />
                    {job.location}
                  </span>
                  <span>{job.employmentType}</span>
                </div>
              </Link>
            ))}
            {filtered.length === 0 && (
              <div className="rounded-2xl bg-brand-cream p-8 lg:col-span-2">
                <h3 className="text-xl font-bold">No matching roles</h3>
                <p className="mt-2 text-brand-muted">
                  Try a broader keyword or clear the department filter.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section bg-brand-cream">
        <div className="container-shell">
          <Reveal>
            <span className="eyebrow">Why SENZOFT</span>
            <h2 className="display mt-6 max-w-4xl text-5xl md:text-7xl">
              Build work that matters.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {careersData.values.map((value, index) => (
              <Reveal key={value.title} delay={index * 0.06}>
                <Link to="/about" className="card block h-full p-7 md:p-9">
                  <span className="font-black text-brand-orange">
                    0{index + 1}
                  </span>
                  <h3 className="mt-8 text-3xl font-bold">{value.title}</h3>
                  <p className="mt-4 leading-7 text-brand-muted">
                    {value.copy}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-[#fff1e7]">
        <div className="container-shell grid items-center gap-14 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <span className="eyebrow">What you’ll build</span>
            <h2 className="display mt-6 text-5xl md:text-6xl">
              Technology that connects.
            </h2>
            <p className="mt-6 text-lg leading-8 text-brand-muted">
              Work across connected capabilities, turning ideas into reliable
              digital products.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {careersData.technologies.map((tech, index) => (
              <Link
                to={
                  [
                    "/services/data-ai/ai-automation",
                    "/services/data-ai/data-analytics",
                    "/services/cloud-platforms/cloud-devops",
                    "/services/digital-engineering/web-development",
                    "/services/digital-engineering/mobile-app-development",
                    "/services/data-ai/ai-automation",
                    "/services/quality-engineering/software-testing",
                    "/services/cybersecurity/security-assurance",
                  ][index]
                }
                key={tech}
                className="card flex min-h-24 flex-col items-center justify-center gap-3 p-4 text-center font-extrabold"
              >
                <Code2 className="text-brand-orange" size={24} />
                {tech}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-shell">
          <span className="eyebrow">Career paths</span>
          <h2 className="display mt-6 max-w-3xl text-5xl md:text-6xl">
            A path for every stage of your craft.
          </h2>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {careersData.paths.map((path, index) => {
              const Icon = pathIcons[index];
              return (
                <Link
                  to={`/careers/pathways/${["early-careers", "experienced-professionals", "internships"][index]}`}
                  key={path.title}
                  className="card flex min-h-80 flex-col p-7"
                >
                  <Icon className="text-brand-orange" size={32} />
                  <p className="mt-7 text-xs font-extrabold uppercase tracking-widest text-brand-orange">
                    {path.label}
                  </p>
                  <h3 className="mt-3 text-3xl font-bold">{path.title}</h3>
                  <p className="mt-4 leading-7 text-brand-muted">{path.copy}</p>
                  <span className="mt-auto flex items-center gap-2 pt-7 font-extrabold">
                    Explore pathway <ArrowRight size={17} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <VideoStory
        clip="workplace"
        eyebrow="Your next chapter"
        title="Bring your craft. Keep your curiosity."
        description="Explore a place for thoughtful engineering, open collaboration and continuous learning. The footage illustrates a collaborative workplace; it is not a recording of SENZOFT offices."
        href="/about"
        linkLabel="Get to know SENZOFT"
      />
      <section
        id="life-at-senzoft"
        className="section bg-brand-plum text-white"
      >
        <div className="container-shell">
          <span className="eyebrow !text-orange-200">Life at SENZOFT</span>
          <h2 className="display mt-6 max-w-4xl text-5xl md:text-7xl">
            A place to build, learn, collaborate and grow.
          </h2>
          <p className="mt-5 max-w-3xl leading-8 text-orange-50/90">
            Good work needs more than individual expertise. Our working
            principles connect the business problem, the people building the
            solution and the teams who will use it. Here is what those
            principles mean in practice.
          </p>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {[
              [
                "Collaboration with context",
                "Understand the why before the how. Share the user need, constraints and decisions behind a task so colleagues can contribute informed ideas.",
                "In practice",
                "Bring questions to planning, document decisions and make handoffs clear enough for someone outside the project to follow.",
              ],
              [
                "Craft in the open",
                "Make work reviewable while there is still room to improve it. Use design walkthroughs, code reviews and demonstrations to invite useful feedback.",
                "In practice",
                "Explain your tradeoffs, welcome a second perspective and turn feedback into stronger patterns for the next piece of work.",
              ],
              [
                "Ideas made practical",
                "Move from a promising idea to a small, testable change. Consider accessibility, quality and operational needs alongside the feature itself.",
                "In practice",
                "Agree what success looks like, test with realistic scenarios and share what you learned, including what did not work.",
              ],
            ].map(([title, copy, label, example], index) => (
              <Reveal key={title} delay={index * 0.06} className="h-full">
                <article className="culture-card h-full">
                  <Sparkles size={24} className="text-orange-200" />
                  <h3 className="mt-5 text-2xl font-bold">{title}</h3>
                  <p className="mt-4 leading-7 text-orange-50/90">{copy}</p>
                  <div className="mt-5 border-t border-white/20 pt-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-orange-200">
                      {label}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-orange-50/85">
                      {example}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-shell grid gap-12 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <span className="eyebrow">Learning & growth</span>
            <h2 className="display mt-6 text-5xl">
              Never stop becoming better.
            </h2>
            <p className="mt-6 text-brand-muted">
              Specific programs will be published once they are confirmed.
            </p>
          </div>
          <ol className="border-t border-orange-200">
            {careersData.growth.map((step, index) => (
              <li
                key={step}
                className="grid grid-cols-[3.5rem_1fr_auto] items-center border-b border-orange-200 py-6"
              >
                <span className="font-black text-brand-orange">
                  0{index + 1}
                </span>
                <div>
                  <strong className="text-xl">{step}</strong>
                  <p className="mt-3 text-sm leading-7 text-brand-muted">
                    {careersData.growthDetails[index]}
                  </p>
                </div>
                <Check className="text-brand-orange" size={20} />
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section bg-brand-cream">
        <div className="container-shell">
          <span className="eyebrow">Recruitment journey</span>
          <h2 className="display mt-6 text-5xl md:text-6xl">
            Clear steps. Human conversations.
          </h2>
          <div className="mt-12 grid gap-4 md:grid-cols-5">
            {careersData.process.map((step, index) => (
              <article className="rounded-2xl bg-white p-6" key={step.title}>
                <span className="font-black text-brand-orange">
                  0{index + 1}
                </span>
                <h3 className="mt-7 text-xl font-bold">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-brand-muted">
                  {step.copy}
                </p>
              </article>
            ))}
          </div>
          <div className="mt-12 grid gap-3 lg:grid-cols-3">
            {careersData.faqs.map((faq) => (
              <details key={faq.q} className="rounded-2xl bg-white p-6">
                <summary className="cursor-pointer font-extrabold">
                  {faq.q}
                </summary>
                <p className="mt-4 leading-7 text-brand-muted">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="talent-network" className="section">
        <div className="container-shell grid overflow-hidden rounded-[2rem] bg-brand-orange text-white lg:grid-cols-[1fr_.8fr]">
          <div className="p-8 md:p-14">
            <span className="eyebrow !text-white">Talent network</span>
            <h2 className="display mt-6 text-5xl">
              Can’t find the right role?
            </h2>
            <p className="mt-5 max-w-xl leading-8 text-white/90">
              Tell us you would like to hear about future opportunities. We use
              your email for recruitment contact with your consent.
            </p>
          </div>
          <form
            onSubmit={join}
            className="m-5 grid content-center gap-4 rounded-3xl bg-white p-7 text-brand-ink md:m-8"
          >
            <label className="font-bold">
              Email address
              <input
                required
                type="email"
                name="email"
                className="field mt-2"
                placeholder="you@example.com"
              />
            </label>
            <label className="flex gap-3 text-sm text-brand-muted">
              <input required type="checkbox" />I consent to recruitment
              updates.
            </label>
            <button
              disabled={joining}
              className="btn btn-dark justify-self-start"
            >
              {joining ? "Sending..." : "Join talent network"}{" "}
              <ArrowRight size={17} />
            </button>
          </form>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-shell flex flex-col gap-6 rounded-3xl border border-orange-200 bg-brand-cream p-7 md:flex-row md:items-center">
          <ShieldCheck className="shrink-0 text-brand-orange" size={42} />
          <div>
            <h2 className="text-2xl font-bold">Stay safe while applying</h2>
            <p className="mt-2 leading-7 text-brand-muted">
              SENZOFT recruitment will never ask you to pay for an application,
              interview or offer. Avoid sharing banking credentials or
              unnecessary financial information.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
