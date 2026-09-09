export interface Solution {
  slug: string;
  title: string;
  service: string;
  summary: string;
  challenge: string;
  scope: [string, string][];
  deliverables: string[];
  considerations: string[];
}
export const solutions: Solution[] = [
  {
    slug: "technology-strategy",
    title: "Technology Strategy & Delivery Planning",
    service: "business-consulting",
    summary:
      "Turn business priorities into a practical technology roadmap, with clear choices, dependencies and a defined first engagement.",
    challenge:
      "When priorities compete and the current systems are difficult to understand, a technology decision can stall or move ahead on assumptions. A useful strategy connects the business outcome with delivery constraints, investment choices and the people who must act on the plan.",
    scope: [
      [
        "Current-state assessment",
        "Understand the business process, user needs and the applications that support them. Capture known risks, operational constraints and the decisions stakeholders need to make.",
      ],
      [
        "Options and prioritization",
        "Compare approaches against business value, implementation effort and ongoing ownership. Make tradeoffs visible and distinguish essential foundations from improvements that can follow later.",
      ],
      [
        "Delivery and adoption planning",
        "Sequence the roadmap around dependencies and realistic increments. Define responsibilities, acceptance criteria and the communication or training needed to prepare the organization.",
      ],
    ],
    deliverables: [
      "Business and technology assessment",
      "Options, assumptions and decision record",
      "Prioritized roadmap and proposed first scope",
      "Stakeholder responsibilities and adoption considerations",
    ],
    considerations: [
      "What decision needs to be made and who owns it?",
      "Which constraints and dependencies are already known?",
      "What evidence would make the next investment decision clearer?",
    ],
  },
  {
    slug: "legacy-modernization",
    title: "Legacy Application Modernization",
    service: "application-modernization",
    summary:
      "Assess, renew and integrate established applications through staged changes that preserve important business behavior.",
    challenge:
      "Established software can contain years of business rules alongside outdated dependencies and hard-to-change interfaces. Modernization needs to preserve that knowledge while creating a clearer architecture and a safer path for future releases.",
    scope: [
      [
        "Application assessment",
        "Map business criticality, dependencies and undocumented behavior. Compare targeted improvement, replacement and phased renewal against continuity and maintenance needs.",
      ],
      [
        "Incremental renewal",
        "Isolate a useful boundary and introduce new services or interfaces alongside the existing application. Define coexistence, data synchronization and compatibility before shifting a workflow.",
      ],
      [
        "Migration and retirement",
        "Rehearse data movement, reconciliation and rollback with representative transactions. Confirm ownership and retained records before retiring an older component.",
      ],
    ],
    deliverables: [
      "Application inventory and modernization options",
      "Target architecture and staged migration plan",
      "Validated integration and data reconciliation",
      "Cutover, rollback and retirement guidance",
    ],
    considerations: [
      "Which workflows must remain available throughout change?",
      "Where are undocumented rules and integration dependencies?",
      "Who can validate equivalent behavior before cutover?",
    ],
  },
  {
    slug: "web-development",
    title: "Website & Web Application Development",
    service: "digital-engineering",
    summary:
      "Corporate websites, customer portals and browser-based business applications built around clear journeys and maintainable technology.",
    challenge:
      "A website needs to communicate clearly, help visitors act and stay manageable as the organization grows. A business application adds another responsibility: supporting real workflows, access permissions and dependable information across connected systems.",
    scope: [
      [
        "Corporate websites",
        "Structure service information, company content and contact journeys into responsive pages. Plan content ownership, search visibility, accessibility and the publishing workflow alongside the visual design.",
      ],
      [
        "Customer and employee portals",
        "Bring account information, requests, documents and status updates into a coherent experience. Define roles and session handling, and design useful states for empty results, errors and slow dependencies.",
      ],
      [
        "Business web applications",
        "Translate an operational process into interfaces, application services and integrations. Support validations, approvals, notifications and audit history with clearly documented business rules.",
      ],
    ],
    deliverables: [
      "Information architecture and responsive interface designs",
      "Frontend components and documented application interfaces",
      "Content models, access roles and integration validation",
      "Cross-device checks, deployment guidance and maintenance handover",
    ],
    considerations: [
      "Who will update content and approve changes?",
      "Which user tasks require authentication or different access levels?",
      "Which systems supply information, and what happens when they are unavailable?",
    ],
  },
  {
    slug: "mobile-app-development",
    title: "Mobile Application Development",
    service: "digital-engineering",
    summary:
      "Mobile experiences for customers, employees and field teams, from workflow design to release preparation and ongoing improvement.",
    challenge:
      "Mobile users work with small screens, interrupted connectivity and limited time. A useful application must respect that context while remaining consistent with business systems and protecting the information available on the device.",
    scope: [
      [
        "Customer applications",
        "Design onboarding, account access and important self-service journeys around real usage. Define notification behavior, consent and clear recovery paths for interrupted tasks.",
      ],
      [
        "Field and workforce tools",
        "Support assignments, structured capture and status updates for people away from a desk. Agree offline behavior, synchronization rules and the treatment of conflicting changes.",
      ],
      [
        "Platform integration",
        "Connect the app to documented services and identity systems. Plan version compatibility, telemetry, distribution requirements and the support needed after release.",
      ],
    ],
    deliverables: [
      "Mobile journeys, prototypes and platform choices",
      "Application implementation and backend integrations",
      "Device coverage, accessibility and interruption testing",
      "Release checklist, monitoring plan and ownership documentation",
    ],
    considerations: [
      "Which devices and operating systems do your users rely on?",
      "What must work when a network connection is unavailable?",
      "How will application versions and account access be managed?",
    ],
  },
  {
    slug: "custom-software",
    title: "Custom Software Development",
    service: "digital-engineering",
    summary:
      "Purpose-built applications that connect the specific rules, people and processes behind your business.",
    challenge:
      "Standard tools do not always reflect how a business operates. Custom software can close that gap when the requirements, ownership and long-term maintenance are understood before implementation starts.",
    scope: [
      [
        "Workflow applications",
        "Model the steps, responsibilities and exceptions of a business process. Make approvals and status changes visible so users know what needs their attention.",
      ],
      [
        "Application services",
        "Design reusable business logic, interfaces and persistence around clear boundaries. Record validations and error behavior so integrations remain understandable as the system changes.",
      ],
      [
        "Product evolution",
        "Create an incremental delivery plan that tests assumptions with users. Balance near-term features with performance, security and the effort required to maintain the application.",
      ],
    ],
    deliverables: [
      "Business rules and prioritized functional requirements",
      "Reviewed architecture and working application increments",
      "Automated regression checks and acceptance evidence",
      "Source documentation, deployment process and support handover",
    ],
    considerations: [
      "Which requirements distinguish your process from standard software?",
      "What is the smallest release that creates a useful result?",
      "Who will own the product backlog and ongoing operations?",
    ],
  },
  {
    slug: "ui-ux-design",
    title: "UI/UX & Product Design",
    service: "business-consulting",
    summary:
      "Research, information architecture and interface design that make digital products easier to understand and use.",
    challenge:
      "A polished screen can still leave people unsure about what to do. Product design connects business intent with user needs, organizing information and interactions so the next action is clear and the experience can be implemented consistently.",
    scope: [
      [
        "Discovery and research",
        "Understand the people using the product, their environment and the obstacles they face. Turn interviews, workflow observations and existing feedback into questions the design must answer.",
      ],
      [
        "Journeys and prototypes",
        "Explore navigation, content hierarchy and interaction patterns before committing to implementation. Review representative tasks with stakeholders and capture the reasoning behind revisions.",
      ],
      [
        "Design systems",
        "Document components, states and accessibility expectations so design decisions carry into engineering. Cover validation, empty states, responsive behavior and content guidance.",
      ],
    ],
    deliverables: [
      "User needs, journey maps and experience priorities",
      "Wireframes and interactive prototypes",
      "Visual system and reusable component specifications",
      "Usability findings and engineering handoff notes",
    ],
    considerations: [
      "Can we speak with representative users?",
      "Which journey is most important to improve first?",
      "What brand, language and accessibility requirements apply?",
    ],
  },
  {
    slug: "ecommerce-solutions",
    title: "E-commerce Solutions",
    service: "enterprise-applications",
    summary:
      "Connected commerce experiences spanning product discovery, ordering, payments and the operational workflows behind fulfillment.",
    challenge:
      "Commerce spans more than a storefront. Product information, availability, orders and customer service need to agree across systems, while the buying journey must explain costs, choices and order status clearly.",
    scope: [
      [
        "Storefront experience",
        "Organize catalog navigation, search, product details and checkout around customer decisions. Design useful error handling, responsive layouts and accessible interactions.",
      ],
      [
        "Commerce integration",
        "Connect product, inventory, payment and order systems through documented interfaces. Plan retries, duplicate-event handling and reconciliation across the transaction lifecycle.",
      ],
      [
        "Operational tools",
        "Support the people handling order exceptions, catalog updates and customer questions. Define permissions, audit history and visibility into failed or delayed workflows.",
      ],
    ],
    deliverables: [
      "Commerce journey and catalog structure",
      "Storefront implementation and transaction integrations",
      "Order and inventory reconciliation checks",
      "Operational guidance and launch-readiness evidence",
    ],
    considerations: [
      "Which platform owns product, price and inventory information?",
      "What payment, shipping and fulfillment providers are involved?",
      "How are refunds, cancellations and order exceptions handled?",
    ],
  },
  {
    slug: "erp-crm-integration",
    title: "ERP, CRM & Business Systems Integration",
    service: "enterprise-applications",
    summary:
      "Connect customer, finance and operational processes through reliable interfaces and shared information ownership.",
    challenge:
      "Teams lose time when customer records, orders and operational updates must be copied between applications. Integration should make the handoff dependable while preserving clear rules for who owns each record and resolves a mismatch.",
    scope: [
      [
        "Process and data mapping",
        "Identify the systems of record, transaction sequence and field definitions involved. Map the exceptions and approval rules that an integration must preserve.",
      ],
      [
        "Interfaces and automation",
        "Implement documented APIs, events or scheduled exchanges according to the capabilities of each platform. Include authentication, validation and repeatable handling of retried requests.",
      ],
      [
        "Operational visibility",
        "Make failures traceable with logs, reconciliation views and escalation paths. Prepare business users and support teams to investigate missing or inconsistent information.",
      ],
    ],
    deliverables: [
      "Process maps and source-to-target field mappings",
      "Integration interfaces and repeatable deployment configuration",
      "End-to-end validation and reconciliation evidence",
      "Monitoring, exception handling and support documentation",
    ],
    considerations: [
      "Which applications are the authoritative sources?",
      "What data must update immediately and what can be scheduled?",
      "Who can resolve conflicting records or rejected transactions?",
    ],
  },
  {
    slug: "ai-automation",
    title: "AI & Intelligent Automation",
    service: "data-ai",
    summary:
      "Focused AI and workflow automation that supports real tasks, with evaluation and human oversight designed into the solution.",
    challenge:
      "An impressive AI response does not automatically improve a business process. Useful automation starts with a bounded task, dependable information and a clear understanding of the consequences when the output is wrong.",
    scope: [
      [
        "Use-case assessment",
        "Compare the intended workflow with simpler automation options. Identify available data, expected benefit, human decision points and the failures that must be detected.",
      ],
      [
        "Solution development",
        "Build retrieval, classification, extraction or assisted workflows around approved sources. Define access controls, output structure and escalation to a person when confidence or context is insufficient.",
      ],
      [
        "Evaluation and operation",
        "Test representative and difficult cases against an agreed baseline. Monitor changes in inputs and behavior, and document how the system can be corrected or switched off.",
      ],
    ],
    deliverables: [
      "Bounded use case and evaluation plan",
      "Integrated automation workflow with review controls",
      "Representative test cases and documented limitations",
      "Monitoring and ongoing evaluation responsibilities",
    ],
    considerations: [
      "Which task should the system assist or automate?",
      "What examples show a correct and an unacceptable result?",
      "Who reviews exceptions and authorizes broader use?",
    ],
  },
  {
    slug: "data-analytics",
    title: "Data Engineering & Analytics",
    service: "data-ai",
    summary:
      "Data pipelines, reporting models and dashboards that help teams answer operational questions with consistent information.",
    challenge:
      "When reports disagree, people spend time debating numbers instead of making decisions. A dependable data foundation makes definitions, sources and quality visible so users can understand and act on the information in front of them.",
    scope: [
      [
        "Data foundations",
        "Inventory sources, map entities and agree ownership for important fields. Design ingestion and transformation with validation, lineage and recoverable processing.",
      ],
      [
        "Reporting and analytics",
        "Build shared metric definitions and views around the decisions users need to make. Include the context, filters and freshness indicators required to interpret a result.",
      ],
      [
        "Quality and governance",
        "Assign responsibility for exceptions and changes in source structure. Document access, retention expectations and the checks that keep information useful over time.",
      ],
    ],
    deliverables: [
      "Source inventory and shared metric definitions",
      "Validated pipelines and reporting models",
      "Decision-focused dashboards with access controls",
      "Data quality monitoring and ownership guidance",
    ],
    considerations: [
      "Which business questions require more reliable answers?",
      "How fresh does each type of information need to be?",
      "Who can confirm definitions and resolve quality issues?",
    ],
  },
  {
    slug: "cloud-devops",
    title: "Cloud & DevOps Engineering",
    service: "cloud-platforms",
    summary:
      "Cloud foundations, delivery automation and operational visibility that make software easier to deploy and sustain.",
    challenge:
      "Cloud infrastructure becomes difficult to manage when environments drift, releases depend on manual steps and cost has no clear owner. A well-designed platform connects repeatable delivery with the service expectations of the business.",
    scope: [
      [
        "Cloud foundations",
        "Design identity, networking and environments around workload needs. Define access boundaries, configuration ownership and the information needed to understand cost.",
      ],
      [
        "Delivery automation",
        "Create repeatable infrastructure and deployment workflows with validation and traceability. Separate secrets from source code and make release and rollback procedures explicit.",
      ],
      [
        "Reliability engineering",
        "Connect telemetry to important user journeys and rehearse recovery. Build runbooks that help the operating team identify a failure and take a useful next action.",
      ],
    ],
    deliverables: [
      "Workload assessment and cloud architecture",
      "Infrastructure definitions and delivery pipelines",
      "Monitoring, cost visibility and recovery procedures",
      "Platform documentation and operational handover",
    ],
    considerations: [
      "What availability and recovery expectations apply?",
      "Which workloads or dependencies constrain migration?",
      "Who owns cloud spend, access and incident response?",
    ],
  },
  {
    slug: "security-assurance",
    title: "Application Security & Assurance",
    service: "cybersecurity",
    summary:
      "Security assessment and improvement work connected to application behavior, information access and delivery practices.",
    challenge:
      "Security findings are only useful when teams understand their business impact and how to address them. Effective assurance connects technical review with accountable remediation and the controls needed to sustain the improvement.",
    scope: [
      [
        "Scoped assessment",
        "Agree authorized systems, access and testing boundaries before work begins. Review architecture, identity flows and the handling of sensitive information.",
      ],
      [
        "Engineering improvement",
        "Prioritize findings with application owners and address the underlying causes. Include dependency management, validation, access checks and safe configuration in the delivery process.",
      ],
      [
        "Verification and readiness",
        "Retest agreed changes, document residual risks and review monitoring and response procedures. Make ownership and escalation clear to the people running the application.",
      ],
    ],
    deliverables: [
      "Assessment scope and prioritized findings",
      "Remediation plan with accountable owners",
      "Verification evidence and residual risk record",
      "Secure delivery guidance and response considerations",
    ],
    considerations: [
      "Which systems are authorized for assessment?",
      "What information and user roles require special protection?",
      "Who can approve remediation and accept residual risk?",
    ],
  },
  {
    slug: "software-testing",
    title: "Software Testing & Quality Automation",
    service: "quality-engineering",
    summary:
      "Practical testing strategies and automation that provide useful evidence before release and learning after launch.",
    challenge:
      "A large test suite is not enough if it misses critical journeys or produces unreliable signals. Quality engineering focuses on the failures that matter, the environments that reproduce them and the feedback that helps teams decide what is ready.",
    scope: [
      [
        "Quality strategy",
        "Identify critical business flows, integration boundaries and failure impact. Connect acceptance criteria with the layers of testing needed to assess them.",
      ],
      [
        "Automation and coverage",
        "Build maintainable checks for representative behavior and add them to delivery workflows. Manage test data, isolate unstable dependencies and investigate flaky results.",
      ],
      [
        "Non-functional validation",
        "Evaluate relevant performance, accessibility and compatibility needs. Use production incident patterns to improve coverage and release readiness criteria.",
      ],
    ],
    deliverables: [
      "Risk-based quality strategy and coverage map",
      "Maintainable automated checks and test data guidance",
      "Defect reports and release-readiness evidence",
      "Pipeline integration and test ownership documentation",
    ],
    considerations: [
      "Which user journeys would have the highest failure impact?",
      "What environments and test data are available?",
      "Which recurring defects or slow feedback loops need attention?",
    ],
  },
  {
    slug: "it-support",
    title: "IT Support & Managed Operations",
    service: "managed-it-services",
    summary:
      "Structured support and ongoing improvement for the applications and technology services your teams depend on.",
    challenge:
      "Daily support becomes reactive when requests, ownership and escalation are unclear. A sustainable service model defines the supported environment, how issues are prioritized and which recurring problems deserve permanent improvement.",
    scope: [
      [
        "Service onboarding",
        "Inventory supported systems and document access, suppliers and responsibilities. Agree service hours, request channels and priority definitions for the contracted scope.",
      ],
      [
        "Support and monitoring",
        "Use runbooks and operational information to triage incidents and requests. Track recurring patterns and communicate status with the people affected.",
      ],
      [
        "Continuous improvement",
        "Review support demand, changes and unresolved risks with service owners. Maintain documentation and prioritize corrective work that reduces repeated disruption.",
      ],
    ],
    deliverables: [
      "Service catalog and responsibility matrix",
      "Request, incident and escalation workflows",
      "Operational reporting and maintained runbooks",
      "Recurring-issue analysis and improvement backlog",
    ],
    considerations: [
      "Which systems and service hours belong in scope?",
      "How are priorities defined by business impact?",
      "What existing providers and escalation responsibilities must be coordinated?",
    ],
  },
];
export const solutionUrl = (item: Solution) =>
  `/services/${item.service}/${item.slug}`;

const capabilitySolutions: Record<string, string[]> = {
  "digital-engineering": [
    "technology-strategy",
    "web-development",
    "legacy-modernization",
    "software-testing",
  ],
  "data-ai": [
    "data-analytics",
    "data-analytics",
    "ai-automation",
    "data-analytics",
  ],
  "cloud-platforms": [
    "cloud-devops",
    "legacy-modernization",
    "cloud-devops",
    "it-support",
  ],
  "business-consulting": [
    "technology-strategy",
    "technology-strategy",
    "ui-ux-design",
    "technology-strategy",
  ],
  "application-modernization": [
    "legacy-modernization",
    "legacy-modernization",
    "erp-crm-integration",
    "legacy-modernization",
  ],
  cybersecurity: [
    "security-assurance",
    "security-assurance",
    "security-assurance",
    "security-assurance",
  ],
  "enterprise-applications": [
    "erp-crm-integration",
    "erp-crm-integration",
    "erp-crm-integration",
    "ai-automation",
  ],
  "quality-engineering": [
    "software-testing",
    "software-testing",
    "security-assurance",
    "software-testing",
  ],
  "managed-it-services": [
    "it-support",
    "cloud-devops",
    "it-support",
    "it-support",
  ],
};
export function capabilityUrl(service: string, index: number) {
  const solution = solutions.find(
    (item) => item.slug === capabilitySolutions[service]?.[index],
  );
  return solution ? solutionUrl(solution) : `/services/${service}`;
}
