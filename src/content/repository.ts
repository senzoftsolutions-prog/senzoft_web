import { industries, jobs, services } from "./content";
import { insights } from "./insights";
import { solutions, solutionUrl } from "./solutions";
import { caseStudies, technologies } from "./platform";
import { expandedIndustries } from "./industryExpansion";
import { featuredIndustries, featuredServices } from "./presentation";

const allIndustries = [...industries, ...expandedIndustries];
const normalizeService = (value: string) => ({
  "digital-engineering": "business-consulting",
}[value] ?? value);
const industryAliases: Record<string, string> = {
  "Retail & E-commerce": "retail-consumer", "Retail & Consumer": "retail-consumer",
  Manufacturing: "manufacturing-logistics", "Technology & Software": "technology-software",
  Healthcare: "healthcare", "Banking & Financial Services": "banking-financial-services",
  Education: "education", "Public Sector": "public-sector", Insurance: "insurance",
  "Logistics & Transportation": "logistics-transportation",
};
const normalizeIndustry = (value: string) => {
  if (industryAliases[value]) return industryAliases[value];
  if (value === "retail-ecommerce") return "retail-consumer";
  if (value === "manufacturing") return "manufacturing-logistics";
  return value;
};
const insightService = (title: string) => {
  const value = title.toLowerCase();
  if (value.includes("ai") || value.includes("data") || value.includes("dashboard")) return "data-ai";
  if (value.includes("cloud") || value.includes("observability") || value.includes("platform")) return "cloud-platforms";
  if (value.includes("security") || value.includes("secure")) return "cybersecurity";
  if (value.includes("modernization") || value.includes("api")) return "application-modernization";
  if (value.includes("quality") || value.includes("testing")) return "quality-engineering";
  return "application-modernization";
};
const serviceInsightMap: Record<string, string[]> = {
  "enterprise-applications": ["reliable-workflow-automation", "api-first-modernization"],
  "business-consulting": ["build-vs-buy", "technology-roadmap"],
  "managed-it-services": ["observability-architecture", "maintainable-enterprise-apps"],
};

type SearchResult = {
  id: string;
  title: string;
  summary: string;
  route: string;
  type: "Service" | "Industry" | "Technology" | "Solution" | "Case Study" | "Insight" | "Career";
};

export const contentRepository = {
  getServices: () => [...services, ...featuredServices.filter((featured) => !services.some((service) => service.slug === featured.slug))],
  getServiceBySlug: (slug: string) =>
    featuredServices.find((item) => item.slug === normalizeService(slug)) ?? services.find((item) => item.slug === slug),
  getIndustries: () => featuredIndustries,
  getIndustryBySlug: (slug: string) =>
    featuredIndustries.find((item) => item.slug === slug) ?? allIndustries.find((item) => item.slug === slug),
  getJobs: () => jobs,
  getJobBySlug: (slug: string) => jobs.find((item) => item.slug === slug),
  getSolutions: () => solutions.map((item) => ({ ...item, service: normalizeService(item.service) })),
  getSolutionBySlug: (slug: string) => {
    const item = solutions.find((solution) => solution.slug === slug);
    return item ? { ...item, service: normalizeService(item.service) } : undefined;
  },
  getTechnologies: () => technologies.map((item) => ({ ...item, services: [...new Set(item.services.map(normalizeService))] })),
  getTechnologyBySlug: (slug: string) => technologies.find((item) => item.slug === slug),
  getCaseStudies: () => caseStudies.map((item) => ({ ...item, services: [...new Set(item.services.map(normalizeService))] })),
  getInsights: () => insights,
  getSolutionsForService: (service: string) => solutions.filter((item) => normalizeService(item.service) === normalizeService(service)).map((item) => ({ ...item, service: normalizeService(item.service) })),
  getTechnologiesForService: (service: string) => technologies.filter((item) => item.services.map(normalizeService).includes(normalizeService(service))),
  getIndustriesForService: (service: string) => allIndustries.filter((industry) =>
    technologies.some((technology) => technology.services.map(normalizeService).includes(normalizeService(service)) && technology.industries.map(normalizeIndustry).includes(industry.slug)) ||
    caseStudies.some((study) => study.services.map(normalizeService).includes(normalizeService(service)) && normalizeIndustry(study.industry) === industry.slug),
  ),
  getCaseStudiesForIndustry: (industry: string) => caseStudies.filter((item) => normalizeIndustry(item.industry) === normalizeIndustry(industry)),
  getCaseStudiesForService: (service: string) => caseStudies.filter((item) => item.services.map(normalizeService).includes(normalizeService(service))),
  getCaseStudiesForTechnology: (technology: string) => caseStudies.filter((item) => item.technologies.includes(technology)),
  getCaseStudiesForSolution: (solution: string) => caseStudies.filter((item) => item.solutions.includes(solution)),
  getInsightsForService: (service: string) => insights.filter((item) => insightService(item.title) === service || serviceInsightMap[service]?.includes(item.slug)),
  getSolutionsForTechnology: (technology: string) => {
    const item = technologies.find((record) => record.slug === technology);
    return item ? solutions.filter((solution) => item.services.map(normalizeService).includes(normalizeService(solution.service))) : [];
  },
  getIndustriesForSolution: (solution: string) => {
    const item = solutions.find((record) => record.slug === solution);
    return item ? allIndustries.filter((industry) => technologies.some((technology) => technology.services.map(normalizeService).includes(normalizeService(item.service)) && technology.industries.map(normalizeIndustry).includes(industry.slug))) : [];
  },
  getTechnologiesForSolution: (solution: string) => {
    const item = solutions.find((record) => record.slug === solution);
    return item ? technologies.filter((technology) => technology.services.map(normalizeService).includes(normalizeService(item.service))) : [];
  },
  getInsightsForCaseStudy: (study: string) => {
    const item = caseStudies.find((record) => record.slug === study);
    return item ? insights.filter((insight) => item.relatedInsights.includes(insight.slug)) : [];
  },
  getTechnologiesForIndustry: (industry: string) => technologies.filter((item) => item.industries.map(normalizeIndustry).includes(normalizeIndustry(industry))),
  getServicesForIndustry: (industry: string) => featuredServices.filter((service) =>
    technologies.some((technology) => technology.services.map(normalizeService).includes(service.slug) && technology.industries.map(normalizeIndustry).includes(normalizeIndustry(industry))) ||
    caseStudies.some((study) => study.services.map(normalizeService).includes(service.slug) && normalizeIndustry(study.industry) === normalizeIndustry(industry)),
  ),
  search: (query: string): SearchResult[] => {
    const records: SearchResult[] = [
      ...services.map((item) => ({ ...item, route: `/services/${item.slug}`, type: "Service" as const })),
      ...allIndustries.map((item) => ({ ...item, route: `/industries/${item.slug}`, type: "Industry" as const })),
      ...solutions.map((item) => ({ ...item, id: `solution-${item.slug}`, route: solutionUrl(item), type: "Solution" as const })),
      ...technologies.map((item) => ({ ...item, id: `technology-${item.slug}`, route: `/technology/${item.slug}`, type: "Technology" as const })),
      ...caseStudies.map((item) => ({ ...item, id: `case-study-${item.slug}`, route: `/case-studies/${item.slug}`, type: "Case Study" as const })),
      ...insights.map((item) => ({ ...item, route: `/insights/${item.slug}`, type: "Insight" as const })),
      ...jobs.map((item) => ({ ...item, route: `/careers/${item.slug}`, type: "Career" as const })),
    ];
    const normalized = query.trim().toLowerCase();
    return records.filter((item) =>
      `${item.title} ${item.summary} ${item.type}`.toLowerCase().includes(normalized),
    );
  },
};
