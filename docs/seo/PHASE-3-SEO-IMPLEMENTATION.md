# SENZOFT Phase 3 SEO implementation

## Architecture

SENZOFT is a Vite React single-page application using React Router. `Seo.tsx` is the single browser metadata boundary. Page components provide their existing title, description, canonical override, content type, and optional structured data. `src/seo/seo.ts` owns production-domain URL normalization, breadcrumb construction, private-route exclusions, and shared schema constants.

## Metadata and canonical strategy

Every rendered route receives a title, description, robots directive, canonical link, Open Graph metadata, and Twitter metadata. Canonicals always use `https://www.senzoft.com`, omit query strings, fragments, and trailing slashes, and use repository-defined solution URLs where aliases exist. React Router redirects legacy aliases to their canonical routes.

The initial `index.html` contains safe homepage fallback metadata. This is not equivalent to route-specific server rendering.

## Robots strategy

Published routes default to `index, follow`. Search, errors, illustrative job details, career application paths, and future account, candidate, interview, document, and admin paths are `noindex, nofollow`. Private path families are also excluded in `robots.txt`; robots rules are not treated as access control.

## Sitemap

`scripts/generate-sitemap.mjs` derives URLs from the existing services, industries, solutions, insights, technologies, and case-study repositories. `npm run build` regenerates `public/sitemap.xml`. Utility, private, application, error, and illustrative job-detail URLs are excluded. Tests enforce production-domain URLs, uniqueness, valid URL shape, expected repository coverage, and exclusions.

## Structured data

- `Organization` uses only the SENZOFT name, production URL, and existing logo.
- `BreadcrumbList` mirrors the visible breadcrumb hierarchy.
- `Article` is emitted for published insights using repository titles, descriptions, and publication dates.

No ratings, reviews, clients, awards, social profiles, statistics, or unverified claims are emitted.

## Breadcrumbs and internal links

Visible breadcrumbs and JSON-LD use the same helper. Existing contextual links connect services, industries, solutions, technologies, insights, case studies, and careers without duplicate content or placeholder navigation.

## Social metadata

The existing SENZOFT lockup is the safe default preview asset. Absolute production URLs, verified intrinsic dimensions (2172 × 724), and descriptive image alt metadata are supplied. A purpose-designed 1200 × 630 social card remains a production artwork TODO; no synthetic service-specific artwork is used.

## Testing

Vitest covers canonical normalization, route exclusions, breadcrumbs, sitemap coverage, XML boundaries, URL shape, duplicates, and prohibited routes. Playwright covers browser-DOM metadata, canonicals, robots directives, social metadata, Article/Breadcrumb JSON-LD, and visible/structured breadcrumb alignment. E2E tests require a fresh production build before preview.

## Raw HTML and browser DOM status

- Raw HTML SEO: **LIMITED**. The raw SPA response contains homepage fallback metadata on every route.
- Browser DOM SEO: **PASS** for implemented public and excluded-route behavior when JavaScript executes.

Static prerendering was not added because the current metadata is applied in React effects and the pages include media/runtime behavior. Browser-capturing all 152 routes would make production builds depend on installed browser binaries and fragile runtime completion; separately reimplementing route metadata in a generator would create a duplicate SEO system. A future architecture should move route metadata into a shared serializable route manifest consumed by both React and a supported SSR/static-rendering entry, or adopt Vite-compatible SSR/SSG as a dedicated migration.

## Performance and accessibility

No SEO framework was added. Existing route lazy loading and vendor chunking remain intact. Breadcrumb navigation keeps its accessible label and semantic list. No hidden SEO text or keyword-stuffed content is present.

## Phase 4 readiness

The path-based robots guard already covers future account, profile, application, interview, document, and admin route families. This is SEO preparation only, not authentication or authorization. Phase 4 must enforce privacy on the server and must not rely on robots metadata for protection.
