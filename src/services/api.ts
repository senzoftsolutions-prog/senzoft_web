import type { ApiResponse, ContactSubmission, JobApplication } from "../types";
import { validateContactForm } from "../pages/contactValidation";

async function submitForm<T extends object>(name: string, payload: T, message: string): Promise<ApiResponse<T>> {
  const body = new URLSearchParams({ "form-name": name, "bot-field": "" });
  Object.entries(payload).forEach(([key, value]) => body.set(key, String(value ?? "")));
  const response = await fetch("/form-received.html", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error("Your message could not be sent. Please try again or email contact@senzoft.com.");
  return { data: payload, message };
}

export const submitContactForm = (payload: ContactSubmission) => {
  const errors = validateContactForm(payload);
  if (Object.keys(errors).length > 0) {
    throw new Error(Object.values(errors)[0]);
  }
  return fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, website: "" }),
    signal: AbortSignal.timeout(15000),
  }).then(async (response) => {
    const result = await response.json().catch(() => ({})) as { message?: string };
    if (!response.ok) {
      throw new Error(result.message || "Your message could not be sent. Please try again or email contact@senzoft.com.");
    }
    return { data: payload, message: result.message || "Thank you. Your enquiry has been sent to SENZOFT." };
  });
};
export const submitJobApplication = (payload: JobApplication) => submitForm("career-interest", payload, "Thank you. Your expression of interest has been sent.");
export const submitTalentInterest = (email: string) => submitForm("talent-network", { email, consent: true }, "Thank you. Your talent network request has been sent.");
