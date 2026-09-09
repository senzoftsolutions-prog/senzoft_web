export const industryDelivery: Record<
  string,
  { scope: string; deliverables: string[]; readiness: string }
> = {
  "banking-financial-services": {
    scope:
      "Start with a single onboarding or servicing journey. Map the customer steps, the operational review queue and the systems that hold the authoritative record. Resolve ownership of exceptions before introducing automation.",
    deliverables: [
      "Customer journey and exception-path map",
      "Interface contracts and access responsibilities",
      "Reconciliation scenarios and a staged cutover plan",
    ],
    readiness:
      "Business and operations teams should be able to follow a request from submission to resolution. Review traceability, access boundaries and recovery behavior using representative scenarios before expanding the scope.",
  },
  healthcare: {
    scope:
      "Choose an administrative workflow such as appointment requests or referral status. Map where information is entered, checked and passed between teams. Involve the staff who resolve incomplete records as well as the users of the digital interface.",
    deliverables: [
      "Administrative workflow and field definitions",
      "Role-based access and integration exception handling",
      "Accessible journey prototype and acceptance scenarios",
    ],
    readiness:
      "Validate the meaning of exchanged information with domain owners. Check that staff can identify a failed integration, correct an administrative exception and continue work when a connected system is unavailable.",
  },
  "retail-consumer": {
    scope:
      "Follow one order journey across storefront, inventory and fulfillment. Identify when stock, payment and dispatch states change, and what a customer sees when those states do not agree. Use this map to select the first integration or experience improvement.",
    deliverables: [
      "Order-state model and ownership map",
      "Inventory freshness rules and integration checks",
      "Checkout, cancellation and returns acceptance scenarios",
    ],
    readiness:
      "Rehearse out-of-stock items, failed payments and delayed status updates. Customer support should have enough context to explain the next step without asking the customer to repeat the full transaction history.",
  },
  "manufacturing-logistics": {
    scope:
      "Select one production or shipment flow and establish consistent identifiers for its orders, assets and milestones. Assess the reliability of the available signals before building alerts or predictive features around them.",
    deliverables: [
      "Operational event model and source inventory",
      "Exception queues with owners and escalation rules",
      "Data-quality checks and operational dashboard prototype",
    ],
    readiness:
      "Validate timestamps, missing events and late-arriving updates against real operating conditions. Confirm that each alert has an actionable response and that teams can continue operating during a connectivity interruption.",
  },
  "technology-software": {
    scope:
      "Take one representative feature from discovery through production. Identify the steps that depend on manual coordination, inconsistent environments or undocumented platform knowledge. Use that evidence to prioritize developer experience improvements.",
    deliverables: [
      "Service boundaries and reusable implementation patterns",
      "Build, test and deployment workflow",
      "Release observability and rollback guidance",
    ],
    readiness:
      "A team member should be able to set up the environment, deliver a change and investigate a failed release using the documented path. Test that path with a realistic change rather than an isolated demonstration.",
  },
  "communications-media": {
    scope:
      "Choose a subscriber activation or content publishing journey. Document how entitlement, approval and delivery status move between systems, including the conditions that require a support or editorial intervention.",
    deliverables: [
      "Lifecycle states and ownership for each handoff",
      "Integration contracts and retry behavior",
      "Support-facing status views and acceptance checks",
    ],
    readiness:
      "Check delayed activation, withdrawn approvals and inconsistent entitlement records. Support and operations teams need an agreed view of current status and a clear way to resolve conflicting signals.",
  },
  education: {
    scope:
      "Start with a learner task such as enrollment or course access. Include administrative review, communications and assisted support in the scope so the digital journey reflects the whole service rather than only the portal screens.",
    deliverables: [
      "Learner and administrator journey maps",
      "Accessible prototype and form validation patterns",
      "Shared record definitions and workflow permissions",
    ],
    readiness:
      "Test the complete task on different devices and with keyboard navigation. Confirm how staff support learners who cannot complete a digital step, and how a corrected record reaches every system that depends on it.",
  },
  "public-sector": {
    scope:
      "Select a citizen service with a clear completion outcome. Map the application requirements, review stages and assisted channels. Identify where policy interpretation or a manual decision needs to remain visible to the service team.",
    deliverables: [
      "Service blueprint covering digital and assisted channels",
      "Data ownership and decision audit requirements",
      "Phased migration and service acceptance plan",
    ],
    readiness:
      "Validate understandable instructions, accessible interactions and recoverable failures. Operational teams should be able to explain an application's status and maintain service when a dependency is unavailable.",
  },
};
