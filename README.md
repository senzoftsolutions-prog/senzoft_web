# SENZOFT Corporate Website

Frontend for SENZOFT Software Solutions Private Limited, built with React 19, TypeScript, Vite, Tailwind CSS 4, React Router 7, Axios, Lucide, Framer Motion, and Sonner.

## Setup

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` for local configuration. `VITE_USE_MOCK_API=true` keeps contact and career submissions on the mock adapter.

## Quality commands

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Content and API architecture

Launch content lives in typed modules under `src/content`. UI components query `contentRepository`, which creates a replaceable boundary for a future CMS. Forms use typed functions in `src/services/api.ts`; replace their mock implementations with Axios requests when endpoints are available.

Entries marked `draft` are visibly labeled Preview and must be approved before launch. Never add unverified clients, statistics, awards, certifications, leadership identities, vacancies, or addresses.

## Git workflow

- `main`: protected production branch
- `development`: shared preview/integration branch
- `feature/*`: short-lived work branches merged into `development` by pull request
- Use Conventional Commits such as `feat: add industry detail page`.
- Require lint, typecheck, tests, and build checks before merging.

## Deployment

Vercel and Netlify SPA route rewrites are included. Set `VITE_SITE_URL` and `VITE_API_BASE_URL` in the deployment environment. Preview `development`; deploy production from `main`.

## Brand asset

`src/assets/senzoft-logo.png` is the transparent full lockup and `src/assets/senzoft-symbol.png` is the square symbol/favion. Both were derived from the approved logo with the built-in image-generation tool; the prompts preserved its geometry, wording, circuit details, colors, and proportions while removing the background.
