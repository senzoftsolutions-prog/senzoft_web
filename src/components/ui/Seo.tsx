import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  absoluteUrl,
  breadcrumbSchema,
  buildBreadcrumbs,
  canonicalPath,
  DEFAULT_SOCIAL_IMAGE_ALT,
  DEFAULT_SOCIAL_IMAGE_HEIGHT,
  DEFAULT_SOCIAL_IMAGE_WIDTH,
  DEFAULT_SOCIAL_IMAGE,
  isNoIndexPath,
  organizationSchema,
  SITE_NAME,
} from "../../seo/seo";

type StructuredData = Record<string, unknown>;

function setMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    element.dataset.seo = "true";
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([name, value]) => element?.setAttribute(name, value));
}

function setLink(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLLinkElement>(selector);
  if (!element) {
    element = document.createElement("link");
    element.dataset.seo = "true";
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([name, value]) => element?.setAttribute(name, value));
}

export function Seo({
  title,
  description,
  canonical,
  image = DEFAULT_SOCIAL_IMAGE,
  type = "website",
  noIndex = false,
  structuredData,
}: {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  structuredData?: StructuredData | StructuredData[];
}) {
  const { pathname } = useLocation();

  useEffect(() => {
    const canonicalUrl = absoluteUrl(canonical ?? canonicalPath(pathname));
    const imageUrl = absoluteUrl(image);
    const robots = noIndex || isNoIndexPath(pathname)
      ? "noindex, nofollow"
      : "index, follow";

    document.title = title;
    setMeta('meta[name="description"]', { name: "description", content: description });
    setMeta('meta[name="robots"]', { name: "robots", content: robots });
    setMeta('meta[name="googlebot"]', { name: "googlebot", content: robots });
    setMeta('meta[property="og:title"]', { property: "og:title", content: title });
    setMeta('meta[property="og:description"]', { property: "og:description", content: description });
    setMeta('meta[property="og:type"]', { property: "og:type", content: type });
    setMeta('meta[property="og:url"]', { property: "og:url", content: canonicalUrl });
    setMeta('meta[property="og:image"]', { property: "og:image", content: imageUrl });
    setMeta('meta[property="og:image:width"]', { property: "og:image:width", content: DEFAULT_SOCIAL_IMAGE_WIDTH });
    setMeta('meta[property="og:image:height"]', { property: "og:image:height", content: DEFAULT_SOCIAL_IMAGE_HEIGHT });
    setMeta('meta[property="og:image:alt"]', { property: "og:image:alt", content: DEFAULT_SOCIAL_IMAGE_ALT });
    setMeta('meta[property="og:site_name"]', { property: "og:site_name", content: SITE_NAME });
    setMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    setMeta('meta[name="twitter:title"]', { name: "twitter:title", content: title });
    setMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });
    setMeta('meta[name="twitter:image"]', { name: "twitter:image", content: imageUrl });
    setMeta('meta[name="twitter:image:alt"]', { name: "twitter:image:alt", content: DEFAULT_SOCIAL_IMAGE_ALT });
    setLink('link[rel="canonical"]', { rel: "canonical", href: canonicalUrl });

    document.head.querySelectorAll('script[data-seo-jsonld="true"]').forEach((node) => node.remove());
    const schemas: StructuredData[] = [organizationSchema()];
    const breadcrumbs = buildBreadcrumbs(canonical ?? pathname);
    if (breadcrumbs.length > 1) schemas.push(breadcrumbSchema(breadcrumbs));
    if (structuredData) schemas.push(...(Array.isArray(structuredData) ? structuredData : [structuredData]));
    schemas.forEach((schema) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.seoJsonld = "true";
      script.textContent = JSON.stringify(schema).replace(/</g, "\\u003c");
      document.head.appendChild(script);
    });

    window.scrollTo({ top: 0, behavior: "instant" });
  }, [canonical, description, image, noIndex, pathname, structuredData, title, type]);
  return null;
}
