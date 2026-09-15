import type { Industry } from "../types";

const records: Array<[string, string, string, string[], string[]]> = [
  ["logistics-transportation", "Logistics & Transportation", "Connect shipment, fleet, warehouse and customer information into usable operational platforms.", ["Shipment visibility", "Exception management", "Integration bottlenecks"], ["Fleet workflows", "Customer portals", "Route intelligence"]],
  ["insurance", "Insurance", "Modernize policy, claims, customer and operational workflows while improving digital experiences.", ["Claims complexity", "Manual processes", "Fragmented customer journeys"], ["Claims workflow", "Customer portals", "Analytics"]],
  ["automotive", "Automotive", "Connect customer, product, manufacturing and service experiences through modern digital platforms.", ["Disconnected dealer systems", "Supply visibility", "Service experience gaps"], ["Dealer platforms", "Connected services", "Operational analytics"]],
  ["travel-hospitality", "Travel & Hospitality", "Improve booking, service and operational journeys across customer and employee touchpoints.", ["Demand volatility", "Fragmented guest journeys", "Legacy reservation systems"], ["Booking experiences", "Loyalty platforms", "Operations analytics"]],
  ["energy-utilities", "Energy & Utilities", "Use modern data, applications and workflows to support operational visibility and customer services.", ["Asset data silos", "Field workflow friction", "Legacy platforms"], ["Field applications", "Customer portals", "Asset analytics"]],
  ["professional-services", "Professional Services", "Improve client, project, knowledge and internal operations through connected technology.", ["Knowledge fragmentation", "Manual project workflows", "Limited operational insight"], ["Client portals", "Knowledge platforms", "Workflow automation"]],
  ["real-estate", "Real Estate", "Create digital property, tenant, transaction and operational experiences.", ["Manual tenant journeys", "Disconnected property data", "Integration complexity"], ["Tenant portals", "Property platforms", "Mobile workflows"]],
  ["life-sciences", "Life Sciences", "Modernize data, applications and research workflows while keeping security and governance central.", ["Research data fragmentation", "Quality requirements", "Difficult integration"], ["Research workflows", "Data platforms", "Secure integration"]],
];

export const expandedIndustries: Industry[] = records.map(([slug, title, summary, challenges, solutions], index) => ({
  id: `ind-${index + 9}`, slug, title, summary, challenges, solutions,
  status: "published", icon: "Building2",
  seo: { title: `${title} | SENZOFT`, description: `SENZOFT technology services for ${title.toLowerCase()}.` },
}));
