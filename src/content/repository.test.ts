import { describe, expect, it } from "vitest";
import { contentRepository } from "./repository";
describe("content repository", () => {
  it("finds content by slug", () =>
    expect(contentRepository.getServiceBySlug("data-ai")?.title).toBe(
      "Data & AI",
    ));
  it("searches across content types", () =>
    expect(contentRepository.search("cloud").length).toBeGreaterThan(0));
  it("returns no results for unknown terms", () =>
    expect(contentRepository.search("not-a-real-topic")).toEqual([]));
  it("keeps every relationship on the canonical taxonomy", () => {
    const serviceSlugs = new Set(contentRepository.getServices().map((item) => item.slug));
    const industrySlugs = new Set(contentRepository.getIndustries().map((item) => item.slug));
    const technologySlugs = new Set(contentRepository.getTechnologies().map((item) => item.slug));
    const solutionSlugs = new Set(contentRepository.getSolutions().map((item) => item.slug));
    const insightSlugs = new Set(contentRepository.getInsights().map((item) => item.slug));
    contentRepository.getSolutions().forEach((item) => expect(serviceSlugs.has(item.service), item.slug).toBe(true));
    contentRepository.getTechnologies().forEach((item) => {
      item.services.forEach((slug) => expect(serviceSlugs.has(slug), `${item.slug} -> ${slug}`).toBe(true));
      item.industries.forEach((slug) => expect(industrySlugs.has(slug), `${item.slug} -> ${slug}`).toBe(true));
    });
    contentRepository.getCaseStudies().forEach((item) => {
      item.services.forEach((slug) => expect(serviceSlugs.has(slug), `${item.slug} -> ${slug}`).toBe(true));
      item.technologies.forEach((slug) => expect(technologySlugs.has(slug), `${item.slug} -> ${slug}`).toBe(true));
      item.solutions.forEach((slug) => expect(solutionSlugs.has(slug), `${item.slug} -> ${slug}`).toBe(true));
      item.relatedInsights.forEach((slug) => expect(insightSlugs.has(slug), `${item.slug} -> ${slug}`).toBe(true));
    });
  });
  it("supports the complete business discovery journey", () => {
    const industry = contentRepository.getIndustryBySlug("banking-financial-services")!;
    const service = contentRepository.getServicesForIndustry(industry.slug)[0];
    const solution = contentRepository.getSolutionsForService(service.slug)[0];
    const technology = contentRepository.getTechnologiesForSolution(solution.slug)[0];
    const evidence = contentRepository.getCaseStudiesForIndustry(industry.slug)[0];
    const insight = contentRepository.getInsightsForCaseStudy(evidence.slug)[0];
    expect([industry, service, solution, technology, evidence, insight].every(Boolean)).toBe(true);
  });
});
