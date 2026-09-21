export const SITE_URL = "https://www.senzoft.com";
export const SITE_NAME = "SENZOFT";
export const DEFAULT_SOCIAL_IMAGE = "/media/senzoft-full-lockup-transparent.png";
export const DEFAULT_SOCIAL_IMAGE_WIDTH = "2172";
export const DEFAULT_SOCIAL_IMAGE_HEIGHT = "724";
export const DEFAULT_SOCIAL_IMAGE_ALT = "SENZOFT — Ideas to Impact";

const privateRoutePatterns = [
  /^\/login(?:\/|$)/,
  /^\/register(?:\/|$)/,
  /^\/account(?:\/|$)/,
  /^\/profile(?:\/|$)/,
  /^\/applications(?:\/|$)/,
  /^\/interviews(?:\/|$)/,
  /^\/documents(?:\/|$)/,
  /^\/admin(?:\/|$)/,
  /^\/careers\/apply(?:\/|$)/,
  /^\/careers\/openings\/[^/]+$/,
];

export type BreadcrumbItem = {
  name: string;
  path: string;
};

const routeLabels: Record<string, string> = {
  services: "Services",
  industries: "Industries",
  insights: "Insights",
  technology: "Technology",
  solutions: "Solutions",
  "case-studies": "Case Studies",
  about: "About",
  careers: "Careers",
  openings: "Openings",
  apply: "Apply",
  pathways: "Career Pathways",
  "life-at-senzoft": "Life at SENZOFT",
  benefits: "Benefits",
  contact: "Contact",
  search: "Search",
  "privacy-policy": "Privacy Policy",
  "terms-of-use": "Terms of Use",
  accessibility: "Accessibility",
};

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path === "/" ? "/" : `/${path.replace(/^\/+|\/+$/g, "")}`;
  return `${SITE_URL}${normalized}`;
}

export function canonicalPath(pathname: string) {
  const clean = pathname.split(/[?#]/, 1)[0].replace(/\/+$/g, "");
  return clean || "/";
}

export function isNoIndexPath(pathname: string) {
  const path = canonicalPath(pathname).toLowerCase();
  return path === "/search" || privateRoutePatterns.some((pattern) => pattern.test(path));
}

export function titleFromSlug(slug: string) {
  return routeLabels[slug] ?? slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function buildBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const parts = canonicalPath(pathname).split("/").filter(Boolean);
  const items: BreadcrumbItem[] = [{ name: "Home", path: "/" }];

  parts.forEach((part, index) => {
    items.push({
      name: titleFromSlug(part),
      path: `/${parts.slice(0, index + 1).join("/")}`,
    });
  });

  return items;
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl(DEFAULT_SOCIAL_IMAGE),
  };
}
