import { EditorialSections } from "../components/sections/EditorialSections";
import { CareerDevelopment } from "../components/sections/CareerDevelopment";
import { FormEvent, useState } from "react";
import { BriefcaseBusiness, Clock3, MapPin } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { PageHero } from "../components/ui/PageHero";
import { Seo } from "../components/ui/Seo";
import { contentRepository } from "../content/repository";
import { submitJobApplication } from "../services/api";
export default function JobPage() {
  const { jobId } = useParams();
  const job = contentRepository.getJobBySlug(jobId!);
  const [busy, setBusy] = useState(false);
  if (!job)
    return (
      <div className="container-shell py-48">
        <h1 className="display text-5xl">Role not found</h1>
        <Link to="/careers" className="btn btn-primary mt-6">
          View careers
        </Link>
      </div>
    );
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const element = e.currentTarget;
    const fd = new FormData(element);
    if (!fd.get("consent"))
      return toast.error("Please accept the privacy consent.");
    setBusy(true);
    try {
      const result = await submitJobApplication({
        jobId: job!.id,
        name: String(fd.get("name")),
        email: String(fd.get("email")),
        phone: String(fd.get("phone")),
        linkedIn: String(fd.get("linkedIn")),
        message: String(fd.get("message")),
        consent: true,
      });
      toast.success(result.message);
      element.reset();
    } catch {
      toast.error(
        "Your interest was not sent. Please try again or email hello@senzoft.com.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Seo title={job.seo.title} description={job.seo.description} />
      <PageHero
        eyebrow={`${job.department} · ${job.location}`}
        title={job.title}
        description={job.summary}
      />
      <section className="section">
        <div className="container-shell grid gap-14 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <div className="mb-10 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-brand-cream p-4">
                <MapPin className="text-brand-orange" size={19} />
                <strong className="mt-3 block text-sm">{job.workMode}</strong>
              </div>
              <div className="rounded-xl bg-brand-cream p-4">
                <BriefcaseBusiness className="text-brand-orange" size={19} />
                <strong className="mt-3 block text-sm">
                  {job.employmentType}
                </strong>
              </div>
              <div className="rounded-xl bg-brand-cream p-4">
                <Clock3 className="text-brand-orange" size={19} />
                <strong className="mt-3 block text-sm">{job.experience}</strong>
              </div>
            </div>
            <h2 className="display text-4xl">What you’ll do</h2>
            <ul className="mt-6 space-y-3 text-brand-muted">
              {job.responsibilities.map((x) => (
                <li key={x}>— {x}</li>
              ))}
            </ul>
            <h2 className="display mt-12 text-4xl">What you’ll bring</h2>
            <ul className="mt-6 space-y-3 text-brand-muted">
              {job.requirements.map((x) => (
                <li key={x}>— {x}</li>
              ))}
            </ul>
            <p className="mt-8 rounded-xl bg-brand-cream p-4 text-sm text-brand-muted">
              Explore this career discipline and register interest in future
              opportunities. This is an expression of interest, not an
              advertised current vacancy.
            </p>
          </div>
          <form onSubmit={submit} className="card grid gap-5 p-7">
            <h2 className="display text-4xl">Register your interest</h2>
            <input
              required
              name="name"
              aria-label="Full name"
              className="field"
              placeholder="Full name"
            />
            <input
              required
              name="email"
              aria-label="Email"
              type="email"
              className="field"
              placeholder="Email"
            />
            <input
              required
              name="phone"
              aria-label="Phone"
              type="tel"
              className="field"
              placeholder="Phone"
            />
            <input
              name="linkedIn"
              aria-label="LinkedIn profile"
              type="url"
              className="field"
              placeholder="LinkedIn profile (optional)"
            />
            <textarea
              name="message"
              aria-label="Message"
              rows={4}
              className="field"
              placeholder="Tell us briefly about your experience"
            />
            <label className="flex gap-3 text-sm text-brand-muted">
              <input name="consent" type="checkbox" /> I consent to SENZOFT
              using these details for recruitment contact.
            </label>
            <button
              disabled={busy}
              className="btn btn-primary justify-self-start"
            >
              {busy ? "Submitting…" : "Submit interest"}
            </button>
          </form>
        </div>
      </section>
      <EditorialSections
        eyebrow="Show us how you work"
        title="Prepare examples with substance."
        description="A useful application helps us understand your contribution and the thinking behind it. Register interest in this discipline and help us understand the kind of work you would like to pursue."
        items={[
          [
            "Explain your contribution",
            "Choose a project and describe the problem, your role and the decisions you made. Distinguish your work from the wider team's responsibilities.",
          ],
          [
            "Share the learning",
            "Tell us about a tradeoff, a setback or feedback that changed your approach. Include what you would do differently with the same problem today.",
          ],
          [
            "Keep examples appropriate",
            "Use public portfolio links or anonymized descriptions. Do not include confidential client materials, private credentials or information you cannot share.",
          ],
        ]}
      />
      <CareerDevelopment engineering={job.department === "Engineering"} />
    </>
  );
}
