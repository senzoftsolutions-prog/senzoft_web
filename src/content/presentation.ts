import { industries, services } from "./content";
import { solutions } from "./solutions";

const serviceOrder = [
  "web-development",
  "mobile-app-development",
  "data-engineering",
  "cloud-migration",
  "cloud-platforms",
  "business-consulting",
  "enterprise-applications",
  "cybersecurity",
  "quality-engineering",
  "managed-it-services",
] as const;

const serviceTitles: Record<string, string> = {
  "web-development": "Web Development",
  "mobile-app-development": "App Development",
  "data-engineering": "Data Engineering",
  "cloud-migration": "Cloud Migration",
  "cloud-platforms": "Cloud & Modernization",
  cybersecurity: "Cybersecurity & Quality",
};

const serviceImages: Record<string, string> = {
  "web-development": "/media/web-development.jpg",
  "mobile-app-development": "/media/app-development.jpg",
  "cloud-migration": "/media/cloud.jpg",
  "cloud-platforms": "/media/cloud.jpg",
  "application-modernization": "/media/development.jpg",
  cybersecurity: "/media/cybersecurity.jpg",
};

export const featuredServices: typeof services = serviceOrder
  .map((slug) => {
    const service = services.find((item) => item.slug === slug);
    if (service) return service;
    const solution = solutions.find((item) => item.slug === slug);
    const sourceSlug = slug === "data-engineering" ? "data-ai" : slug === "cloud-migration" ? "cloud-platforms" : "business-consulting";
    const source = services.find((item) => item.slug === sourceSlug);
    if (slug === "cloud-migration" && source) return { ...source, slug, title: serviceTitles[slug], summary: "Move applications, data and workloads to the cloud through a secure, staged migration plan designed to protect continuity, control risk and prepare teams for reliable operations." };
    return solution && source ? { ...source, slug, title: serviceTitles[slug], summary: solution.summary } : undefined;
  })
  .filter((item): item is NonNullable<typeof item> => Boolean(item))
  .map((item) => ({
    ...item,
    title: serviceTitles[item.slug] ?? item.title,
    image: serviceImages[item.slug],
  }));

const industryOrder = [
  "banking-financial-services",
  "healthcare",
  "retail-consumer",
  "manufacturing-logistics",
  "technology-software",
  "public-sector",
] as const;

const industryTitles: Record<string, string> = {
  "banking-financial-services": "Financial Services",
  "public-sector": "Public Sector & Education",
};

export const featuredIndustries = industryOrder
  .map((slug) => industries.find((item) => item.slug === slug))
  .filter((item): item is NonNullable<typeof item> => Boolean(item))
  .map((item) => ({ ...item, title: industryTitles[item.slug] ?? item.title }));

export const technologyAreas = [
  { slug: "ai-generative-ai", title: "AI & Generative AI", summary: "Apply governed intelligence to knowledge, decisions and useful automation." },
  { slug: "data-analytics-area", title: "Data & Analytics", summary: "Turn reliable information into operational insight and measurable action." },
  { slug: "cloud-engineering", title: "Cloud", summary: "Create secure, scalable foundations with clear cost and operational ownership." },
  { slug: "application-modernization-area", title: "Application Modernization", summary: "Renew critical systems in controlled, valuable and reversible increments." },
  { slug: "api-integration-area", title: "API & Integration", summary: "Connect applications and partners through explicit, dependable boundaries." },
  { slug: "web-mobile-engineering", title: "Web & Mobile Engineering", summary: "Build accessible experiences for customers, employees and field teams." },
  { slug: "cybersecurity-area", title: "Cybersecurity", summary: "Design identity, protection and visibility into every technology layer." },
  { slug: "devops-platform-engineering", title: "DevOps & Platform Engineering", summary: "Improve delivery flow through automation, observability and reusable platforms." },
] as const;

export const businessOutcomes = [
  ["Modernize legacy systems", "Reduce change risk while protecting the business knowledge inside critical applications."],
  ["Build better experiences", "Connect clear customer and employee journeys to the systems that support them."],
  ["Use data intelligently", "Make governed information useful for reporting, automation and responsible AI."],
  ["Create cloud confidence", "Align cloud architecture, security, cost and operations around accountable ownership."],
  ["Improve reliability", "Make quality, security and service visibility part of delivery from the beginning."],
] as const;

export const deliveryProcess = [
  ["Discover", "Understand business goals, users, systems and constraints."],
  ["Design", "Define the right experience, architecture and delivery roadmap."],
  ["Build", "Engineer, integrate, test and deploy in focused increments."],
  ["Improve", "Operate, measure and continuously improve."],
] as const;

export const whySenzoft = [
  "Business-first thinking",
  "Strong engineering discipline",
  "Connected technology capabilities",
  "Long-term delivery mindset",
] as const;
