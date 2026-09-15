# SENZOFT content-flow audit

## Audit result

The site now uses the repository as its canonical source for the nine SENZOFT service families and sixteen industries. The former page-level lists that implied unrelated offerings such as Aerospace and Defense, Chemicals, Private Equity and Natural Resources have been removed.

## Relationship integrity

| Entity | Canonical outbound relationships | UI destination |
|---|---|---|
| Industry | challenges, services, solutions, technologies, reference engagements, insights | Industry detail sections |
| Service | capabilities, solutions, technologies, industries, reference engagements, insights | Service detail sections |
| Solution | primary service, technologies, industries, reference engagements, insights | Solution detail sections |
| Technology | services, solutions, industries, reference engagements, insights | Technology detail sections |
| Reference engagement | industry, services, solutions, technologies, insights | Case-study detail sections |
| Insight | service, solutions, technologies, reference engagements | Insight detail sections |

All relationship targets are checked by automated tests. Invalid historical aliases such as `retail-ecommerce` and `manufacturing` were normalized to the canonical `retail-consumer` and `manufacturing-logistics` routes.

## Verified journey

The automated repository journey starts with Banking & Financial Services and verifies that a visitor can resolve a related service, its solution, a supporting technology, an industry reference engagement, and a related insight. Every page then exposes the global contact CTA.

```text
Business problem
  → Industry
  → Service
  → Solution
  → Technology
  → Reference engagement
  → Insight
  → Contact
```

## Trust review

Reference engagements remain clearly labelled and do not present invented clients, percentages or testimonials. Development-style bracket placeholders were removed from the public case-study template and replaced with a reader-facing evidence-status explanation.

## Validation

- Canonical relationship test: pass
- Complete discovery-journey test: pass
- Production TypeScript/Vite build: pass
- Whitespace validation: pass
