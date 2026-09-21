import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { industries, services } from "../content/content";
import { expandedIndustries } from "../content/industryExpansion";
import { insights } from "../content/insights";
import { caseStudies, technologies } from "../content/platform";
import { solutions, solutionUrl } from "../content/solutions";
import {
  absoluteUrl,
  breadcrumbSchema,
  buildBreadcrumbs,
  canonicalPath,
  isNoIndexPath,
} from "./seo";

describe("SEO route helpers", () => {
  it("normalizes canonical URLs without query strings or trailing slashes", () => {
    expect(canonicalPath("/services/data-ai/?campaign=test")).toBe("/services/data-ai");
    expect(absoluteUrl("/services/data-ai")).toBe("https://www.senzoft.com/services/data-ai");
  });

  it("keeps current and future private careers routes out of the index", () => {
    [
      "/search",
      "/careers/apply/frontend-01",
      "/careers/openings/frontend-01",
      "/login",
      "/register",
      "/account/settings",
      "/profile",
      "/applications/123",
      "/interviews/123",
      "/documents/123",
      "/admin/jobs",
    ].forEach((route) => expect(isNoIndexPath(route), route).toBe(true));
    expect(isNoIndexPath("/careers/openings")).toBe(false);
  });

  it("builds labelled breadcrumb structured data", () => {
    const items = buildBreadcrumbs("/case-studies/retail-data-foundation");
    expect(items.map(({ name }) => name)).toEqual(["Home", "Case Studies", "Retail Data Foundation"]);
    expect(breadcrumbSchema(items).itemListElement).toHaveLength(3);
  });

  it("covers every repository-backed indexable route in the sitemap", () => {
    const sitemap = readFileSync("public/sitemap.xml", "utf8");
    const routes = [
      ...services.map(({ slug }) => `/services/${slug}`),
      ...[...industries, ...expandedIndustries].map(({ slug }) => `/industries/${slug}`),
      ...solutions.map(solutionUrl),
      ...insights.map(({ slug }) => `/insights/${slug}`),
      ...technologies.map(({ slug }) => `/technology/${slug}`),
      ...caseStudies.map(({ slug }) => `/case-studies/${slug}`),
    ];

    routes.forEach((route) => {
      expect(sitemap, `missing ${route}`).toContain(`<loc>https://www.senzoft.com${route}</loc>`);
    });
  });

  it("does not expose duplicate sitemap locations", () => {
    const sitemap = readFileSync("public/sitemap.xml", "utf8");
    const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
    expect(new Set(locations).size).toBe(locations.length);
    expect(sitemap).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/);
    expect(sitemap).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(sitemap).toContain("</urlset>");
    locations.forEach((location) => {
      expect(location).toMatch(/^https:\/\/www\.senzoft\.com\//);
      expect(location).not.toMatch(/[?#]/);
    });
  });

  it("excludes utility, private and illustrative routes from the sitemap", () => {
    const sitemap = readFileSync("public/sitemap.xml", "utf8");
    [
      "/search",
      "/careers/apply/",
      "/careers/openings/frontend-01",
      "/login",
      "/register",
      "/account",
      "/applications",
      "/interviews",
      "/documents",
      "/admin",
    ].forEach((route) => expect(sitemap, route).not.toContain(`https://www.senzoft.com${route}`));
    expect(sitemap).not.toContain("localhost");
  });
});
