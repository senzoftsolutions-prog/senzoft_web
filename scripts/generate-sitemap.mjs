import { writeFile } from "node:fs/promises";
import { industries, services } from "../src/content/content.ts";
import { expandedIndustries } from "../src/content/industryExpansion.ts";
import { insights } from "../src/content/insights.ts";
import { caseStudies, technologies } from "../src/content/platform.ts";
import { solutions, solutionUrl } from "../src/content/solutions.ts";

const origin = "https://www.senzoft.com";
const staticRoutes = [
  "/",
  "/about",
  "/services",
  "/industries",
  "/insights",
  "/technology",
  "/case-studies",
  "/careers",
  "/careers/life-at-senzoft",
  "/careers/benefits",
  "/careers/openings",
  "/careers/pathways/early-careers",
  "/careers/pathways/experienced-professionals",
  "/careers/pathways/internships",
  "/contact",
  "/privacy-policy",
  "/terms-of-use",
  "/accessibility",
];

const routes = [
  ...staticRoutes,
  ...services.map(({ slug }) => `/services/${slug}`),
  ...[...industries, ...expandedIndustries].map(({ slug }) => `/industries/${slug}`),
  ...solutions.map(solutionUrl),
  ...insights.map(({ slug }) => `/insights/${slug}`),
  ...technologies.map(({ slug }) => `/technology/${slug}`),
  ...caseStudies.map(({ slug }) => `/case-studies/${slug}`),
];

const uniqueRoutes = [...new Set(routes)].sort((a, b) =>
  a === "/" ? -1 : b === "/" ? 1 : a.localeCompare(b),
);
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueRoutes.map((route) => `  <url><loc>${origin}${route}</loc></url>`).join("\n")}
</urlset>
`;

await writeFile(new URL("../public/sitemap.xml", import.meta.url), xml, "utf8");
console.log(`Generated sitemap with ${uniqueRoutes.length} canonical routes.`);
