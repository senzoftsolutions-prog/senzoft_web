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

async function fetchJobRoutes() {
  const ids = new Set();
  const addJobs = (rows) => {
    if (!Array.isArray(rows)) return;
    for (const job of rows) if (typeof job?.id === "string" && job.id.trim()) ids.add(job.id.trim());
  };
  const apiBase = (process.env.VITE_API_BASE_URL || `${origin}/api/v1`).replace(/\/$/, "");
  try {
    let next = `${apiBase}/jobs/?page=1`;
    for (let page = 0; next && page < 250; page += 1) {
      const response = await fetch(next, { signal: AbortSignal.timeout(8000) });
      if (!response.ok) break;
      const result = await response.json();
      addJobs(result.results);
      if (!result.next) break;
      const candidate = new URL(result.next, next);
      if (candidate.origin !== new URL(apiBase).origin) break;
      next = candidate.href;
    }
  } catch {
    console.warn("Could not read published careers from the website API; continuing with repository-backed pages.");
  }

  const integrationBase = process.env.HRMS_INTEGRATION_API_URL?.replace(/\/$/, "");
  const integrationToken = process.env.HRMS_INTEGRATION_TOKEN;
  if (integrationBase && integrationToken) {
    try {
      const response = await fetch(`${integrationBase}/jobs/`, {
        headers: { Authorization: `Bearer ${integrationToken}`, Accept: "application/json" },
        signal: AbortSignal.timeout(8000),
      });
      if (response.ok) addJobs((await response.json()).jobs);
      else console.warn(`Could not read HRMS jobs for the sitemap (HTTP ${response.status}).`);
    } catch {
      console.warn("Could not reach the HRMS careers API while generating the sitemap.");
    }
  }
  return [...ids].map((id) => `/careers/openings/${encodeURIComponent(id)}`);
}

const routes = [
  ...staticRoutes,
  ...services.map(({ slug }) => `/services/${slug}`),
  ...[...industries, ...expandedIndustries].map(({ slug }) => `/industries/${slug}`),
  ...solutions.map(solutionUrl),
  ...insights.map(({ slug }) => `/insights/${slug}`),
  ...technologies.map(({ slug }) => `/technology/${slug}`),
  ...caseStudies.map(({ slug }) => `/case-studies/${slug}`),
  ...await fetchJobRoutes(),
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
