export interface IndustryProfile {
  introduction: string;
  scenarios: Array<[string, string]>;
  discovery: string[];
  measures: string[];
  services: string[];
}
export const industryProfiles: Record<string, IndustryProfile> = {
  "banking-financial-services": {
    introduction:
      "Financial journeys cross channels, teams and systems of record. A useful modernization roadmap makes those handoffs visible and improves the customer experience while preserving traceability and operational control.",
    scenarios: [
      [
        "Connected onboarding",
        "Bring application capture, document review and status updates into one journey. Design explicit exception paths so operations teams can resolve incomplete information without losing context.",
      ],
      [
        "A clearer operational picture",
        "Connect approved data sources into consistent reporting models. Record ownership and lineage so teams can understand where a number came from before acting on it.",
      ],
      [
        "Safer platform change",
        "Introduce documented APIs around existing systems, validate access boundaries and migrate selected workflows in stages with reconciliation and rollback plans.",
      ],
    ],
    discovery: [
      "Which customer journey has the most manual handoffs?",
      "Where are access decisions and transaction histories recorded?",
      "Which systems must remain available during migration?",
    ],
    measures: [
      "Application completion and exception rates",
      "Time spent reconciling operational reports",
      "Change failure rate and recovery time",
    ],
    services: ["enterprise-applications", "cybersecurity", "data-ai"],
  },
  healthcare: {
    introduction:
      "Care and administration depend on information reaching the right person at the right moment. We focus on digital experiences, integration and operational workflows that reduce fragmentation while keeping sensitive information within defined access boundaries.",
    scenarios: [
      [
        "Simpler patient administration",
        "Connect appointment requests, reminders and administrative status into accessible journeys. Give users clear next steps and a route to human assistance when a digital process cannot meet their needs.",
      ],
      [
        "Connected information flows",
        "Map the source, meaning and owner of each data field before integrating systems. Build validation, exception queues and monitoring into the exchange.",
      ],
      [
        "Visibility for operations teams",
        "Bring scheduling, service demand and resource information into a shared operational view. Keep administrative analytics separate from clinical decisions and validate interpretation with domain specialists.",
      ],
    ],
    discovery: [
      "Where do patients or staff repeat the same information?",
      "Which records need role-based access and auditing?",
      "How are integration failures identified and resolved today?",
    ],
    measures: [
      "Administrative task completion time",
      "Integration exceptions and resolution time",
      "Digital journey accessibility and completion",
    ],
    services: [
      "digital-engineering",
      "enterprise-applications",
      "cybersecurity",
    ],
  },
  "retail-consumer": {
    introduction:
      "Customers experience one brand even when commerce, inventory and service run on different systems. Connect those foundations to make buying, fulfillment and support feel consistent across channels.",
    scenarios: [
      [
        "Commerce without dead ends",
        "Design product discovery, checkout and post-purchase support as one connected experience. Handle unavailable items, failed payments and returns with clear recovery paths.",
      ],
      [
        "Inventory that informs the journey",
        "Integrate catalog, stock and order signals with explicit freshness rules. Help teams identify discrepancies before they become customer promises that cannot be fulfilled.",
      ],
      [
        "Useful customer intelligence",
        "Build consistent event definitions and preference controls before introducing segmentation or recommendations. Evaluate changes against conversion, retention and customer experience together.",
      ],
    ],
    discovery: [
      "Which channel handoffs cause customers to start again?",
      "How quickly do stock changes reach customer-facing systems?",
      "Which customer events are reliable enough to guide decisions?",
    ],
    measures: [
      "Checkout and return completion",
      "Inventory discrepancy frequency",
      "Order status enquiry volume",
    ],
    services: ["digital-engineering", "data-ai", "enterprise-applications"],
  },
  "manufacturing-logistics": {
    introduction:
      "Production and logistics decisions depend on signals from assets, people and partner systems. Start by making those signals dependable, then place insight inside the workflows where teams plan, execute and respond.",
    scenarios: [
      [
        "Connected operations",
        "Unify selected production, warehouse and dispatch events with shared identifiers. Preserve timestamps and source context so teams can follow an order or asset through its lifecycle.",
      ],
      [
        "Exception-led logistics",
        "Surface delayed milestones and missing information in actionable queues. Assign ownership and escalation paths so alerts lead to a decision instead of another dashboard.",
      ],
      [
        "Maintenance planning foundations",
        "Establish asset histories and consistent failure categories before exploring predictive models. Validate data coverage and compare model suggestions with existing planning practices.",
      ],
    ],
    discovery: [
      "Where are operational updates still entered manually?",
      "Which systems share asset and order identifiers?",
      "Who acts when a shipment or production milestone is missed?",
    ],
    measures: [
      "Time to detect and resolve exceptions",
      "Manual reconciliation effort",
      "Completeness and freshness of asset records",
    ],
    services: ["data-ai", "enterprise-applications", "managed-it-services"],
  },
  "technology-software": {
    introduction:
      "Product growth adds complexity to architecture, release processes and support. Build a platform that gives teams a dependable path from a customer need to a safe release, with useful feedback at every stage.",
    scenarios: [
      [
        "Product delivery foundations",
        "Connect discovery, design systems and application architecture. Define clear service boundaries and reusable patterns so new features strengthen the product rather than fragmenting it.",
      ],
      [
        "A dependable path to production",
        "Automate build, test and deployment workflows with environment consistency and observable releases. Give teams fast feedback and a clear rollback path.",
      ],
      [
        "Platforms ready to grow",
        "Test tenant isolation, capacity assumptions and operational limits before demand changes. Use real workload patterns to guide scaling and reliability decisions.",
      ],
    ],
    discovery: [
      "What makes a small product change difficult to release?",
      "Which reliability issues recur across teams?",
      "Where do shared platform capabilities create bottlenecks?",
    ],
    measures: [
      "Lead time from change to production",
      "Escaped defects and recovery time",
      "Developer onboarding and environment setup time",
    ],
    services: ["digital-engineering", "cloud-platforms", "quality-engineering"],
  },
  "communications-media": {
    introduction:
      "Subscription experiences connect acquisition, provisioning, content and support. A shared view of the customer journey helps teams resolve friction across those boundaries and introduce new services with greater confidence.",
    scenarios: [
      [
        "Connected subscriber journeys",
        "Align account setup, entitlement and service activation. Make progress visible to customers and equip support teams with the same status information.",
      ],
      [
        "Content operations with clarity",
        "Design metadata, review and publishing workflows with ownership and version history. Integrate distribution systems through documented contracts and monitored interfaces.",
      ],
      [
        "Actionable service intelligence",
        "Connect selected customer and operational events to identify recurring service issues. Use agreed definitions so commercial and technical teams can discuss the same evidence.",
      ],
    ],
    discovery: [
      "Where does activation stall between systems?",
      "How are content rights and approval states represented?",
      "Which service signals are available to support teams?",
    ],
    measures: [
      "Activation completion and exception volume",
      "Content workflow turnaround",
      "Repeat support contacts",
    ],
    services: ["digital-engineering", "data-ai", "cloud-platforms"],
  },
  education: {
    introduction:
      "Learning experiences extend beyond a classroom or platform. Connect student-facing services with administration so learners, educators and staff can find information, complete tasks and understand what happens next.",
    scenarios: [
      [
        "Accessible learner journeys",
        "Design enrollment, course access and progress views for different devices and access needs. Include clear navigation, understandable errors and alternatives when a workflow needs assistance.",
      ],
      [
        "Less repetitive administration",
        "Connect application review, scheduling and communication around shared records. Use approval workflows and exception queues to reduce duplicate entry.",
      ],
      [
        "Institutional insight",
        "Agree definitions for participation and service usage before building reports. Limit access by role and review how analytics may affect learners before introducing automated decisions.",
      ],
    ],
    discovery: [
      "Which tasks require learners to visit multiple portals?",
      "Where are staff repeating data entry?",
      "What support is available when digital access is difficult?",
    ],
    measures: [
      "Enrollment journey completion",
      "Administrative processing time",
      "Accessibility issues and support demand",
    ],
    services: ["digital-engineering", "enterprise-applications", "data-ai"],
  },
  "public-sector": {
    introduction:
      "Public digital services need to work for people with different devices, abilities and levels of confidence. Begin with the complete service journey, including assisted channels, operational processes and the systems that sustain delivery.",
    scenarios: [
      [
        "Clear citizen services",
        "Simplify application forms, document requirements and status updates. Make eligibility guidance and next steps understandable, with a practical route to assistance.",
      ],
      [
        "Manageable legacy renewal",
        "Identify bounded services that can be improved alongside existing systems. Document interfaces and migrate in stages with operational teams involved in acceptance.",
      ],
      [
        "Accountable information flows",
        "Define data ownership, access roles and audit events across departments. Establish quality checks and retention decisions before expanding integrations.",
      ],
    ],
    discovery: [
      "Where do people abandon a service or need assistance?",
      "Which operational dependencies limit change?",
      "Who owns the data used at each stage?",
    ],
    measures: [
      "Service completion across channels",
      "Application rework and exception rates",
      "Time to resolve accessibility barriers",
    ],
    services: [
      "business-consulting",
      "application-modernization",
      "cybersecurity",
    ],
  },
};
