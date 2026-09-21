# SENZOFT — PHASE 2 IMPLEMENTATION

## Context

The SENZOFT_ENTERPRISE_WEBSITE_MASTER_SPEC.md is the
overall website masterplan.

Phase 1A = Header / Navigation — COMPLETE
Phase 1B = Content / Routes / Repository — COMPLETE
Phase 1C = Design System / Motion — COMPLETE

This document defines ONLY Phase 2.

---

## Codex Rules

Before modifying anything:

1. Read the masterplan.
2. Audit the current implementation.
3. Preserve Phase 1A, 1B and 1C.
4. Do not redesign unrelated pages.
5. Do not start SEO.
6. Do not invent content.
7. Do not create duplicate repositories.

---

## Phase 2 Scope

### Performance
- Investigate the >500 kB JS warning.
- Audit route-based code splitting.
- Optimize initial bundle.
- Preserve functionality.
- Compare before/after bundle sizes.

### Images
- Audit large images.
- Optimize oversized assets.
- Use WebP/AVIF where appropriate.
- Implement responsive image delivery.
- Use srcset/sizes where appropriate.
- Prevent layout shifts.

### Videos
- Audit all videos.
- Identify large files.
- Compress where appropriate.
- Use posters.
- Defer non-critical video.
- Avoid unnecessary mobile video downloads.
- Provide graceful poster/image fallback.

### Responsive
Verify:
- mobile
- 768px
- 834px
- 1024px
- 1280px
- 1366px
- 1440px
- 1920px

Mobile is the primary target.

Check:
- no horizontal overflow
- no missing content
- no clipped images
- no broken cards
- no oversized typography
- no fixed elements covering content
- no layout shifts

### Animation Performance
Preserve Phase 1C.

Audit:
- Framer Motion
- CSS animation
- ScrollReveal
- IntersectionObserver
- scroll handlers
- background animation
- parallax

Prefer transform/opacity animation.

Do not reintroduce unnecessary continuous animation.

Preserve reduced-motion support.

### Fonts
Audit:
- font sizes
- font weights
- unused variants
- loading behavior

Do not change SENZOFT typography unnecessarily.

### CSS
Audit remaining:
- duplicate rules
- unused rules
- unnecessary overrides

Do not undo Phase 1C cleanup.

### Accessibility
Preserve:
- keyboard navigation
- focus
- alt text
- semantic links/buttons
- reduced motion
- header behavior

---

## Validation

Run:

- lint
- production build
- existing Phase 1A tests
- existing Phase 1B tests
- existing Phase 1C tests
- relevant responsive tests

Check for:
- console errors
- runtime errors
- broken routes
- horizontal overflow
- visual regressions

Measure Core Web Vitals where tooling is available.

Do not claim improvements without measurement.

---

## Completion Report

Report:

1. Audit findings
2. Files changed
3. JS bundle before/after
4. Image optimization
5. Video optimization
6. Responsive improvements
7. Animation-performance changes
8. Font/CSS changes
9. Accessibility verification
10. Tests
11. Build/lint results
12. Remaining issues

STOP.

Do not begin SEO.

# SENZOFT — PHASE 2 APPROVAL
# MEDIA + RESPONSIVE + PERFORMANCE + OPTIMIZATION

Phase 1C is approved.

Proceed with Phase 2 according to the complete SENZOFT master specification.

IMPORTANT:
- Preserve all Phase 1A header fixes.
- Preserve all Phase 1B route/content/source-of-truth fixes.
- Preserve all Phase 1C design-system and motion changes.
- Do not undo existing responsive behavior.
- Do not start SEO yet.
- Do not redesign the website from scratch.
- Do not replace the SENZOFT visual identity.

==================================================
PHASE 2 OBJECTIVE
==================================================

Make the SENZOFT website:

- fast
- responsive
- mobile-first
- visually stable
- media-efficient
- smooth to scroll
- optimized for images
- optimized for videos
- optimized for JavaScript
- optimized for desktop
- optimized for tablet/iPad
- optimized for mobile
- resilient on slower networks/devices

The existing build warning about the main JavaScript chunk exceeding 500 kB MUST be investigated and addressed during this phase.

==================================================
1. AUDIT BEFORE CHANGING CODE
==================================================

Audit:

- JavaScript bundles
- route chunks
- dynamic imports
- images
- videos
- fonts
- third-party dependencies
- Framer Motion usage
- CSS size
- animation workload
- layout shifts
- lazy loading
- preload usage
- network loading
- mobile rendering
- tablet rendering
- desktop rendering

Identify the largest contributors to:

- initial JavaScript
- initial images
- initial videos
- CSS
- fonts

Do not optimize blindly.

Provide the audit findings before implementation.

==================================================
2. JAVASCRIPT BUNDLE OPTIMIZATION
==================================================

The current production build reports that the main JavaScript chunk exceeds 500 kB.

Investigate why.

Use appropriate:

- route-based code splitting
- lazy loading
- dynamic imports
- dependency optimization
- tree shaking
- component-level loading

Prioritize keeping the initial homepage bundle small.

Do not lazy-load content that is immediately required for the first viewport if doing so harms UX.

Do not remove required functionality simply to reduce bundle size.

After changes, compare bundle sizes with the previous build.

==================================================
3. ROUTE CODE SPLITTING
==================================================

Verify major page families are split appropriately:

- Services
- Industries
- Technologies
- Solutions
- Case Studies
- Insights
- Careers
- Contact
- Search
- Legal

Do not load every page family into the initial bundle.

Reuse the existing React/Vite architecture.

Avoid unnecessary duplicate chunks.

==================================================
4. IMAGE OPTIMIZATION
==================================================

Audit every major website image.

Identify:

- very large files
- duplicate assets
- unused assets
- oversized desktop images
- images used only on mobile
- images used only as backgrounds
- hero images
- card images
- decorative images

The previous audit found images above approximately 5 MB.

Optimize appropriate assets using:

- AVIF
- WebP
- responsive sizes
- srcset
- sizes

Do not destroy visual quality.

Do not replace important SENZOFT imagery with generic stock imagery.

==================================================
5. RESPONSIVE IMAGE DELIVERY
==================================================

Do not serve a large desktop image to mobile unnecessarily.

For important responsive images:

- provide appropriate source sizes
- use srcset
- use sizes
- reserve dimensions
- prevent layout shifts

Verify actual browser behavior at:

- mobile
- tablet
- laptop
- desktop
- ultra-wide

==================================================
6. HERO MEDIA
==================================================

Audit all hero images and videos.

Hero media must prioritize:

1. visual quality
2. fast first render
3. stable layout
4. mobile performance

If a hero video is heavy:

- use an optimized poster
- defer unnecessary playback
- compress video
- use a shorter loop where appropriate
- avoid unnecessary mobile downloads

Do not automatically remove hero video.

==================================================
7. VIDEO OPTIMIZATION
==================================================

The media audit previously found videos up to approximately 22.6 MB.

Audit every video.

For each video determine:

- file size
- duration
- format
- resolution
- where it appears
- whether it is above/below the fold
- whether mobile needs the video
- whether a poster can be used
- whether it can be compressed

Hero/background videos should generally use:

- muted
- autoplay where appropriate
- loop
- playsInline
- poster
- deferred loading where possible

Avoid unnecessary video downloads on mobile.

==================================================
8. MOBILE-FIRST PERFORMANCE
==================================================

Mobile is the primary optimization target.

Test at realistic phone widths.

Verify:

- no horizontal overflow
- no clipped content
- no missing images
- no broken cards
- no oversized headings
- no desktop-only layout leaking into mobile
- no animation blocking content
- no excessive padding
- no viewport-height problems
- no sticky/fixed elements covering content

Do not simply shrink the desktop layout.

Mobile should be deliberately designed.

==================================================
9. TABLET / IPAD
==================================================

Test compact/tablet layouts.

At minimum verify representative widths around:

- 768px
- 834px
- 1024px

Check:

- navigation
- cards
- grids
- images
- videos
- typography
- section spacing
- sticky elements
- overlays
- horizontal scrolling

Avoid treating tablet as either desktop or mobile without testing.

==================================================
10. DESKTOP
==================================================

Verify:

- 1280px
- 1366px
- 1440px
- 1920px

Check:

- content width
- hero composition
- card grids
- navigation
- background media
- section transitions
- whitespace
- animations

Preserve the completed header behavior.

==================================================
11. LAYOUT STABILITY
==================================================

Minimize CLS.

Ensure images and videos reserve their dimensions before loading.

Avoid:

- sudden image expansion
- content jumping after fonts load
- layout changes caused by animation
- late-loading controls moving content
- video dimensions changing after playback begins

==================================================
12. FONT OPTIMIZATION
==================================================

Audit fonts.

Check:

- font file sizes
- number of font weights
- unused weights
- loading behavior
- fallback behavior

Do not load unnecessary font variants.

Avoid FOIT where practical.

Preserve SENZOFT typography.

==================================================
13. ANIMATION PERFORMANCE
==================================================

Phase 1C established the animation system.

Now optimize its runtime performance.

Prefer animations using:

- transform
- opacity

Avoid expensive continuous animations on large areas.

Audit:

- scroll listeners
- Framer Motion
- CSS animations
- IntersectionObserver
- background animation
- video animation
- parallax

Do not reintroduce the continuous effects removed in Phase 1C unless there is a clear performance-safe reason.

==================================================
14. SCROLL PERFORMANCE
==================================================

Scrolling must remain smooth.

Audit:

- scroll handlers
- passive listeners
- observers
- expensive calculations
- DOM measurements
- forced synchronous layout

Avoid executing heavy JavaScript on every scroll event.

==================================================
15. REDUCED MOTION
==================================================

Preserve the reduced-motion implementation from Phase 1C.

Users requesting reduced motion must still receive:

- all important content
- all navigation
- all functionality

Only decorative movement should be reduced or removed.

==================================================
16. LAZY LOADING
==================================================

Use lazy loading intelligently.

Lazy-load:

- below-the-fold images
- below-the-fold video
- heavy page components
- non-critical assets

Do not lazy-load critical hero content unnecessarily.

Do not create a loading experience where users see blank sections for excessive periods.

==================================================
17. MEDIA LOADING EXPERIENCE
==================================================

Media should degrade gracefully.

Preferred sequence:

Content/container
→ poster/placeholder
→ media loading
→ final media

Never allow media failure to remove important content.

If video fails:

show the poster/image.

If an image fails:

maintain layout and useful alt/accessibility behavior.

==================================================
18. BACKGROUND MEDIA
==================================================

Audit animated backgrounds.

For every background effect ask:

- Is it necessary?
- Is it visible on mobile?
- Does it consume CPU/GPU?
- Does it affect scrolling?
- Does it affect LCP?
- Does it affect battery usage?

Keep only meaningful visual effects.

Do not add background effects simply because other MNC websites use them.

==================================================
19. CSS OPTIMIZATION
==================================================

Phase 1C already consolidated much of the CSS.

Now identify:

- unused CSS
- duplicated rules
- unnecessary overrides
- large generated styles
- page-specific rules that can be isolated

Do not repeat the previous CSS cleanup.

Do not break existing responsive behavior.

==================================================
20. THIRD-PARTY CODE
==================================================

Audit third-party dependencies and scripts.

Identify:

- heavy libraries
- unused dependencies
- duplicate functionality
- unnecessary client-side packages

Do not remove anything required by the website.

Report what can safely be removed or deferred.

==================================================
21. LOADING PRIORITY
==================================================

Establish sensible loading priorities.

Critical:

- page shell
- header
- hero content
- primary typography
- critical hero image/poster

Deferred:

- below-fold media
- secondary animations
- non-critical components
- secondary videos
- non-essential effects

==================================================
22. ERROR RESILIENCE
==================================================

Verify that:

- missing images do not break layout
- failed video does not break layout
- lazy-loaded components fail gracefully
- invalid routes still show fallback
- navigation remains functional

Do not hide errors silently.

==================================================
23. ACCESSIBILITY DURING OPTIMIZATION
==================================================

Performance optimization must not break:

- keyboard navigation
- focus states
- screen-reader content
- alt text
- buttons
- links
- menus
- reduced motion

Preserve the Phase 1A header keyboard behavior.

==================================================
24. PERFORMANCE TESTING
==================================================

Run production builds.

Compare:

Before Phase 2
vs
After Phase 2

Record:

- main JS size
- total JS size
- CSS size
- largest images
- largest videos
- route chunk sizes

Where tooling permits, measure:

- LCP
- CLS
- INP

Do not claim a Core Web Vitals improvement without measurement.

==================================================
25. BROWSER TESTING
==================================================

Run representative browser tests for:

Desktop:
1280
1366
1440
1920

Tablet:
768
834
1024

Mobile:
representative phone widths

Verify:

- header
- navigation
- hero
- cards
- images
- video
- scrolling
- animations
- responsive layout
- no horizontal overflow

==================================================
26. REGRESSION TESTING
==================================================

All previous tests must continue passing:

Phase 1A header tests
Phase 1B route/content tests
Phase 1C motion/responsive tests

Do not consider Phase 2 complete if previous functionality regresses.

==================================================
27. BUILD REQUIREMENTS
==================================================

Production build must pass.

Lint must pass.

No new:

- TypeScript errors
- runtime errors
- console errors
- broken routes

The >500 kB warning must be investigated.

If it cannot be completely eliminated without harmful architectural changes, report:

- why it remains
- current size
- what causes it
- what further optimization would require

Do not artificially split code merely to hide the warning.

==================================================
28. FINAL PHASE 2 CHECKLIST
==================================================

[ ] JavaScript bundle audited
[ ] Route code splitting audited
[ ] Main bundle optimized
[ ] Images audited
[ ] Large images optimized
[ ] Responsive images implemented
[ ] Videos audited
[ ] Large videos optimized
[ ] Hero media optimized
[ ] Mobile media strategy verified
[ ] Tablet layout verified
[ ] Desktop layout verified
[ ] CLS investigated
[ ] Fonts audited
[ ] Animation runtime audited
[ ] Scroll performance audited
[ ] Reduced motion preserved
[ ] Lazy loading verified
[ ] Background media audited
[ ] CSS audited
[ ] Third-party dependencies audited
[ ] Accessibility preserved
[ ] Previous phase tests pass
[ ] Production build passes
[ ] Lint passes
[ ] No new console/runtime errors

==================================================
29. HARD RULES
==================================================

Do not:

- redesign the entire site
- change SENZOFT branding
- replace approved visual direction
- add random stock images
- add random videos
- add unnecessary animations
- remove important content
- remove functionality to improve metrics
- sacrifice mobile UX for desktop
- sacrifice accessibility
- introduce duplicate repositories
- modify the completed header interaction
- modify Phase 1B route relationships without necessity
- start SEO implementation

==================================================
30. FINAL REPORT
==================================================

After completing Phase 2 report:

1. Performance audit findings
2. Files changed
3. JavaScript optimization
4. Bundle-size comparison
5. Image optimization
6. Video optimization
7. Responsive improvements
8. Mobile improvements
9. Tablet improvements
10. Desktop improvements 
11. Animation-performance changes
12. Loading strategy
13. Font optimization
14. CSS optimization
15. Third-party dependency findings
16. Core Web Vitals measurements if available
17. Tests performed
18. Build/lint results
19. Remaining performance issues
20. Items requiring further investigation

STOP after Phase 2.

Do not start SEO until Phase 2 is reviewed and approved.