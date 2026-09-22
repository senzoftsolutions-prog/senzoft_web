import { FormEvent, useMemo, useState } from "react";
import { Mail, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import { PageHero } from "../components/ui/PageHero";
import { Seo } from "../components/ui/Seo";
import { submitContactForm } from "../services/api";
import type { ContactSubmission } from "../types";
import { companyAddress } from "../content/company";
import {
  COUNTRY_OPTIONS,
  type ContactFormErrors,
  validateContactForm,
} from "./contactValidation";

const initial: ContactSubmission = {
  name: "",
  email: "",
  company: "",
  country: "",
  phone: "",
  enquiryType: "Services",
  message: "",
  consent: false,
};

export default function ContactPage() {
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const selectedCountry = useMemo(
    () => COUNTRY_OPTIONS.find((country) => country.code === form.country) ?? null,
    [form.country],
  );

  const messageWordCount = form.message.trim() ? form.message.trim().split(/\s+/).length : 0;

  const validateField = (field: keyof ContactSubmission, value: string | boolean) => {
    const nextForm = { ...form, [field]: value };
    const nextErrors = validateContactForm(nextForm);
    setErrors((previous) => ({
      ...previous,
      [field]: nextErrors[field as keyof ContactFormErrors],
    }));
    if (field !== "consent" && nextErrors[field as keyof ContactFormErrors]) {
      return;
    }
    if (field === "consent" && nextErrors.consent) {
      return;
    }
    setErrors((previous) => {
      const next = { ...previous };
      delete next[field as keyof ContactFormErrors];
      return next;
    });
  };

  async function submit(event: FormEvent) {
    event.preventDefault();
    const nextErrors = validateContactForm(form);
    setTouched({
      name: true,
      email: true,
      company: true,
      country: true,
      phone: true,
      message: true,
      consent: true,
    });
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const firstError = Object.values(nextErrors)[0];
      toast.error(firstError ?? "Please review the highlighted fields.");
      return;
    }

    setBusy(true);
    try {
      const response = await submitContactForm(form);
      toast.success(response.message);
      setForm(initial);
      setErrors({});
      setTouched({});
    } catch (error) {
      toast.error(
        error instanceof Error && error.message
          ? error.message
          : "Your message was not sent. Please try again or email contact@senzoft.com.",
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
      <div className="contact-page">
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
              <a href="mailto:contact@senzoft.com">
                <Mail className="text-brand-orange" /> contact@senzoft.com
              </a>
              <address className="reference-location company-address">
                <MapPin className="text-brand-orange" aria-hidden="true" />
                <span>{companyAddress.line1}<br />{companyAddress.line2}<br />{companyAddress.line3}</span>
              </address>
            </div>
            <form onSubmit={submit} className="reference-contact-form" noValidate>
              <label className={errors.name ? "has-error" : ""}>
                Name *
                <input
                  className="field"
                  value={form.name}
                  maxLength={100}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  onBlur={() => setTouched((previous) => ({ ...previous, name: true }))}
                  onChange={(event) => {
                    const value = event.target.value;
                    setForm({ ...form, name: value });
                    if (touched.name || value.length >= 1) {
                      validateField("name", value);
                    }
                  }}
                />
                {errors.name && touched.name && <span id="name-error" className="field-error" role="alert">{errors.name}</span>}
              </label>

              <label className={errors.email ? "has-error" : ""}>
                Work email *
                <input
                  type="email"
                  className="field"
                  value={form.email}
                  maxLength={254}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  onBlur={() => setTouched((previous) => ({ ...previous, email: true }))}
                  onChange={(event) => {
                    const value = event.target.value.replace(/[^A-Za-z0-9._%+@-]/g, "").slice(0, 254);
                    setForm({ ...form, email: value });
                    if (touched.email || value.length >= 1) {
                      validateField("email", value);
                    }
                  }}
                />
                {errors.email && touched.email && <span id="email-error" className="field-error" role="alert">{errors.email}</span>}
              </label>

              <label className={errors.company ? "has-error" : ""}>
                Company *
                <input
                  className="field"
                  value={form.company}
                  maxLength={150}
                  aria-invalid={Boolean(errors.company)}
                  aria-describedby={errors.company ? "company-error" : undefined}
                  onBlur={() => setTouched((previous) => ({ ...previous, company: true }))}
                  onChange={(event) => {
                      const value = event.target.value.replace(/[^\p{L}\p{N}\s&.,'/+-]/gu, "").slice(0, 150);
                    setForm({ ...form, company: value });
                    if (touched.company || value.length >= 1) {
                      validateField("company", value);
                    }
                  }}
                />
                {errors.company && touched.company && <span id="company-error" className="field-error" role="alert">{errors.company}</span>}
              </label>

              <label className={errors.country ? "has-error" : ""}>
                Country *
                <select
                  className="field"
                  value={form.country}
                  aria-invalid={Boolean(errors.country)}
                  aria-describedby={errors.country ? "country-error" : undefined}
                  onBlur={() => setTouched((previous) => ({ ...previous, country: true }))}
                  onChange={(event) => {
                    const value = event.target.value;
                    setForm({ ...form, country: value });
                    setErrors((previous) => ({ ...previous, country: undefined }));
                    if (touched.country || value) {
                      validateField("country", value);
                    }
                  }}
                >
                  <option value="">Select country</option>
                  {COUNTRY_OPTIONS.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.label} ({country.callingCode})
                    </option>
                  ))}
                </select>
                {errors.country && touched.country && <span id="country-error" className="field-error" role="alert">{errors.country}</span>}
              </label>

              <label className={errors.phone ? "has-error" : ""}>
                Phone
                <input
                  type="tel"
                  className="field"
                  value={form.phone}
                  maxLength={20}
                  inputMode="tel"
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  onBlur={() => setTouched((previous) => ({ ...previous, phone: true }))}
                  onChange={(event) => {
                    const rawValue = event.target.value.replace(/[^\d()+\s-]/g, "");
                    const value = form.country === "IN"
                      ? rawValue.replace(/\D/g, "").slice(0, 10)
                      : rawValue.slice(0, 20);
                    setForm({ ...form, phone: value });
                    if (touched.phone || value.length >= 1) {
                      validateField("phone", value);
                    }
                  }}
                />
                {errors.phone && touched.phone && <span id="phone-error" className="field-error" role="alert">{errors.phone}</span>}
                {!errors.phone && selectedCountry && (
                  <span className="field-hint">{selectedCountry.label} · {selectedCountry.callingCode}</span>
                )}
              </label>

              <label className="reference-contact-full">
                What can we help with?
                <select
                  className="field"
                  value={form.enquiryType}
                  onChange={(event) => setForm({ ...form, enquiryType: event.target.value })}
                >
                  <option>Services</option>
                  <option>Technology</option>
                  <option>Partnership</option>
                  <option>Careers</option>
                  <option>Other</option>
                </select>
              </label>

              <label className={errors.message ? "reference-contact-full has-error" : "reference-contact-full"}>
                Message *
                <textarea
                  rows={5}
                  className="field resize-y"
                  value={form.message}
                  maxLength={5000}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  onBlur={() => setTouched((previous) => ({ ...previous, message: true }))}
                  onChange={(event) => {
                    const value = event.target.value.slice(0, 5000);
                    setForm({ ...form, message: value });
                    if (touched.message || value.trim().length >= 1) {
                      validateField("message", value);
                    }
                  }}
                />
                <span className="reference-field-meta">
                  <span>{messageWordCount} words</span>
                  <span>{form.message.length}/5000</span>
                </span>
                {errors.message && touched.message && <span id="message-error" className="field-error" role="alert">{errors.message}</span>}
              </label>

              <label className={errors.consent ? "reference-contact-full reference-consent has-error" : "reference-contact-full reference-consent"}>
                <input
                  type="checkbox"
                  checked={form.consent}
                  aria-invalid={Boolean(errors.consent)}
                  aria-describedby={errors.consent ? "consent-error" : undefined}
                  onBlur={() => setTouched((previous) => ({ ...previous, consent: true }))}
                  onChange={(event) => {
                    const value = event.target.checked;
                    setForm({ ...form, consent: value });
                    validateField("consent", value);
                  }}
                />
                <span>
                  I consent to SENZOFT using these details to respond to my
                  enquiry.
                </span>
                {errors.consent && touched.consent && <span id="consent-error" className="field-error" role="alert">{errors.consent}</span>}
              </label>

              <button
                disabled={busy}
                className="btn btn-primary reference-contact-submit"
                type="submit"
              >
                {busy ? "Sending…" : "Send enquiry"} <Send size={17} />
              </button>
            </form>
          </div>
        </section>
      </div>
    </>
  );
}
