import { Link } from "react-router-dom";
import {
  EditorialSections,
  EngagementOptions,
} from "../components/sections/EditorialSections";
import { ContactPlanning } from "../components/sections/CompanyOverview";
import { FormEvent, useState } from "react";
import { Mail, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import { PageHero } from "../components/ui/PageHero";
import { Seo } from "../components/ui/Seo";
import { submitContactForm } from "../services/api";
import type { ContactSubmission } from "../types";
const initial: ContactSubmission = {
  name: "",
  email: "",
  company: "",
  phone: "",
  enquiryType: "Services",
  message: "",
  consent: false,
};
export default function ContactPage() {
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!form.consent) return toast.error("Please accept the privacy consent.");
    setBusy(true);
    try {
      const res = await submitContactForm(form);
      toast.success(res.message);
      setForm(initial);
    } catch {
      toast.error(
        "Your message was not sent. Please try again or email hello@senzoft.com.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Seo
        title="Contact | SENZOFT"
        description="Talk to SENZOFT about your technology goals."
      />
      <PageHero
        eyebrow="Contact"
        title="Let’s make the next move count."
        description="Tell us what you are working toward. We will connect you with the right SENZOFT team."
      />
      <section className="section">
        <div className="container-shell grid gap-12 lg:grid-cols-[.65fr_1.35fr]">
          <div>
            <h2 className="display text-4xl">Start a conversation.</h2>
            <p className="mt-5 leading-7 text-brand-muted">
              Tell us about the outcome you need, the systems involved and where
              you would like support. Use this form for project enquiries,
              consulting, ongoing IT services or a delivery partnership.
            </p>
            <a
              href="mailto:hello@senzoft.com"
              className="mt-8 flex items-center gap-3 font-bold"
            >
              <Mail className="text-brand-orange" /> hello@senzoft.com
            </a>
            <p className="mt-4 flex items-center gap-3 font-bold">
              <MapPin className="text-brand-orange" /> India
            </p>
          </div>
          <form
            onSubmit={submit}
            className="card grid gap-5 p-6 sm:grid-cols-2 md:p-9"
          >
            <label className="text-sm font-bold">
              Name *
              <input
                required
                className="field mt-2"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>
            <label className="text-sm font-bold">
              Work email *
              <input
                required
                type="email"
                className="field mt-2"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>
            <label className="text-sm font-bold">
              Company *
              <input
                required
                className="field mt-2"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
            </label>
            <label className="text-sm font-bold">
              Phone
              <input
                type="tel"
                className="field mt-2"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </label>
            <label className="text-sm font-bold sm:col-span-2">
              Enquiry type
              <select
                className="field mt-2"
                value={form.enquiryType}
                onChange={(e) =>
                  setForm({ ...form, enquiryType: e.target.value })
                }
              >
                <option>Services</option>
                <option>Software development</option>
                <option>Partnership</option>
                <option>Careers</option>
                <option>Other</option>
              </select>
            </label>
            <label className="text-sm font-bold sm:col-span-2">
              How can we help? *
              <textarea
                required
                rows={5}
                className="field mt-2 resize-y"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </label>
            <label className="flex gap-3 text-sm leading-6 text-brand-muted sm:col-span-2">
              <input
                required
                type="checkbox"
                checked={form.consent}
                onChange={(e) =>
                  setForm({ ...form, consent: e.target.checked })
                }
              />
              <span>
                I consent to SENZOFT using these details to respond to my
                enquiry.
              </span>
            </label>
            <button
              disabled={busy}
              className="btn btn-primary sm:col-span-2 sm:justify-self-start"
            >
              {busy ? "Sending…" : "Send enquiry"} <Send size={17} />
            </button>
          </form>
        </div>
      </section>
      <section className="section bg-brand-peach">
        <div className="container-shell">
          <span className="eyebrow">What happens next</span>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              [
                "01",
                "We understand",
                "We review your goals, context and the kind of expertise required.",
              ],
              [
                "02",
                "We connect",
                "The right SENZOFT specialist joins a focused introductory conversation.",
              ],
              [
                "03",
                "We shape a path",
                "If there is a fit, we outline practical next steps, scope and delivery options.",
              ],
            ].map(([number, title, copy]) => (
              <article className="rounded-2xl bg-white p-8" key={title}>
                <span className="font-black text-brand-orange">{number}</span>
                <h2 className="display mt-10 text-3xl">{title}</h2>
                <p className="mt-4 leading-7 text-brand-muted">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container-shell grid gap-10 lg:grid-cols-2">
          <div>
            <span className="eyebrow">Ways we can help</span>
            <h2 className="display mt-6 text-5xl">
              Start with the challenge—not a predefined solution.
            </h2>
          </div>
          <div className="grid gap-4">
            {[
              "Explore a new website, application or digital service",
              "Modernize an existing application or cloud environment",
              "Create a data, analytics or AI roadmap",
              "Strengthen security, quality or technology operations",
              "Discuss a consulting or delivery partnership",
            ].map((item, index) => (
              <Link
                to={
                  [
                    "/services/digital-engineering",
                    "/services/application-modernization",
                    "/services/data-ai",
                    "/services/managed-it-services",
                    "/services/business-consulting",
                  ][index]
                }
                className="rounded-xl border border-black/10 p-5 font-bold"
                key={item}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </section>
      <ContactPlanning />
      <EngagementOptions />
      <EditorialSections
        eyebrow="Prepare for a useful conversation"
        title="A little context goes a long way."
        description="You do not need a complete specification to start. Share what you know, and identify the questions you want to resolve."
        items={[
          [
            "The outcome you are working toward",
            "Describe who the work should help and what should become easier, faster or more reliable. A concrete example is more useful than a long list of features.",
          ],
          [
            "The environment you have today",
            "Summarize the systems, integrations and team responsibilities involved. Mention important constraints such as an existing platform or a fixed delivery window.",
          ],
          [
            "The decision you need to make",
            "Tell us whether you need discovery, a delivery proposal or ongoing support. We can use that context to shape the scope of a follow-up discussion.",
          ],
        ]}
      />
    </>
  );
}
