import { industries, jobs, services } from "./content";
export const contentRepository = {
  getServices: () => services,
  getServiceBySlug: (slug: string) =>
    services.find((item) => item.slug === slug),
  getIndustries: () => industries,
  getIndustryBySlug: (slug: string) =>
    industries.find((item) => item.slug === slug),
  getJobs: () => jobs,
  getJobBySlug: (slug: string) => jobs.find((item) => item.slug === slug),
  search: (query: string) =>
    [...services, ...industries].filter((item) =>
      `${item.title} ${item.summary}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    ),
};
