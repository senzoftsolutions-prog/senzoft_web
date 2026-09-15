import { writeFile } from "node:fs/promises";

const key = process.env.PEXELS_API_KEY;
if (!key) throw new Error("Set PEXELS_API_KEY before running this importer.");
const queries = {
  "web-development": "web developer coding",
  "mobile-app-development": "mobile app development",
  "data-engineering": "data engineering dashboard",
  "cloud-migration": "cloud computing data center",
  "cloud-platforms": "enterprise data center server racks cloud computing",
  "business-consulting": "business consulting meeting",
  "enterprise-applications": "enterprise business software",
  cybersecurity: "cyber security computer",
  "quality-engineering": "software testing",
  "managed-it-services": "network operations center",
  "banking-financial-services": "financial technology banking",
  healthcare: "healthcare technology hospital",
  "retail-consumer": "retail store technology",
  "manufacturing-logistics": "factory automation logistics",
  "technology-software": "software development team",
  "public-sector": "education public technology",
  "ai-generative-ai": "artificial intelligence",
  "generative-ai":
    "generative artificial intelligence neural network technology",
  "data-analytics-area": "data analytics dashboard",
  "cloud-engineering": "IT cloud computing data center server infrastructure",
  "application-modernization-area":
    "software architects legacy application modernization planning",
  "api-integration-area":
    "enterprise systems integration network connections API architecture",
  "web-mobile-engineering":
    "responsive web and mobile application design devices",
  "cybersecurity-area": "cybersecurity operations",
  "devops-platform-engineering": "devops platform engineering",
  "connected-care-workflow": "digital healthcare workflow",
  "retail-data-foundation": "retail analytics",
  "manufacturing-platform-modernization": "smart factory automation",
  "from-ai-pilot-to-practical-value": "artificial intelligence business",
  "modernization-without-disruption": "software modernization",
  "designing-trusted-digital-services": "digital product design team",
  "cloud-cost-to-cloud-value": "cloud cost analytics",
  "quality-engineering-in-ai-era": "AI software quality testing",
  "secure-modernization-roadmap": "secure software modernization",
  "patient-access-experience":
    "hospital reception patient check in healthcare kiosk",
  "omnichannel-commerce-foundation": "ecommerce retail analytics laptop",
  "manufacturing-quality-workflow":
    "manufacturing quality inspection technology",
  "digital-banking-onboarding": "digital banking mobile onboarding",
  "shipment-visibility-platform": "logistics shipment tracking technology",
  "student-service-portal": "student education technology portal",
  "citizen-case-management": "public service government technology",
  "claims-workflow-modernization": "insurance claims digital workflow",
  "saas-platform-engineering": "software platform engineering team",
  "build-vs-buy": "enterprise software planning",
  "api-modernization-roadmap": "API software integration",
  "data-foundations-for-ai": "data infrastructure artificial intelligence",
  "measuring-modernization": "software performance analytics",
  "software-as-capability": "enterprise software team",
  "user-behavior-digital-products": "user experience research",
  "observability-architecture": "software observability dashboard",
  "staged-cloud-modernization":
    "IT data center server racks engineers infrastructure migration technology",
  "testing-ai-applications": "artificial intelligence software testing",
  "reliable-workflow-automation": "business workflow automation",
  "genai-questions-leaders": "business leaders artificial intelligence",
  "data-governance-engineering": "data governance engineering",
  "accessible-digital-experiences":
    "blind person using screen reader computer assistive technology",
  "dashboards-to-decisions": "business analytics dashboard",
  "api-first-modernization": "API development code",
  "quality-delivery-economics": "software quality engineering",
  "practical-cloud-security": "cloud cybersecurity",
  "resilient-customer-journeys": "digital customer experience",
  "platform-engineering-guide": "platform engineering team",
  "technology-roadmap": "technology strategy planning",
  "product-thinking-enterprise": "enterprise product team",
  "internal-knowledge-assistants": "AI knowledge assistant",
  "maintainable-enterprise-apps": "enterprise application development",
  "modernization-beyond-migration": "digital transformation technology",
  "about-software-products": "software development team web mobile application",
  "about-data-intelligence":
    "data engineering analytics artificial intelligence dashboard",
  "about-cloud-platforms": "cloud platform engineering data center operations",
  "about-quality-security": "cybersecurity software testing operations center",
  "cloud-modernization":
    "IT engineers cloud migration server room data center infrastructure",
};
const preferredTerms = {
  "accessible-digital-experiences": [
    "computer",
    "screen",
    "technology",
    "device",
  ],
  "application-modernization-area": [
    "computer",
    "software",
    "developer",
    "code",
  ],
  "cloud-engineering": ["server", "data center", "network", "storage"],
  "cloud-modernization": ["server", "data center", "network", "computer"],
};
const output = {};
const usedPhotoIds = new Set();
const usedPhotographers = new Set();
for (const [slug, query] of Object.entries(queries)) {
  const endpoint = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&orientation=landscape&size=large&per_page=80`;
  const response = await fetch(endpoint, {
    headers: { Authorization: key },
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok)
    throw new Error(`${slug}: Pexels returned ${response.status}`);
  const candidates = (await response.json()).photos ?? [];
  const terms = preferredTerms[slug];
  const eligible = candidates.filter((candidate) => {
    if (!terms) return true;
    const description = (candidate.alt ?? "").toLowerCase();
    return terms.some((term) => description.includes(term));
  });
  const photo = eligible.find(
    (candidate) =>
      !usedPhotoIds.has(candidate.id) &&
      !usedPhotographers.has(candidate.photographer),
  );
  if (!photo) continue;
  usedPhotoIds.add(photo.id);
  usedPhotographers.add(photo.photographer);
  output[slug] = {
    src: photo.src.large2x,
    srcSet: `${photo.src.medium} 640w, ${photo.src.large} 940w, ${photo.src.large2x} 1880w`,
    alt: photo.alt || query,
  };
}
await writeFile(
  new URL("../src/content/pexels-images.json", import.meta.url),
  `${JSON.stringify(output, null, 2)}\n`,
);
console.log(
  `Imported ${Object.keys(output).length} field-specific Pexels images.`,
);
