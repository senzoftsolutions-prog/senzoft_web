import type { Industry, Insight, Job, Service } from "../types";

const seo = (title: string, description: string) => ({
  title: `${title} | SENZOFT`,
  description,
});

export const services: Service[] = [
  {
    id: "svc-1",
    slug: "digital-engineering",
    eyebrow: "Build for change",
    title: "Digital Engineering",
    summary:
      "Design and engineer resilient digital experiences that move from idea to measurable impact.",
    status: "published",
    icon: "Code2",
    capabilities: [
      "Digital strategy and discovery",
      "Web and mobile engineering",
      "Platform modernization",
      "Quality engineering",
    ],
    outcomes: [
      "Faster release cycles",
      "Scalable software foundations",
      "Consistent customer experiences",
    ],
    seo: seo(
      "Digital Engineering",
      "Modern software engineering from SENZOFT.",
    ),
  },
  {
    id: "svc-2",
    slug: "data-ai",
    eyebrow: "Turn data into decisions",
    title: "Data & AI",
    summary:
      "Connect trusted data, practical intelligence and responsible AI to improve everyday decisions.",
    status: "published",
    icon: "BrainCircuit",
    capabilities: [
      "Data platforms",
      "Analytics and reporting",
      "AI solution engineering",
      "Data governance",
    ],
    outcomes: [
      "Decision-ready data",
      "Automated workflows",
      "Responsible AI adoption",
    ],
    seo: seo("Data & AI", "Data, analytics and AI services from SENZOFT."),
  },
  {
    id: "svc-3",
    slug: "cloud-platforms",
    eyebrow: "Modernize with confidence",
    title: "Cloud & Platforms",
    summary:
      "Modern cloud foundations and business platforms engineered for reliability, security and scale.",
    status: "published",
    icon: "CloudCog",
    capabilities: [
      "Cloud strategy",
      "Application modernization",
      "DevSecOps enablement",
      "Managed support",
    ],
    outcomes: [
      "Improved resilience",
      "Efficient delivery",
      "Clear operational visibility",
    ],
    seo: seo(
      "Cloud & Platforms",
      "Cloud transformation services from SENZOFT.",
    ),
  },
  {
    id: "svc-4",
    slug: "business-consulting",
    eyebrow: "Align change with value",
    title: "Business Consulting",
    summary:
      "Bring business context and technology execution together to make transformation actionable.",
    status: "published",
    icon: "ChartNoAxesCombined",
    capabilities: [
      "Digital strategy",
      "Process transformation",
      "Experience design",
      "Change enablement",
    ],
    outcomes: [
      "Aligned roadmaps",
      "Simplified operations",
      "Outcome-led investment",
    ],
    seo: seo(
      "Business Consulting",
      "Technology and business consulting from SENZOFT.",
    ),
  },
  {
    id: "svc-5",
    slug: "application-modernization",
    eyebrow: "Renew the core",
    title: "Application Modernization",
    summary:
      "Modernize legacy applications and architectures while protecting business continuity.",
    status: "published",
    icon: "Blocks",
    capabilities: [
      "Application assessment",
      "Cloud-native modernization",
      "API and microservices",
      "Legacy transformation",
    ],
    outcomes: [
      "Reduced technical debt",
      "Improved agility",
      "Modern integration foundations",
    ],
    seo: seo(
      "Application Modernization",
      "Application modernization and integration services from SENZOFT.",
    ),
  },
  {
    id: "svc-6",
    slug: "cybersecurity",
    eyebrow: "Build digital trust",
    title: "Cybersecurity",
    summary:
      "Embed security across applications, cloud, identity and operations from the beginning.",
    status: "published",
    icon: "ShieldCheck",
    capabilities: [
      "Security assessment",
      "Cloud and application security",
      "Identity and access",
      "Governance and compliance",
    ],
    outcomes: [
      "Reduced exposure",
      "Secure-by-design delivery",
      "Stronger operational resilience",
    ],
    seo: seo(
      "Cybersecurity",
      "Cybersecurity and digital trust services from SENZOFT.",
    ),
  },
  {
    id: "svc-7",
    slug: "enterprise-applications",
    eyebrow: "Connect the enterprise",
    title: "Enterprise Applications",
    summary:
      "Implement and improve the platforms that connect people, customers, finance and operations.",
    status: "published",
    icon: "DatabaseZap",
    capabilities: [
      "ERP and CRM consulting",
      "Platform implementation",
      "Systems integration",
      "Workflow automation",
    ],
    outcomes: [
      "Connected processes",
      "Reliable business data",
      "Higher platform adoption",
    ],
    seo: seo(
      "Enterprise Applications",
      "Enterprise application and platform services from SENZOFT.",
    ),
  },
  {
    id: "svc-8",
    slug: "quality-engineering",
    eyebrow: "Engineer confidence",
    title: "Quality Engineering",
    summary:
      "Build quality into every release with modern automation, performance and assurance practices.",
    status: "published",
    icon: "TestTube2",
    capabilities: [
      "Test strategy and automation",
      "Performance engineering",
      "Security testing",
      "Continuous quality",
    ],
    outcomes: [
      "Fewer release risks",
      "Faster feedback",
      "Reliable user experiences",
    ],
    seo: seo(
      "Quality Engineering",
      "Software quality engineering services from SENZOFT.",
    ),
  },
  {
    id: "svc-9",
    slug: "managed-it-services",
    eyebrow: "Operate with resilience",
    title: "Managed IT Services",
    summary:
      "Keep applications, cloud environments and digital workplaces reliable, secure and continuously improving.",
    status: "published",
    icon: "Headphones",
    capabilities: [
      "Application support",
      "Cloud operations",
      "Service management",
      "Digital workplace support",
    ],
    outcomes: [
      "Improved availability",
      "Predictable operations",
      "Continuous optimization",
    ],
    seo: seo(
      "Managed IT Services",
      "Managed application, cloud and workplace services from SENZOFT.",
    ),
  },
];

export const industries: Industry[] = [
  {
    id: "ind-1",
    slug: "banking-financial-services",
    title: "Banking & Financial Services",
    summary:
      "Modernize customer journeys and operations with secure, compliant digital foundations.",
    status: "published",
    icon: "Landmark",
    challenges: [
      "Legacy complexity",
      "Digital expectations",
      "Risk and compliance",
    ],
    solutions: [
      "Digital platforms",
      "Data modernization",
      "Process automation",
    ],
    seo: seo(
      "Banking & Financial Services",
      "SENZOFT solutions for financial institutions.",
    ),
  },
  {
    id: "ind-2",
    slug: "healthcare",
    title: "Healthcare",
    summary:
      "Create connected, human-centered experiences across care and administration.",
    status: "published",
    icon: "HeartPulse",
    challenges: ["Fragmented data", "Operational pressure", "Experience gaps"],
    solutions: [
      "Interoperable platforms",
      "Analytics",
      "Experience engineering",
    ],
    seo: seo("Healthcare", "SENZOFT solutions for healthcare organizations."),
  },
  {
    id: "ind-3",
    slug: "retail-consumer",
    title: "Retail & Consumer",
    summary:
      "Build intelligent, seamless experiences that respond to fast-changing customer needs.",
    status: "published",
    icon: "ShoppingBag",
    challenges: [
      "Channel fragmentation",
      "Demand volatility",
      "Customer retention",
    ],
    solutions: [
      "Commerce engineering",
      "Personalization",
      "Supply-chain insights",
    ],
    seo: seo(
      "Retail & Consumer",
      "SENZOFT solutions for retail and consumer businesses.",
    ),
  },
  {
    id: "ind-4",
    slug: "manufacturing-logistics",
    title: "Manufacturing & Logistics",
    summary:
      "Connect operations, assets and decisions to create resilient value chains.",
    status: "published",
    icon: "Factory",
    challenges: ["Operational silos", "Asset visibility", "Supply uncertainty"],
    solutions: [
      "Connected operations",
      "Predictive insights",
      "Workflow automation",
    ],
    seo: seo(
      "Manufacturing & Logistics",
      "SENZOFT solutions for manufacturing and logistics.",
    ),
  },
];

export const insights: Insight[] = [
  {
    id: "ins-1",
    slug: "from-ai-pilot-to-practical-value",
    title: "From AI pilot to practical value",
    summary:
      "A pragmatic framework for connecting AI investment to workflows, governance and business outcomes.",
    status: "draft",
    type: "Perspective",
    readTime: "6 min",
    publishedAt: "2026-08-18",
    seo: seo(
      "From AI pilot to practical value",
      "A SENZOFT perspective on practical enterprise AI.",
    ),
  },
  {
    id: "ins-2",
    slug: "modernization-without-disruption",
    title: "Modernization without disruption",
    summary:
      "How teams can sequence platform renewal while protecting business continuity.",
    status: "draft",
    type: "Article",
    readTime: "5 min",
    publishedAt: "2026-07-24",
    seo: seo(
      "Modernization without disruption",
      "A practical approach to platform modernization.",
    ),
  },
  {
    id: "ins-3",
    slug: "designing-trusted-digital-services",
    title: "Designing trusted digital services",
    summary:
      "Why reliability, clarity and accessibility should be designed into every customer journey.",
    status: "draft",
    type: "Report",
    readTime: "8 min",
    publishedAt: "2026-06-10",
    seo: seo(
      "Designing trusted digital services",
      "Principles for trusted digital experiences.",
    ),
  },
];

export const jobs: Job[] = [
  {
    id: "job-1",
    slug: "frontend-engineer",
    title: "Frontend Engineer",
    summary:
      "Build accessible, polished web experiences with modern React and TypeScript.",
    status: "draft",
    location: "India · Hybrid",
    department: "Engineering",
    employmentType: "Full time",
    responsibilities: [
      "Create reusable UI systems",
      "Partner with design and engineering",
      "Improve quality and performance",
    ],
    seo: seo(
      "Frontend Engineer",
      "Explore a frontend engineering role at SENZOFT.",
    ),
  },
  {
    id: "job-2",
    slug: "business-analyst",
    title: "Business Analyst",
    summary:
      "Connect client goals, user needs and technology delivery through clear analysis.",
    status: "draft",
    location: "India · Hybrid",
    department: "Consulting",
    employmentType: "Full time",
    responsibilities: [
      "Shape requirements and journeys",
      "Facilitate stakeholder workshops",
      "Support outcome measurement",
    ],
    seo: seo("Business Analyst", "Explore a business analyst role at SENZOFT."),
  },
];
