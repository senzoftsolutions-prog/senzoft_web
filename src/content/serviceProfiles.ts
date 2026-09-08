export interface ServiceProfile {
  challenge: string;
  technologies: string[];
  engagement: string[];
  faqs: Array<[string, string]>;
}
const standardFaqs: Array<[string, string]> = [
  [
    "How does an engagement begin?",
    "We start with a focused discovery to understand business outcomes, users, systems, constraints and delivery readiness before confirming the roadmap.",
  ],
  [
    "Can SENZOFT work with our existing technology team?",
    "Yes. Delivery can be advisory, project-based or a blended team model with clear ownership, governance and knowledge transfer.",
  ],
  [
    "How are quality and security handled?",
    "Quality, security, accessibility and operational readiness are incorporated throughout architecture, engineering, testing and release—not added at the end.",
  ],
];
export const serviceProfiles: Record<string, ServiceProfile> = {
  "digital-engineering": {
    challenge:
      "Customers and employees expect intuitive, reliable digital experiences while engineering teams need foundations that can evolve quickly.",
    technologies: [
      "React",
      "TypeScript",
      "Node.js",
      "Java",
      ".NET",
      "REST & GraphQL",
      "Microservices",
      "Containers",
    ],
    engagement: [
      "Product discovery",
      "Experience and architecture",
      "Agile engineering",
      "Release and optimization",
    ],
    faqs: standardFaqs,
  },
  "data-ai": {
    challenge:
      "Enterprise AI creates value only when data is trusted, use cases are focused and responsible controls are built into delivery.",
    technologies: [
      "Python",
      "SQL",
      "Data lakes",
      "Data warehouses",
      "Machine learning",
      "Generative AI",
      "MLOps",
      "BI platforms",
    ],
    engagement: [
      "Use-case discovery",
      "Data foundation",
      "Model and solution engineering",
      "Adoption and governance",
    ],
    faqs: standardFaqs,
  },
  "cloud-platforms": {
    challenge:
      "Cloud programs must balance modernization speed with resilience, security, cost visibility and operational control.",
    technologies: [
      "AWS",
      "Microsoft Azure",
      "Google Cloud",
      "Kubernetes",
      "Terraform",
      "Docker",
      "Observability",
      "FinOps",
    ],
    engagement: [
      "Cloud assessment",
      "Landing-zone design",
      "Migration and modernization",
      "Operate and optimize",
    ],
    faqs: standardFaqs,
  },
  "business-consulting": {
    challenge:
      "Transformation stalls when strategy, processes, technology decisions and organizational adoption move separately.",
    technologies: [
      "Process intelligence",
      "Enterprise architecture",
      "Design thinking",
      "Agile delivery",
      "Product operating models",
      "Change enablement",
    ],
    engagement: [
      "Frame the ambition",
      "Assess current state",
      "Design the roadmap",
      "Mobilize delivery",
    ],
    faqs: standardFaqs,
  },
  "application-modernization": {
    challenge:
      "Legacy systems can restrict speed and insight, yet modernization must protect critical operations and institutional knowledge.",
    technologies: [
      "Cloud native",
      "APIs",
      "Microservices",
      "Serverless",
      "Containers",
      "Event-driven architecture",
      "DevSecOps",
      "Automated migration",
    ],
    engagement: [
      "Portfolio assessment",
      "Modernization strategy",
      "Incremental transformation",
      "Cutover and optimization",
    ],
    faqs: standardFaqs,
  },
  cybersecurity: {
    challenge:
      "Expanding cloud, application and identity environments require security to be embedded across the technology lifecycle.",
    technologies: [
      "IAM",
      "Zero trust",
      "Cloud security",
      "Application security",
      "SIEM",
      "Threat modeling",
      "DevSecOps",
      "Security automation",
    ],
    engagement: [
      "Risk assessment",
      "Security architecture",
      "Controls implementation",
      "Monitor and improve",
    ],
    faqs: standardFaqs,
  },
  "enterprise-applications": {
    challenge:
      "Core business platforms create more value when processes, integrations, data and employee experiences work as one system.",
    technologies: [
      "SAP",
      "Salesforce",
      "Microsoft Dynamics",
      "Oracle",
      "ServiceNow",
      "Integration platforms",
      "Workflow automation",
      "Analytics",
    ],
    engagement: [
      "Process and platform strategy",
      "Solution design",
      "Implementation and integration",
      "Adoption and support",
    ],
    faqs: standardFaqs,
  },
  "quality-engineering": {
    challenge:
      "Frequent releases demand continuous confidence across functionality, performance, security, accessibility and user experience.",
    technologies: [
      "Test automation",
      "API testing",
      "Performance testing",
      "Mobile testing",
      "Security testing",
      "CI/CD quality gates",
      "Accessibility",
      "Test data management",
    ],
    engagement: [
      "Quality assessment",
      "Automation strategy",
      "Continuous assurance",
      "Quality intelligence",
    ],
    faqs: standardFaqs,
  },
  "managed-it-services": {
    challenge:
      "Business-critical technology needs reliable support, intelligent operations and continuous improvement—not reactive ticket management.",
    technologies: [
      "IT service management",
      "Cloud operations",
      "Application monitoring",
      "AIOps",
      "Observability",
      "Automation",
      "SRE practices",
      "Digital workplace",
    ],
    engagement: [
      "Transition and baseline",
      "Stabilize services",
      "Automate operations",
      "Continuously optimize",
    ],
    faqs: standardFaqs,
  },
};
