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
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!form.consent) return toast.error("Please accept the privacy consent.");
    setBusy(true);
    try {
      const response = await submitContactForm(form);
      toast.success(response.message);
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
        description="Share the outcome you need, the context you already know and where you would value support."
      />
      <section className="section reference-contact-section">
        <div className="container-shell reference-contact-grid">
          <div className="reference-contact-copy">
            <span className="eyebrow">Let’s talk</span>
            <h2>Start a conversation.</h2>
            <p>
              Tell us what you want to achieve. We’ll connect your enquiry with
              the right SENZOFT team.
            </p>
            <a href="mailto:hello@senzoft.com">
              <Mail className="text-brand-orange" /> hello@senzoft.com
            </a>
            <p className="reference-location">
              <MapPin className="text-brand-orange" /> India
            </p>
          </div>
          <form onSubmit={submit} className="reference-contact-form">
            <label>
              Name *
              <input
                required
                className="field"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>
            <label>
              Work email *
              <input
                required
                type="email"
                className="field"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>
            <label>
              Company *
              <input
                required
                className="field"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
            </label>
            <label>
              Phone
              <input
                type="tel"
                className="field"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </label>
            <label className="reference-contact-full">
              What can we help with?
              <select
                className="field"
                value={form.enquiryType}
                onChange={(e) =>
                  setForm({ ...form, enquiryType: e.target.value })
                }
              >
                <option>Services</option>
                <option>Technology</option>
                <option>Partnership</option>
                <option>Careers</option>
                <option>Other</option>
              </select>
            </label>
            <label className="reference-contact-full">
              Message *
              <textarea
                required
                rows={5}
                className="field resize-y"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </label>
            <label className="reference-contact-full reference-consent">
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
              className="btn btn-primary reference-contact-submit"
            >
              {busy ? "Sending…" : "Send enquiry"} <Send size={17} />
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
