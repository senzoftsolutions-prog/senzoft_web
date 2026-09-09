import type { ApiResponse, ContactSubmission, JobApplication } from "../types";

async function submitForm<T extends object>(name: string, payload: T, message: string): Promise<ApiResponse<T>> {
  const body = new URLSearchParams({ "form-name": name, "bot-field": "" });
  Object.entries(payload).forEach(([key, value]) => body.set(key, String(value ?? "")));
  const response = await fetch("/form-received.html", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error("Your message could not be sent. Please try again or email hello@senzoft.com.");
  return { data: payload, message };
}
export const submitContactForm = (payload: ContactSubmission) => submitForm("contact", payload, "Thank you. Your enquiry has been sent to SENZOFT.");
export const submitJobApplication = (payload: JobApplication) => submitForm("career-interest", payload, "Thank you. Your expression of interest has been sent.");
export const submitTalentInterest = (email: string) => submitForm("talent-network", { email, consent: true }, "Thank you. Your talent network request has been sent.");
