export type ContentStatus = "draft" | "published";
export interface SEOConfig {
  title: string;
  description: string;
  canonical?: string;
}
export interface BaseContent {
  id: string;
  slug: string;
  title: string;
  summary: string;
  status: ContentStatus;
  seo: SEOConfig;
}
export interface Service extends BaseContent {
  eyebrow: string;
  capabilities: string[];
  outcomes: string[];
  icon: string;
}
export interface Industry extends BaseContent {
  challenges: string[];
  solutions: string[];
  icon: string;
}
export type InsightType = "Article" | "Perspective" | "Report";
export interface Insight extends BaseContent {
  type: InsightType;
  readTime: string;
  publishedAt: string;
}
export interface CaseStudy extends BaseContent {
  challenge: string;
  approach: string;
  outcome: string;
}
export interface Job extends BaseContent {
  location: string;
  department: string;
  employmentType: string;
  workMode: string;
  experience: string;
  responsibilities: string[];
  requirements: string[];
}
export interface LeadershipProfile extends BaseContent {
  role: string;
  bio: string;
}
export interface OfficeLocation {
  id: string;
  city: string;
  address: string;
  email: string;
}
export interface ContactSubmission {
  name: string;
  email: string;
  company: string;
  phone?: string;
  enquiryType: string;
  message: string;
  consent: boolean;
}
export interface JobApplication {
  jobId: string;
  name: string;
  email: string;
  phone: string;
  linkedIn?: string;
  message: string;
  consent: boolean;
}
export interface ApiResponse<T> {
  data: T;
  message: string;
}
export interface ApiError {
  code: string;
  message: string;
  fieldErrors?: Record<string, string>;
}
