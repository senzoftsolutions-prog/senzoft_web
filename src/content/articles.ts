export interface ArticleBody {
  thesis: string;
  sections: Array<{ title: string; paragraphs: string[] }>;
  questions: string[];
  service: string;
}
export const articles: Record<string, ArticleBody> = {
  "from-ai-pilot-to-practical-value": {
    thesis:
      "The useful unit of AI investment is a better workflow, with a clear owner and a way to judge whether it helped.",
    sections: [
      {
        title: "Start with the decision people need to make",
        paragraphs: [
          "A demonstration can produce an impressive answer without changing how work gets done. Begin by describing the task, the person responsible for it and the information they need. Identify the cost of an incorrect answer and the point at which someone should intervene.",
          "For a document review assistant, the first objective might be helping a reviewer locate supporting evidence. That is a more testable scope than asking a model to make the entire decision. It also reveals what source access, citations and review controls the workflow needs.",
        ],
      },
      {
        title: "Treat the data foundation as part of the product",
        paragraphs: [
          "Document freshness, ownership and access rules matter as much as model selection. A system that retrieves an outdated policy can be fluent and still be unhelpful. Decide which sources are authoritative, how updates arrive and what happens when no suitable evidence is available.",
          "Build an evaluation set from representative tasks, including ambiguous requests and cases where the correct response is to ask for clarification. Keep sensitive records out of demonstrations unless their use has been explicitly approved.",
        ],
      },
      {
        title: "Design the human handoff",
        paragraphs: [
          "Show reviewers what the system used, what it could not establish and what they can change. Give people a way to correct the output and report recurring issues. Feedback should lead to an owned improvement process rather than disappearing into a log.",
          "The operating model needs to cover source changes, model updates, failed requests and unexpected costs. Assign responsibility for each before expanding access to more users.",
        ],
      },
      {
        title: "Scale from evidence",
        paragraphs: [
          "Compare the assisted workflow with the current baseline. Look at task completion time, correction effort and the quality of the final decision together. Time saved is less useful if reviewers must spend it checking unsupported claims.",
          "Expand to adjacent tasks only after the team understands the limits of the first one. Reuse the access controls, evaluation practices and monitoring that made the initial workflow dependable.",
        ],
      },
    ],
    questions: [
      "Who owns the final decision?",
      "Can every important answer be traced to an approved source?",
      "What evidence would justify expanding the pilot?",
    ],
    service: "data-ai",
  },
  "modernization-without-disruption": {
    thesis:
      "A modernization roadmap should explain how the business keeps operating at every intermediate step.",
    sections: [
      {
        title: "Map the system people actually use",
        paragraphs: [
          "Application inventories rarely show every spreadsheet, batch job and manual exception that keeps a business process moving. Follow one important transaction from start to finish and speak with the people who resolve problems when the standard path fails.",
          "Record dependencies, data owners and operational deadlines. This map helps distinguish components that can change independently from those that require coordinated migration.",
        ],
      },
      {
        title: "Choose a bounded first move",
        paragraphs: [
          "Select a workflow with a clear boundary and a measurable problem. A read-only customer status service may provide a safer starting point than replacing the entire transaction engine. The first slice should teach the team how to build, release and support the new foundation.",
          "Agree the interfaces between old and new systems. Document failure behavior, data freshness and reconciliation responsibilities so coexistence does not become an invisible source of risk.",
        ],
      },
      {
        title: "Rehearse the transition",
        paragraphs: [
          "Test migration against representative data and operational conditions. A successful deployment is only one part of readiness: support teams also need dashboards, runbooks and a way to recognize when a cutover should stop.",
          "Define rollback criteria in business terms, such as missing transactions or delayed processing. Test the rollback path and confirm what happens to data written during the transition.",
        ],
      },
      {
        title: "Finish the retirement work",
        paragraphs: [
          "Running two platforms indefinitely can preserve the cost and complexity the program was meant to remove. Make decommissioning a planned outcome, with owners for archived records, retired interfaces and updated support procedures.",
          "Review the first migration before selecting the next slice. Use what changed in delivery effort, reliability and operating cost to refine the roadmap.",
        ],
      },
    ],
    questions: [
      "Which business process must remain available?",
      "What would trigger a rollback?",
      "Who owns the retirement of the old service?",
    ],
    service: "application-modernization",
  },
  "designing-trusted-digital-services": {
    thesis:
      "Trust grows when a service is understandable, recoverable and consistent at the moments that matter.",
    sections: [
      {
        title: "Make the next step understandable",
        paragraphs: [
          "Users should know what a service needs from them and why. Clear labels, concise requirements and visible progress reduce uncertainty before a task begins. Describe the result of an action in the language of the user rather than the internal system.",
          "A form should distinguish optional information from required information and explain how to correct an error. Preserve valid entries when something goes wrong so users do not have to repeat work.",
        ],
      },
      {
        title: "Design for recovery",
        paragraphs: [
          "Payment failures, expired sessions and unavailable dependencies are part of real journeys. Decide what the user sees, which information is preserved and how they can resume. A generic error page transfers the entire recovery problem to the customer.",
          "Operational teams need enough context to help without asking users to recreate the incident. Connect a support reference to relevant technical events while keeping sensitive information out of visible diagnostics.",
        ],
      },
      {
        title: "Include different ways of interacting",
        paragraphs: [
          "Keyboard access, readable text, descriptive headings and sensible focus order help people use a service in different circumstances. Test complete tasks, including validation and confirmation, instead of checking only the first screen.",
          "Motion and media should support comprehension. Offer pause controls, respect reduced-motion preferences and ensure the essential message remains available when a video cannot play.",
        ],
      },
      {
        title: "Measure the experience after release",
        paragraphs: [
          "Combine completion rates and error patterns with direct feedback. A fast page can still be confusing, and a completed task can still require unnecessary effort. Examine where people leave, repeat actions or ask for help.",
          "Turn recurring problems into owned product work. Trust becomes a property of the operating process when teams keep improving the service after launch.",
        ],
      },
    ],
    questions: [
      "Can a user recover without starting again?",
      "Does the whole task work with a keyboard?",
      "Which support requests reveal unclear design?",
    ],
    service: "digital-engineering",
  },
  "cloud-cost-to-cloud-value": {
    thesis:
      "Cloud spending becomes more useful when teams can connect it to a workload, an owner and a business outcome.",
    sections: [
      {
        title: "Create a shared view of consumption",
        paragraphs: [
          "An invoice shows what was consumed, but it does not explain whether that consumption was useful. Establish resource ownership and consistent workload labels before comparing teams or proposing reductions. Include shared services whose costs are easy to overlook.",
          "Discuss spending with the people who understand demand and reliability requirements. A temporary test environment and a customer-facing transaction service should not be evaluated with the same assumptions.",
        ],
      },
      {
        title: "Choose a meaningful unit",
        paragraphs: [
          "Cost per completed order, active workspace or processed document can be more informative than total monthly spend. Select a unit that the business recognizes and document what is included in its calculation.",
          "Watch the trend alongside demand and service quality. Rising spend may reflect healthy growth; falling spend may conceal slower processing or deferred maintenance.",
        ],
      },
      {
        title: "Improve architecture and operating habits",
        paragraphs: [
          "Start with resources that have no owner, unused environments and mismatches between provisioned capacity and actual demand. Review storage lifecycle, data movement and scheduled workloads as well as compute.",
          "Test changes under representative conditions. A cheaper configuration is not an improvement if it creates recovery work or undermines an agreed service objective.",
        ],
      },
      {
        title: "Make review part of delivery",
        paragraphs: [
          "Give engineering teams feedback about the cost consequences of design decisions before release. Set review points for new services and large demand changes, with a clear owner for exceptions.",
          "Keep the conversation focused on sustainable value: what the workload enables, what reliability it requires and what alternatives the team can realistically maintain.",
        ],
      },
    ],
    questions: [
      "Can each significant workload be assigned an owner?",
      "What unit connects spending to demand?",
      "Which savings can be tested without weakening the service?",
    ],
    service: "cloud-platforms",
  },
  "quality-engineering-in-ai-era": {
    thesis:
      "AI changes how software is produced and how some features behave; neither change removes the need for independent evidence.",
    sections: [
      {
        title: "Separate assisted development from intelligent features",
        paragraphs: [
          "AI-generated application code and a feature that calls a model present different testing problems. Generated code still needs review, deterministic tests and validation against requirements. Model-driven features also need evaluation of behavior across a range of inputs.",
          "Make this distinction in the test strategy. It helps teams choose useful controls instead of treating every AI-related change as the same category of risk.",
        ],
      },
      {
        title: "Test the boundaries that matter",
        paragraphs: [
          "Check authorization, input validation and failure paths regardless of how code was written. A plausible implementation can still misunderstand a business rule or bypass an important permission check.",
          "For model-based features, include unsupported requests, missing context and misleading source material in evaluation. Define acceptable behavior when the system cannot produce a reliable answer.",
        ],
      },
      {
        title: "Keep evaluations representative",
        paragraphs: [
          "Build evaluation examples from the work users actually do. Include common requests as well as costly edge cases, and document why each example belongs in the set. Review the examples when the workflow or source material changes.",
          "Avoid tuning only for a narrow score. Combine automated checks with human assessment of usefulness, traceability and the effort required to correct an output.",
        ],
      },
      {
        title: "Observe behavior in operation",
        paragraphs: [
          "Monitor failures and user corrections after release, with appropriate controls around captured data. Model or retrieval changes can alter behavior even when the surrounding interface remains the same.",
          "Keep a versioned record of the configuration and evaluation results used for a release. That record gives the team a basis for investigating regressions and deciding whether to roll back.",
        ],
      },
    ],
    questions: [
      "Which checks are independent of the generated implementation?",
      "Does evaluation cover refusal and uncertainty?",
      "Can a behavior change be traced to a version?",
    ],
    service: "quality-engineering",
  },
  "secure-modernization-roadmap": {
    thesis:
      "Modernization creates an opportunity to simplify trust boundaries, provided security decisions are made before migration.",
    sections: [
      {
        title: "Inventory access as well as applications",
        paragraphs: [
          "A system map should show who and what can access each service. Include service accounts, scheduled jobs, partner connections and administrative tools. Old integrations often carry permissions that no longer match the work they perform.",
          "Identify the sensitive information that crosses each boundary. This gives architecture and security teams a shared starting point for deciding which controls must survive the migration.",
        ],
      },
      {
        title: "Make ownership explicit",
        paragraphs: [
          "Assign owners for identity configuration, secrets, dependency updates and operational alerts. A modern platform can still be difficult to secure when responsibility is split across teams without a clear handoff.",
          "Document the evidence required before a service moves into production. Keep the criteria practical and tied to the service's exposure and business purpose.",
        ],
      },
      {
        title: "Secure the transition period",
        paragraphs: [
          "During coexistence, old and new platforms may exchange data through temporary interfaces. Treat those interfaces as production components with access controls, monitoring and an expiry plan.",
          "Rehearse recovery and credential rotation alongside migration. Confirm how the team would isolate an affected component without losing the ability to restore service.",
        ],
      },
      {
        title: "Close the loop after cutover",
        paragraphs: [
          "Remove obsolete access, rotate migration credentials and verify that retired endpoints are no longer reachable. Update the system inventory and runbooks to reflect the new operating model.",
          "Use subsequent reviews to check whether the intended boundaries are still being maintained. Security work continues as teams add integrations, change data flows and expand usage.",
        ],
      },
    ],
    questions: [
      "Which identities cross the migration boundary?",
      "Who owns temporary integration access?",
      "What confirms the old environment has been retired?",
    ],
    service: "cybersecurity",
  },
};
