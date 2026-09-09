# SENZOFT Corporate Website

Frontend for SENZOFT Software Solutions Private Limited, built with React 19, TypeScript, Vite, Tailwind CSS 4, React Router 7, Axios, Lucide, Framer Motion, and Sonner.

## Setup

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` for local configuration. Contact, career interest and talent-network forms use Netlify Forms; there is no simulated success adapter.

## Quality commands

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Content and API architecture

Launch content lives in typed modules under `src/content`. UI components query `contentRepository`, which creates a replaceable boundary for a future CMS. Forms use typed functions in `src/services/api.ts` to POST URL-encoded data. Static declarations in `index.html` allow Netlify to discover the three forms.

Career discipline pages accept expressions of interest and are not advertised vacancies. Never add unverified clients, statistics, awards, certifications, leadership identities, vacancies, or addresses.

## Git workflow

- `main`: protected production branch
- `development`: shared preview/integration branch
- `feature/*`: short-lived work branches merged into `development` by pull request
- Use Conventional Commits such as `feat: add industry detail page`.
- Require lint, typecheck, tests, and build checks before merging.

## Deployment

Vercel and Netlify SPA route rewrites are included. Set `VITE_SITE_URL` in the deployment environment. Enable form detection under Forms in Netlify, redeploy, and verify a real submission in the Netlify dashboard. Configure notifications there for the company recipient. Live receipt is not verified by local browser tests. A different hosting provider needs a real form endpoint. Preview `development`; deploy production from `main`.

## Brand asset

`src/assets/senzoft-logo.png` is the transparent full lockup and `src/assets/senzoft-symbol.png` is the square symbol/favion. Both were derived from the approved logo with the built-in image-generation tool; the prompts preserved its geometry, wording, circuit details, colors, and proportions while removing the background.

## Video and editorial content

Each clip has one site-wide placement: `digital` on Home, `collaboration` on About, and `workplace` on Careers. Do not reuse these clips or their posters on other pages. Service and industry heroes use text layouts. Preserve this unique placement when replacing an asset through the importer.

Three commercially licensed Mixkit clips and their extracted posters are bundled in `public/media`; source records are in `public/media/LICENSES.md`. Playback is lazy, pauses offscreen or in a hidden tab, and respects reduced motion and data saver. Videos play one short introduction (up to 4.5 seconds) and stop. Mobile uses the poster. There are no playback buttons. Stock imagery is illustrative.

Optional Pexels imports run locally, outside the browser. Obtain your own free key at https://www.pexels.com/api/ and set `PEXELS_API_KEY` in your process environment. Never use a `VITE_` prefix or commit the key. No key is needed for the bundled videos.

```bash
npm run media:import -- --search "team collaboration"
npm run media:import -- --id VIDEO_ID --slot collaboration
```

Review search results and select a landscape clip. Import downloads a web-sized MP4 and poster, then updates `src/content/imported-media.json`. Supported slots: `digital`, `workplace`, `collaboration`. Creator and source links render automatically. The importer caps downloads at 25 MB per video; choose short clips. Review the result and license before publication. API requests use the account quota only during import; site visitors use local assets. API integration requires a real account key and has not been exercised with credentials in this workspace.

Sector-specific content lives in `industryProfiles.ts`, service deliverables in `serviceDeliverables.ts`, and specific solution offerings in `solutions.ts`. Insights is removed from navigation, search and published routes; legacy URLs redirect to Services. Leadership identities, case-study results and vacancies still require verified company information; no client evidence has been invented.

## Studio interaction system

The home page uses original code-based interface illustrations, solution graphics and service illustrations. `SystemCanvas` switches between engineering models, `CapabilityExplorer` exposes all nine services and their deliverables, and `DeliveryJourney` walks through the four delivery stages. The same explorer is available on Services, and the journey is available on About.

Native smooth anchor scrolling and progressive section reveals support browsing without intercepting wheel or touch input. Device reduced-motion preferences disable reveals and autoplay. Decorative video intros finish automatically; playback controls have been removed. The three stock videos retain their one-page-only placements.

## Page structure

Primary navigation: About Us, Services, Industries, Careers, Contact Us. Fourteen specific solution pages sit beneath nine service categories. Career pathways and discipline pages provide further detail, and all offering cards link to those pages. Success measures describe what to agree for an engagement, not invented client results.
