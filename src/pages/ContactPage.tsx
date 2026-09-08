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
      toast.error("We could not send your message. Please try again.");
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
              This frontend currently uses a secure mock submission flow. Final
              contact details and service-level expectations await company
              approval.
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
    </>
  );
}
