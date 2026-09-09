export const serviceOutcomes: Record<
  string,
  { focus: string; measures: [string, string][]; preparation: string }
> = {
  "digital-engineering": {
    focus: "A product people can use and a team that can keep improving it.",
    measures: [
      [
        "User success",
        "Observe completion of the most important journeys, points of abandonment and the support needed to finish a task.",
      ],
      [
        "Release confidence",
        "Review the time from an approved change to production alongside escaped defects and rollback frequency.",
      ],
      [
        "Experience quality",
        "Validate accessibility, responsiveness and performance with representative devices, users and data.",
      ],
    ],
    preparation:
      "Bring the primary user journeys, examples of current friction, existing designs and any integration constraints. Identify the people who will accept the product and maintain it after release.",
  },
  "data-ai": {
    focus: "Information that supports a decision you can explain.",
    measures: [
      [
        "Data dependability",
        "Monitor completeness, freshness and reconciliation against source systems, with an owner for each exception.",
      ],
      [
        "Decision usefulness",
        "Compare the time and effort needed to answer a business question before and after the new workflow.",
      ],
      [
        "AI evaluation",
        "Test representative cases for accuracy, unsupported responses and human-review needs before widening access.",
      ],
    ],
    preparation:
      "Identify one decision or workflow to improve, the information it depends on and who can authorize access. Include representative examples, expected answers and unacceptable failure modes.",
  },
  "cloud-platforms": {
    focus: "A platform that balances reliability, delivery speed and cost.",
    measures: [
      [
        "Service reliability",
        "Agree availability and recovery expectations for important user journeys and rehearse the response to failures.",
      ],
      [
        "Delivery repeatability",
        "Track manual deployment steps, configuration drift and the consistency of environment provisioning.",
      ],
      [
        "Cost visibility",
        "Attribute spend to workloads or teams and review cost against demand, service needs and capacity headroom.",
      ],
    ],
    preparation:
      "Bring a workload inventory, current hosting costs, system dependencies and recovery requirements. Include access owners and the people responsible for operating the platform.",
  },
  "business-consulting": {
    focus: "A decision the organization is ready to act on.",
    measures: [
      [
        "Decision clarity",
        "Document the options, assumptions, dependencies and reasons behind the recommended direction.",
      ],
      [
        "Roadmap readiness",
        "Check that priorities have an accountable owner, a defined next step and realistic dependencies.",
      ],
      [
        "Adoption readiness",
        "Identify the teams affected by the change, their training needs and how feedback will inform implementation.",
      ],
    ],
    preparation:
      "Share the business decision, competing priorities and the constraints that cannot move. Bring stakeholders who understand the current process and can agree the next commitment.",
  },
  "application-modernization": {
    focus: "A safer route from established systems to maintainable services.",
    measures: [
      [
        "Business continuity",
        "Validate critical behavior and data reconciliation during coexistence, migration and cutover.",
      ],
      [
        "Changeability",
        "Compare the effort to implement a representative change and the dependencies needed to release it.",
      ],
      [
        "Retirement readiness",
        "Confirm that replacement workflows, retained records and operational ownership are complete before retiring a component.",
      ],
    ],
    preparation:
      "Collect application dependencies, incident history, release constraints and critical business flows. Identify undocumented rules and the people who can validate them.",
  },
  cybersecurity: {
    focus: "Security priorities connected to the systems that matter.",
    measures: [
      [
        "Risk ownership",
        "Give each material finding a business context, accountable owner and agreed treatment decision.",
      ],
      [
        "Control coverage",
        "Check access boundaries, logging and protective controls against the systems and data in the agreed scope.",
      ],
      [
        "Response readiness",
        "Exercise escalation and recovery procedures so the team knows which actions and evidence an incident requires.",
      ],
    ],
    preparation:
      "Define the assessment scope and authorized access. Bring an asset inventory, existing policies and known concerns, along with the owners who can prioritize remediation.",
  },
  "enterprise-applications": {
    focus: "Connected business processes with clear information ownership.",
    measures: [
      [
        "Workflow efficiency",
        "Observe approval delays, repeated data entry and exception handling in the process being improved.",
      ],
      [
        "Integration quality",
        "Track failed transfers, reconciliation gaps and the time needed to resolve cross-system issues.",
      ],
      [
        "User adoption",
        "Review completion of role-specific tasks, training feedback and support requests after rollout.",
      ],
    ],
    preparation:
      "Map the business process, application owners and systems of record. Bring representative transactions, access roles and the rules that govern approvals or exceptions.",
  },
  "quality-engineering": {
    focus: "Evidence that helps teams make better release decisions.",
    measures: [
      [
        "Critical coverage",
        "Connect tests to important business journeys, integration boundaries and the highest-impact failure modes.",
      ],
      [
        "Signal quality",
        "Review flaky checks, feedback time and how easily a failure can be diagnosed by the delivery team.",
      ],
      [
        "Production learning",
        "Use escaped defects and incident patterns to improve the test strategy and acceptance criteria.",
      ],
    ],
    preparation:
      "Share the release process, defect history and existing checks. Identify the journeys that cannot fail, available test environments and constraints on representative test data.",
  },
  "managed-it-services": {
    focus: "Day-to-day support with an accountable path to improvement.",
    measures: [
      [
        "Service response",
        "Agree priorities and response expectations by business impact, then review performance against that scope.",
      ],
      [
        "Recurring issues",
        "Track repeat incidents and the corrective work needed to reduce avoidable support demand.",
      ],
      [
        "Operational ownership",
        "Keep escalation paths, asset records and runbooks current as systems and responsibilities change.",
      ],
    ],
    preparation:
      "Bring the service inventory, support hours, recent incident patterns and existing supplier responsibilities. Agree the systems in scope and how requests will be prioritized.",
  },
};
