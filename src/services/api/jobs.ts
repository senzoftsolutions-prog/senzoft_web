import { apiRequest } from "./client";

export type ApiJob = { source?: "HRMS" | "WEBSITE"; id: string; title: string; slug: string; department: string; business_unit: string; location: string; additional_locations: string[]; work_mode: string; employment_type: string; experience_level: string; minimum_experience: number; maximum_experience: number | null; description: string; responsibilities: string[]; required_skills: string[]; preferred_skills: string[]; qualifications: string[]; benefits: string[]; reporting_to: string; travel_requirement: string; hiring_eligibility: string; relocation_assistance: string; about_company: string; number_of_openings: number; application_deadline: string | null; published_at: string | null };
export type Paginated<T> = { count: number; next: string | null; previous: string | null; results: T[] };
export const getPublishedJobs = (query = "") => apiRequest<Paginated<ApiJob>>(`jobs/${query ? `?${query}` : ""}`);
export const getPublishedJob = (id: string) => apiRequest<ApiJob>(`jobs/${encodeURIComponent(id)}/`);

export type PublicApplicationInput = {
  job_id: string; candidate_name: string; candidate_email: string; candidate_phone: string;
  cover_letter: string; linkedin_url: string; portfolio_url: string; current_role: string;
  current_company: string; resume_url: string; resume_file?: File | null; website: string;
};
export const submitPublicApplication = (input: PublicApplicationInput) => {
  const form = new FormData();
  for (const [key, value] of Object.entries(input)) {
    if (key === "resume_file" || value === undefined || value === null) continue;
    form.set(key, String(value));
  }
  if (input.resume_file) form.set("resume_file", input.resume_file, input.resume_file.name);
  form.set("source_reference", crypto.randomUUID());
  return apiRequest<{ ok: boolean; id: string; status: string }>("careers/applications/", { method: "POST", body: form });
};
