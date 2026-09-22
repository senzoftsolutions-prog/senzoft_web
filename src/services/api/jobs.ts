import { apiRequest } from "./client";

export type ApiJob = { id: string; title: string; slug: string; department: string; business_unit: string; location: string; additional_locations: string[]; work_mode: string; employment_type: string; experience_level: string; minimum_experience: number; maximum_experience: number | null; description: string; responsibilities: string[]; required_skills: string[]; preferred_skills: string[]; qualifications: string[]; benefits: string[]; reporting_to: string; travel_requirement: string; hiring_eligibility: string; relocation_assistance: string; about_company: string; number_of_openings: number; application_deadline: string | null; published_at: string | null };
export type Paginated<T> = { count: number; next: string | null; previous: string | null; results: T[] };
export const getPublishedJobs = (query = "") => apiRequest<Paginated<ApiJob>>(`jobs/${query ? `?${query}` : ""}`);
export const getPublishedJob = (id: string) => apiRequest<ApiJob>(`jobs/${encodeURIComponent(id)}/`);
