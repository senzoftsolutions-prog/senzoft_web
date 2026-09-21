import { parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js";
import type { ContactSubmission } from "../types";

export type ContactFormErrors = Partial<
  Record<"name" | "email" | "company" | "country" | "phone" | "message" | "consent", string>
>;

export type CountryOption = {
  code: CountryCode;
  label: string;
  callingCode: string;
};

export const COUNTRY_OPTIONS: CountryOption[] = [
  { code: "IN", label: "India", callingCode: "+91" },
  { code: "US", label: "United States", callingCode: "+1" },
  { code: "CA", label: "Canada", callingCode: "+1" },
  { code: "GB", label: "United Kingdom", callingCode: "+44" },
  { code: "AE", label: "United Arab Emirates", callingCode: "+971" },
  { code: "AU", label: "Australia", callingCode: "+61" },
  { code: "DE", label: "Germany", callingCode: "+49" },
  { code: "SG", label: "Singapore", callingCode: "+65" },
  { code: "SA", label: "Saudi Arabia", callingCode: "+966" },
];

export function validateName(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "Name is required.";
  if (trimmed.length < 2 || trimmed.length > 100) return "Name must be 2–100 characters long.";
  if (!/^[\p{L}\p{M}]+(?:[\s'-][\p{L}\p{M}]+)*$/u.test(trimmed)) {
    return "Name can only contain letters, spaces, hyphen and apostrophe.";
  }
  return null;
}

export function validateEmail(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "Work email is required.";
  if (trimmed.length > 254) return "Email must be 254 characters or fewer.";
  if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(trimmed)) {
    return "Please enter a valid work email address.";
  }
  return null;
}

export function validateCompany(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "Company is required.";
  if (trimmed.length < 2 || trimmed.length > 150) return "Company must be 2–150 characters long.";
  if (!/[A-Za-z0-9]/.test(trimmed)) return "Company must include letters or numbers.";
  if (/^[^A-Za-z0-9]+$/.test(trimmed)) return "Company cannot be punctuation-only.";
  if (!/^[\p{L}\p{N}][\p{L}\p{N}\s&.,'/+-]*$/u.test(trimmed)) {
    return "Company contains unsupported characters.";
  }
  return null;
}

export function validatePhone(value: string, countryCode: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (countryCode === "IN") {
    const digitsOnly = trimmed.replace(/\D/g, "");
    const normalizedDigits = digitsOnly.replace(/^91/, "");
    if (normalizedDigits.length !== 10) {
      return "India phone number must be exactly 10 digits.";
    }
    return null;
  }

  const normalized = trimmed.replace(/\s+/g, "");
  const phoneNumber = parsePhoneNumberFromString(normalized, countryCode as CountryCode);
  if (!phoneNumber || !phoneNumber.isValid()) {
    return `Enter a valid phone number for ${countryCode}.`;
  }

  return null;
}

export function validateMessage(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "Message is required.";
  if (trimmed.length > 5000) return "Message must be 5000 characters or fewer.";
  return null;
}

export function validateConsent(value: boolean): string | null {
  if (!value) return "Please accept the privacy consent before sending your enquiry.";
  return null;
}

export function validateContactForm(values: ContactSubmission): ContactFormErrors {
  const errors: ContactFormErrors = {};

  const nameError = validateName(values.name);
  if (nameError) errors.name = nameError;

  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;

  const companyError = validateCompany(values.company);
  if (companyError) errors.company = companyError;

  const countryError = values.country ? null : "Country is required.";
  if (countryError) errors.country = countryError;

  const phoneError = validatePhone(values.phone ?? "", values.country || "IN");
  if (phoneError) errors.phone = phoneError;

  const messageError = validateMessage(values.message);
  if (messageError) errors.message = messageError;

  const consentError = validateConsent(values.consent);
  if (consentError) errors.consent = consentError;

  return errors;
}
