export type Technology = {
  slug: string; title: string; category: string; summary: string;
  capabilities: string[]; useCases: string[]; services: string[]; industries: string[];
};

const coreTechnologies: Technology[] = [
  { slug: "artificial-intelligence", title: "Artificial Intelligence", category: "AI & Data", summary: "Design responsible AI capabilities around governed data, measurable workflows and human oversight.", capabilities: ["AI opportunity assessment", "Retrieval and knowledge systems", "Model evaluation", "Responsible AI controls"], useCases: ["Knowledge assistance", "Document processing", "Decision support"], services: ["data-ai"], industries: ["healthcare", "banking-financial-services"] },
  { slug: "data-engineering", title: "Data Engineering", category: "AI & Data", summary: "Create dependable data products that make operational and analytical information usable.", capabilities: ["Data architecture", "Pipelines and integration", "Quality and lineage", "Analytics platforms"], useCases: ["Unified reporting", "Operational analytics", "AI-ready data"], services: ["data-ai", "cloud-platforms"], industries: ["retail-consumer", "manufacturing-logistics"] },
  { slug: "aws", title: "AWS", category: "Cloud", summary: "Build and modernize secure cloud environments with clear ownership and operational visibility.", capabilities: ["Landing zones", "Cloud-native applications", "DevSecOps", "Observability"], useCases: ["Application modernization", "Elastic platforms", "Resilient workloads"], services: ["cloud-platforms", "application-modernization"], industries: ["healthcare", "retail-consumer"] },
  { slug: "azure", title: "Microsoft Azure", category: "Cloud", summary: "Connect cloud, data, identity and enterprise applications within a maintainable Azure foundation.", capabilities: ["Cloud foundations", "Identity integration", "Data platforms", "Platform operations"], useCases: ["Hybrid modernization", "Enterprise integration", "Analytics"], services: ["cloud-platforms", "enterprise-applications"], industries: ["banking-financial-services", "manufacturing-logistics"] },
  { slug: "react", title: "React", category: "Frontend", summary: "Engineer accessible, maintainable interfaces for complex customer and employee journeys.", capabilities: ["Design systems", "Web applications", "Accessibility", "Frontend testing"], useCases: ["Digital products", "Self-service portals", "Operational consoles"], services: ["digital-engineering"], industries: ["retail-consumer", "healthcare"] },
  { slug: "python", title: "Python", category: "Backend", summary: "Develop data, automation and API services with pragmatic engineering and testable boundaries.", capabilities: ["API engineering", "Data processing", "Automation", "AI integration"], useCases: ["Workflow automation", "Data services", "Intelligent applications"], services: ["digital-engineering", "data-ai"], industries: ["banking-financial-services", "healthcare"] },
  { slug: "react-native", title: "React Native", category: "Mobile", summary: "Deliver coherent mobile experiences while sharing engineering practices across platforms.", capabilities: ["Mobile product design", "App engineering", "Device integration", "Release automation"], useCases: ["Customer applications", "Field operations", "Employee tools"], services: ["digital-engineering"], industries: ["retail-consumer", "manufacturing-logistics"] },
  { slug: "postgresql", title: "PostgreSQL", category: "Databases", summary: "Build reliable transactional and analytical foundations around an open relational platform.", capabilities: ["Data modeling", "Performance engineering", "Migration", "Resilience"], useCases: ["Core applications", "Reporting stores", "Modernization"], services: ["data-ai", "application-modernization"], industries: ["healthcare", "retail-consumer"] },
  { slug: "apis-microservices", title: "APIs & Microservices", category: "Enterprise", summary: "Create explicit integration boundaries that help systems evolve without losing control.", capabilities: ["Domain design", "API governance", "Integration", "Observability"], useCases: ["Legacy decoupling", "Partner ecosystems", "Workflow integration"], services: ["application-modernization", "enterprise-applications"], industries: ["banking-financial-services", "manufacturing-logistics"] },
];

export type CaseStudyRecord = {
  slug: string; title: string; industry: string; summary: string; challenge: string;
  approach: string[]; services: string[]; technologies: string[]; solutions: string[]; relatedInsights: string[];
};

const coreCaseStudies: CaseStudyRecord[] = [
  { slug: "connected-care-workflow", title: "Connected care workflow modernization", industry: "Healthcare", summary: "A reference engagement structure for connecting fragmented clinical and administrative workflows.", challenge: "The organization needs verified client and result information before this story can be published as evidence.", approach: ["Map the end-to-end care workflow", "Define governed integration boundaries", "Pilot with operational users", "Measure against an agreed baseline"], services: ["digital-engineering", "data-ai"], technologies: ["react", "python", "aws"], solutions: ["web-development"], relatedInsights: ["designing-trusted-digital-services", "data-foundations-for-ai"] },
  { slug: "retail-data-foundation", title: "Retail data foundation", industry: "Retail & Consumer", summary: "A reference structure for unifying operational data and enabling more timely decisions.", challenge: "Verified client context, implementation detail and outcomes are required from SENZOFT.", approach: ["Assess source quality", "Agree ownership and definitions", "Build incremental data products", "Operationalize quality monitoring"], services: ["data-ai", "cloud-platforms"], technologies: ["data-engineering", "postgresql", "azure"], solutions: ["data-analytics"], relatedInsights: ["data-foundations-for-ai", "dashboards-to-decisions"] },
  { slug: "manufacturing-platform-modernization", title: "Manufacturing platform modernization", industry: "Manufacturing", summary: "A reference story framework for modernizing a business-critical platform without disrupting operations.", challenge: "This platform is ready for verified project facts; no client, metric or testimonial has been fabricated.", approach: ["Document dependencies", "Prioritize modernization seams", "Release in reversible increments", "Transfer operational ownership"], services: ["application-modernization", "cloud-platforms"], technologies: ["apis-microservices", "aws"], solutions: ["legacy-modernization"], relatedInsights: ["modernization-without-disruption", "measuring-modernization"] },
];

const technologyExpansion: Array<[string, string, string, string]> = [
  ["generative-ai", "Generative AI", "AI & Data", "Design governed generative AI experiences for knowledge, assistance and automation."],
  ["machine-learning", "Machine Learning", "AI & Data", "Build predictive capabilities around reliable data and measurable use cases."],
  ["ai-agents", "AI Agents", "AI & Data", "Design task-oriented AI systems with tools, controls, observability and human oversight."],
  ["data-analytics", "Data Analytics", "AI & Data", "Turn operational data into decision-ready analysis and reporting."],
  ["data-governance", "Data Governance", "AI & Data", "Create practical ownership, quality, lineage and access practices."],
  ["mlops", "MLOps", "AI & Data", "Operationalize models through repeatable deployment, monitoring and lifecycle practices."],
  ["google-cloud", "Google Cloud", "Cloud", "Use cloud capabilities for data, AI, applications and scalable infrastructure."],
  ["kubernetes", "Kubernetes", "Cloud", "Create portable, observable and repeatable container platforms."],
  ["docker", "Docker", "Cloud", "Package applications consistently across development, testing and deployment."],
  ["devops", "DevOps", "Cloud", "Connect engineering and operations through automation and feedback loops."],
  ["infrastructure-as-code", "Infrastructure as Code", "Cloud", "Manage infrastructure through repeatable, reviewable definitions."],
  ["cloud-security", "Cloud Security", "Cloud", "Design cloud environments around identity, least privilege and monitoring."],
  ["cloud-observability", "Cloud Observability", "Cloud", "Make platform behavior visible through logs, metrics and traces."],
  ["nextjs", "Next.js", "Frontend", "Create performant React applications with strong rendering and routing structure."],
  ["angular", "Angular", "Frontend", "Develop structured enterprise web applications for complex teams and products."],
  ["typescript", "TypeScript", "Frontend", "Improve maintainability with explicit types and stronger developer tooling."],
  ["accessibility-engineering", "Accessibility Engineering", "Frontend", "Design and test interfaces for inclusive essential journeys."],
  ["nodejs", "Node.js", "Backend", "Develop scalable APIs, services and integration layers."],
  ["java", "Java", "Backend", "Build durable enterprise services for long-lived operating environments."],
  ["dotnet", ".NET", "Backend", "Develop enterprise applications and APIs in the Microsoft ecosystem."],
  ["rest-apis", "REST APIs", "Backend", "Expose dependable capabilities through clear, versioned interfaces."],
  ["graphql", "GraphQL", "Backend", "Provide flexible data access where client-driven queries create value."],
  ["microservices", "Microservices", "Backend", "Create independently deployable services with explicit boundaries."],
  ["flutter", "Flutter", "Mobile", "Create cross-platform mobile experiences with a shared delivery model."],
  ["mysql", "MySQL", "Databases", "Support reliable relational application workloads."],
  ["mongodb", "MongoDB", "Databases", "Support workloads that benefit from flexible document structures."],
  ["redis", "Redis", "Databases", "Provide caching, sessions, queues and suitable low-latency workloads."],
  ["api-integration", "API & Enterprise Integration", "Enterprise", "Connect applications and data through governed integration patterns."],
  ["identity-access", "Identity & Access", "Enterprise", "Design usable authentication and authorization around least privilege."],
  ["observability", "Observability", "Enterprise", "Create shared visibility across application, infrastructure and business signals."],
  ["workflow-platforms", "Workflow Platforms", "Enterprise", "Connect people, rules, data and applications into manageable processes."],
];

const primaryTechnologyAreas: Technology[] = [
  { slug: "ai-generative-ai", title: "AI & Generative AI", category: "Technology area", summary: "Apply governed intelligence to knowledge, decisions and useful automation.", capabilities: ["AI opportunity design", "Generative AI applications", "Evaluation and guardrails", "Responsible operations"], useCases: ["Knowledge assistance", "Document workflows", "Decision support"], services: ["data-ai"], industries: ["banking-financial-services", "healthcare", "retail-consumer"] },
  { slug: "data-analytics-area", title: "Data & Analytics", category: "Technology area", summary: "Turn reliable information into operational insight and measurable action.", capabilities: ["Data platforms", "Analytics", "Governance", "Data quality"], useCases: ["Unified reporting", "Operational insight", "AI-ready data"], services: ["data-ai"], industries: ["banking-financial-services", "retail-consumer", "manufacturing-logistics"] },
  { slug: "cloud-engineering", title: "Cloud", category: "Technology area", summary: "Create secure, scalable foundations with clear cost and operational ownership.", capabilities: ["Cloud foundations", "Workload migration", "Cloud security", "FinOps and operations"], useCases: ["Platform modernization", "Elastic services", "Resilient workloads"], services: ["cloud-platforms", "managed-it-services"], industries: ["healthcare", "retail-consumer", "technology-software"] },
  { slug: "application-modernization-area", title: "Application Modernization", category: "Technology area", summary: "Renew critical systems in controlled, valuable and reversible increments.", capabilities: ["Portfolio assessment", "Architecture renewal", "Legacy integration", "Incremental migration"], useCases: ["Legacy renewal", "Platform consolidation", "Cloud adoption"], services: ["cloud-platforms", "enterprise-applications"], industries: ["banking-financial-services", "manufacturing-logistics", "public-sector"] },
  { slug: "api-integration-area", title: "API & Integration", category: "Technology area", summary: "Connect applications and partners through explicit, dependable boundaries.", capabilities: ["API strategy", "Integration architecture", "Event-driven systems", "Governance"], useCases: ["Partner ecosystems", "Legacy decoupling", "Connected workflows"], services: ["enterprise-applications", "cloud-platforms"], industries: ["banking-financial-services", "manufacturing-logistics", "healthcare"] },
  { slug: "web-mobile-engineering", title: "Web & Mobile Engineering", category: "Technology area", summary: "Build accessible experiences for customers, employees and field teams.", capabilities: ["Experience design", "Web engineering", "Mobile engineering", "Accessibility"], useCases: ["Customer portals", "Employee tools", "Field applications"], services: ["enterprise-applications", "quality-engineering"], industries: ["retail-consumer", "healthcare", "technology-software"] },
  { slug: "cybersecurity-area", title: "Cybersecurity", category: "Technology area", summary: "Design identity, protection and visibility into every technology layer.", capabilities: ["Security architecture", "Identity and access", "Application security", "Cloud security"], useCases: ["Secure modernization", "Risk reduction", "Compliance enablement"], services: ["cybersecurity", "quality-engineering"], industries: ["banking-financial-services", "healthcare", "public-sector"] },
  { slug: "devops-platform-engineering", title: "DevOps & Platform Engineering", category: "Technology area", summary: "Improve delivery flow through automation, observability and reusable platforms.", capabilities: ["Delivery automation", "Platform engineering", "Observability", "Infrastructure as code"], useCases: ["Release confidence", "Developer platforms", "Reliable operations"], services: ["cloud-platforms", "managed-it-services", "quality-engineering"], industries: ["technology-software", "retail-consumer", "manufacturing-logistics"] },
];

export const technologies: Technology[] = [
  ...primaryTechnologyAreas,
  ...coreTechnologies,
  ...technologyExpansion.map(([slug, title, category, summary]) => ({
    slug, title, category, summary,
    capabilities: ["Architecture and fit assessment", "Secure implementation", "Quality automation", "Operational enablement"],
    useCases: ["Modern digital platforms", "Connected enterprise workflows", "Incremental modernization"],
    services: category === "AI & Data" ? ["data-ai"] : category === "Cloud" ? ["cloud-platforms"] : ["digital-engineering", "application-modernization"],
    industries: ["banking-financial-services", "healthcare", "retail-consumer", "technology-software"],
  })),
];

const caseStudyExpansion: Array<[string, string, string, string[], string[]]> = [
  ["digital-banking-onboarding", "Digital banking onboarding", "Banking & Financial Services", ["enterprise-applications", "cybersecurity"], ["react", "api-integration"]],
  ["patient-access-experience", "Patient access experience", "Healthcare", ["digital-engineering", "data-ai"], ["react", "azure"]],
  ["omnichannel-commerce-foundation", "Omnichannel commerce foundation", "Retail & Consumer", ["digital-engineering", "cloud-platforms"], ["nextjs", "aws"]],
  ["manufacturing-quality-workflow", "Manufacturing quality workflow", "Manufacturing", ["enterprise-applications", "quality-engineering"], ["workflow-platforms", "data-analytics"]],
  ["shipment-visibility-platform", "Shipment visibility platform", "Logistics & Transportation", ["digital-engineering", "data-ai"], ["react", "rest-apis"]],
  ["student-service-portal", "Student service portal", "Education", ["digital-engineering", "enterprise-applications"], ["accessibility-engineering", "react"]],
  ["citizen-case-management", "Citizen case management", "Public Sector", ["enterprise-applications", "cybersecurity"], ["workflow-platforms", "identity-access"]],
  ["claims-workflow-modernization", "Claims workflow modernization", "Insurance", ["application-modernization", "data-ai"], ["microservices", "postgresql"]],
  ["saas-platform-engineering", "SaaS platform engineering", "Technology & Software", ["digital-engineering", "quality-engineering"], ["kubernetes", "typescript"]],
];

export const caseStudies: CaseStudyRecord[] = [
  ...coreCaseStudies,
  ...caseStudyExpansion.map(([slug, title, industry, services, technologies]) => ({
    slug, title, industry, services, technologies, solutions: ["custom-software"], relatedInsights: ["technology-roadmap"],
    summary: `Reference engagement framework for ${title.toLowerCase()}; client and outcome verification is required before publication.`,
    challenge: "[VERIFIED CLIENT/CASE STUDY REQUIRED] The workflow, constraints and baseline must be confirmed with SENZOFT before this reference engagement becomes a published claim.",
    approach: ["Understand the current journey", "Define architecture and controls", "Deliver a testable increment", "Validate readiness and transfer ownership"],
  })),
];

export const technologyCategories = ["AI & Data", "Cloud", "Frontend", "Backend", "Mobile", "Databases", "Enterprise"];

export const getTechnology = (slug: string) => technologies.find((item) => item.slug === slug);
export const getCaseStudy = (slug: string) => caseStudies.find((item) => item.slug === slug);
export const getCaseStudiesFor = (key: string) => caseStudies.filter((item) => [...item.services, ...item.technologies, ...item.solutions].includes(key));
