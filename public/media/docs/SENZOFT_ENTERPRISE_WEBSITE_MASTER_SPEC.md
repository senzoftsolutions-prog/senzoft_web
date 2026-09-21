# SENZOFT ENTERPRISE WEBSITE
# MASTER UI/UX + NAVIGATION + ANIMATION + VIDEO + RESPONSIVE + PERFORMANCE SPECIFICATION

Version: 1.0
Project: SENZOFT IT / Software Services Website
Implementation Target: Existing SENZOFT website
Primary Goal: Enterprise-grade MNC-quality digital experience

---

# 00. IMPORTANT — READ THIS FIRST

This document is the MASTER implementation specification for the SENZOFT website.

The objective is NOT to copy HCLTech, Infosys, TCS, Wipro, Accenture, Cognizant or any other company.

Use leading MNC websites only as UX/design-quality references.

Study and reproduce the underlying principles:

- enterprise information architecture
- navigation quality
- mega-menu behavior
- visual hierarchy
- content depth
- section navigation
- interaction design
- animation discipline
- video usage
- responsive behavior
- mobile UX
- performance optimization
- accessibility

The final website MUST remain uniquely SENZOFT.

Do not copy:

- logos
- colors
- typography
- wording
- images
- videos
- illustrations
- exact layouts
- exact animations
- source code
- distinctive visual identity

Use SENZOFT branding and SENZOFT content.

---

# 01. PRIMARY OBJECTIVE

Transform the current SENZOFT website into a:

- premium
- modern
- enterprise-grade
- mobile-first
- content-rich
- visually engaging
- technically optimized
- responsive
- accessible
- SEO-friendly

IT/software services website.

The website should communicate that SENZOFT provides software and technology solutions across multiple industries.

The website should feel like one connected digital ecosystem rather than a collection of unrelated pages.

---

# 02. CORE EXPERIENCE MODEL

The complete experience should follow:

USER
  ↓
DISCOVER
  ↓
UNDERSTAND
  ↓
EXPLORE
  ↓
COMPARE
  ↓
TRUST
  ↓
CONTACT

Example:

Service
  ↓
Service capabilities
  ↓
Technology
  ↓
Industry
  ↓
Case study
  ↓
Insight
  ↓
Contact SENZOFT

Everything should be interconnected.

---

# 03. DEVELOPMENT RULE — AUDIT FIRST

DO NOT immediately rewrite the website.

Before modifying code:

1. Inspect the entire project structure.
2. Identify the frontend framework.
3. Identify routing.
4. Identify existing components.
5. Identify design tokens.
6. Identify existing CSS/Tailwind/styling architecture.
7. Identify animation libraries.
8. Identify image/video handling.
9. Identify service data.
10. Identify industry data.
11. Identify technology data.
12. Identify case-study data.
13. Identify insights/blog data.
14. Identify all existing routes.
15. Identify duplicate components.
16. Identify dead links.
17. Identify missing detail pages.
18. Identify responsive breakpoints.
19. Identify current header implementation.
20. Identify current mobile navigation.
21. Identify current footer.

Do not create duplicate infrastructure when an existing solution can be extended.

---

# 04. BEFORE IMPLEMENTATION — REPORT

Before making major changes, produce an internal implementation plan containing:

- existing architecture
- current problems
- files/components involved
- data architecture
- route architecture
- animation architecture
- media architecture
- responsive architecture
- performance problems
- proposed reusable components
- proposed implementation order

Do not blindly replace existing working functionality.

Preserve existing functionality unless it conflicts with this specification.

---

# 05. SENZOFT BRANDING

Preserve SENZOFT identity.

Use the existing SENZOFT:

- logo
- orange accent
- dark/navy colors
- typography
- brand elements

Do not introduce HCLTech-style branding.

The design language should feel:

- technological
- premium
- enterprise
- confident
- modern
- clean
- sophisticated
- human

Avoid:

- cheap gradients
- random stock images
- unrelated AI-generated images
- excessive glassmorphism
- excessive rounded cards
- generic SaaS layouts
- excessive empty space
- random decorative animations

---

# 06. GLOBAL VISUAL RHYTHM

Do not make every page entirely white.

Use controlled background variation.

Preferred SENZOFT rhythm:

WHITE
Hero

↓

DARK NAVY
Technology / Capabilities

↓

WHITE
Services

↓

LIGHT GRAY / COOL TINT
Process / Case Studies

↓

DARK NAVY
Why SENZOFT

↓

DARK + VISUAL
CTA

↓

WHITE
Contact

↓

DARK NAVY
Footer

This is a design system, not a mandatory identical layout for every page.

Choose section backgrounds based on content.

---

# 07. PRIMARY NAVIGATION

Current primary navigation should remain conceptually:

Services
Industries
Technology
Case Studies
Insights
About
Careers
Contact
Search

Use the existing routes where available.

Every navigation item must lead to a valid destination or open a valid navigation interface.

Never use:

href="#"

for production navigation unless intentionally used for an in-page anchor.

---

# 08. HEADER — HIGHEST PRIORITY

The current SENZOFT header hover behavior must be fixed.

The header should feel stable and premium.

The key problem to solve:

- hover flickering
- dropdown closing while moving cursor
- unstable menu transitions
- accidental menu switching
- poor interaction zone
- inconsistent animation

---

# 09. HEADER STATE ARCHITECTURE

Use one active navigation state.

Example:

activeMenu:

null
or
services
or
industries
or
technology
or
caseStudies
or
insights

Do not maintain multiple independent menu-open states.

BAD:

isServicesOpen
isIndustriesOpen
isTechnologyOpen
isCaseStudiesOpen

GOOD:

activeMenu

Only one menu may be active at any time.

---

# 10. HEADER HOVER BEHAVIOR

Desired behavior:

USER HOVERS NAV ITEM
        ↓
Intent detected
        ↓
Small opening delay
        ↓
Mega menu opens
        ↓
USER MOVES INTO MEGA MENU
        ↓
Mega menu remains open
        ↓
USER MOVES TO ANOTHER NAV ITEM
        ↓
Previous menu transitions to new menu
        ↓
NO BLANK STATE
        ↓
USER LEAVES HEADER AREA
        ↓
Small close delay
        ↓
Menu closes

---

# 11. HEADER TIMING

Use these as initial values:

Open intent:
60–120ms

Open animation:
220–320ms

Close delay:
150–250ms

Close animation:
150–220ms

Tune after testing.

The interaction must feel:

FAST
but
NOT JUMPY

---

# 12. HEADER POINTER INTERACTION

Treat the navigation trigger and mega-menu as one interaction region.

The cursor should be able to travel:

NAV ITEM
↓
MEGA MENU

without accidentally closing the menu.

Avoid gaps that cause mouseleave.

If a visual gap is required, use an invisible interaction bridge/padding area rather than allowing the menu to close.

---

# 13. HEADER MENU SWITCHING

When moving:

Services
→
Technology

do not:

close Services
→
blank
→
open Technology

Instead:

Services
→
smooth transition
→
Technology

Keep the mega-menu shell mounted when practical.

Change the active content/state.

---

# 14. HEADER MEGA MENU

Do not use a basic dropdown list.

Use an enterprise navigation structure.

Example:

SERVICES

Short introduction

Software Development
Cloud & DevOps
Data & AI
UI/UX
Enterprise Solutions
QA & Testing

View all services →

Each item should have:

- title
- short description where useful
- clear hierarchy
- active state
- destination
- optional visual

Do not overload the menu.

---

# 15. HEADER ANIMATION

Opening:

- opacity
- slight translate
- subtle scale if appropriate

Avoid:

- large bouncing
- dramatic zoom
- excessive blur
- slow animation

Menu animation should never interfere with navigation.

---

# 16. HEADER SCROLL BEHAVIOR

At page top:

- clean floating appearance
- minimal shadow

During scroll:

- slightly stronger surface
- subtle shadow
- stable height

Do not constantly resize the header.

Do not create layout shifts.

---

# 17. HEADER KEYBOARD ACCESSIBILITY

Support:

TAB
↓
navigation

ENTER / SPACE
↓
activate

ESCAPE
↓
close mega menu

Focus should remain logical.

Hover must never be the only way to access navigation.

---

# 18. MOBILE HEADER

Mobile must NOT depend on hover.

Use:

SENZOFT LOGO
+
MENU BUTTON

Menu opens as a dedicated mobile navigation interface.

Example:

Services >
Industries >
Technology >
Case Studies >
Insights >
About >
Careers >
Contact

Tap category:

Services
↓
submenu

Use accordion or nested navigation.

---

# 19. MOBILE NAVIGATION REQUIREMENTS

Mobile menu must:

- be touch friendly
- have large tap targets
- support back navigation
- support close
- prevent body scrolling while appropriate
- restore body scrolling when closed
- preserve focus
- avoid accidental taps
- animate smoothly

Do not simply shrink the desktop mega menu.

---

# 20. MOBILE-FIRST RULE

THIS IS CRITICAL.

Mobile is NOT:

desktop
scaled down.

Design mobile intentionally.

Desktop may use:

- multi-column layouts
- horizontal journeys
- large imagery
- complex navigation

Mobile should use:

- stacked layouts
- accordion
- vertical timelines
- horizontal scrolling tabs where appropriate
- simplified animation
- optimized media

---

# 21. HERO SYSTEM

Every major page needs a strong hero.

Recommended:

Eyebrow
↓
H1
↓
Supporting text
↓
Primary CTA
↓
Secondary CTA where needed
↓
Image/video/visual

Hero must immediately explain:

WHAT IS THIS PAGE?

WHY DOES IT MATTER?

WHAT CAN THE USER DO NEXT?

---

# 22. HERO VIDEO

Use short cinematic video loops when they improve the experience.

Recommended:

6–15 seconds

Properties:

autoplay
muted
loop
playsInline

Use:

poster fallback

Do not use long videos as decorative hero content.

---

# 23. VIDEO CONTENT DIRECTION

SENZOFT videos should communicate technology.

Possible themes:

- software architecture
- cloud infrastructure
- digital systems
- data flows
- AI visualization
- connected applications
- enterprise technology
- product engineering
- digital transformation
- technology collaboration

Avoid unrelated corporate stock footage.

---

# 24. DESKTOP VS MOBILE VIDEO

Desktop:

- wider composition
- higher resolution
- cinematic movement

Mobile:

- lighter file
- mobile-safe crop
- simplified composition
- reduced motion

If video harms mobile performance:

USE POSTER IMAGE.

Do not force video on mobile.

---

# 25. VIDEO PERFORMANCE

Non-critical videos:

preload="metadata"

Hero videos:

load carefully.

Do not load every video on initial page load.

Below-the-fold video should be deferred.

Use compressed video files.

---

# 26. IMAGE SYSTEM

Use meaningful images.

Images must be related to:

- technology
- software
- industries
- people
- digital products
- enterprise systems

Avoid random stock imagery.

Use responsive images.

Where appropriate:

AVIF
or
WebP

Use:

srcset
sizes
width
height
aspect-ratio

---

# 27. IMAGE LOADING

Above fold:

prioritize.

Below fold:

lazy load.

Always reserve image dimensions.

Prevent:

image loads
↓
layout moves

This is required to reduce CLS.

---

# 28. BACKGROUND ANIMATION

Create reusable background animation systems.

Do not build a unique heavy animation for every section.

Possible SENZOFT systems:

HERO:

subtle gradient
+
digital particles
+
slow geometry

TECHNOLOGY:

nodes
+
connections
+
slow data movement

CTA:

abstract digital visual
+
slow ambient movement

SERVICE:

subtle grid
+
light movement

---

# 29. BACKGROUND ANIMATION RULES

Animation must remain subtle.

Never use:

- flashing
- fast particles
- aggressive movement
- excessive parallax
- constantly changing colors
- distracting motion

Content always has priority.

---

# 30. ANIMATION PERFORMANCE

If Canvas/WebGL is used:

- cap resolution
- account for devicePixelRatio
- reduce complexity on mobile
- pause when offscreen
- pause when browser tab is hidden
- provide static fallback
- support reduced motion

Do not continuously render expensive effects when they are invisible.

---

# 31. SCROLL REVEAL SYSTEM

Create one reusable scroll-reveal system.

Default:

opacity:
0 → 1

translateY:
24px → 0

Duration:

450–700ms

Use IntersectionObserver.

Do not attach expensive calculations to every scroll event.

---

# 32. CARD ANIMATION

Cards may use:

hover:
translateY(-2px to -4px)

plus:

- subtle shadow
- image scale
- arrow movement
- border transition

Duration:

200–300ms

Avoid:

- card rotation
- extreme 3D
- large movement
- excessive scaling

---

# 33. CARD STRUCTURE

Standard card:

Image/icon
↓
Category
↓
Title
↓
Description
↓
Arrow / CTA

Clickable cards must actually navigate.

Never create decorative cards that appear clickable but do nothing.

---

# 34. STAGGERED CARD ANIMATION

Use subtle stagger.

Example:

Card 1:
0ms

Card 2:
50ms

Card 3:
100ms

Card 4:
150ms

Reduce or remove stagger on mobile when appropriate.

---

# 35. MOTION SYSTEM

Create centralized motion tokens.

Example:

fast:
150–200ms

normal:
250–350ms

section:
450–700ms

slow:
800–1200ms

Use consistent easing.

Do not create random animation timings for each component.

---

# 36. REDUCED MOTION

Implement:

prefers-reduced-motion

When enabled:

- remove large movement
- remove unnecessary parallax
- reduce animation
- reduce stagger
- disable decorative background motion

Do not remove important interaction feedback.

---

# 37. SERVICE PAGE ARCHITECTURE

Every substantial service page should follow a meaningful journey.

Recommended:

01 Hero
02 Business Need
03 Solution Overview
04 Capabilities
05 Offerings
06 Technology
07 Delivery Journey
08 Use Cases
09 Case Studies
10 Related Industries
11 Why SENZOFT
12 FAQ
13 CTA

Do not create filler content.

---

# 38. SERVICE PAGE CONTENT DEPTH

Target:

5–8 meaningful scrolls

for substantial service pages.

Do not artificially increase length.

Every section must provide new information.

---

# 39. INDUSTRY PAGE ARCHITECTURE

Recommended:

Hero
↓
Industry challenges
↓
SENZOFT approach
↓
Solutions
↓
Services
↓
Technology
↓
Use cases
↓
Case studies
↓
Business outcomes
↓
Insights
↓
CTA

Content must remain related to SENZOFT capabilities.

---

# 40. TECHNOLOGY ARCHITECTURE

Technology should be presented as an ecosystem.

Categories may include:

Frontend
Backend
Mobile
Cloud
Data & AI
DevOps
Databases
Emerging Technology

Use existing SENZOFT technology data.

Do not fabricate technologies.

---

# 41. TECHNOLOGY RELATIONSHIPS

A technology should connect to:

Technology detail
↓
Related services
↓
Related industries
↓
Related case studies
↓
Related insights

This creates a connected website.

---

# 42. CASE STUDY ARCHITECTURE

Recommended:

Hero
↓
Client/context
↓
Industry
↓
Challenge
↓
SENZOFT solution
↓
Technology
↓
Implementation
↓
Outcome
↓
Related services
↓
CTA

Never fabricate:

- client information
- project metrics
- percentages
- financial outcomes
- awards
- certifications

Only use verified data.

---

# 43. INSIGHTS ARCHITECTURE

Each insight should contain:

- title
- summary
- category
- date
- author if available
- image
- detail page
- related services
- related industries
- related technologies

Do not create fake content simply to fill the page.

---

# 44. CONTENT RELATIONSHIP GRAPH

The website should behave like a connected graph.

Example:

SERVICE
↓
TECHNOLOGY
↓
INDUSTRY
↓
CASE STUDY
↓
INSIGHT
↓
CONTACT

And:

INDUSTRY
↓
SERVICES
↓
TECHNOLOGY
↓
CASE STUDIES

And:

TECHNOLOGY
↓
SERVICES
↓
CASE STUDIES

Build these relationships using existing data repositories.

Do not duplicate content manually.

---

# 45. STICKY SECTION NAVIGATION

Long pages should have contextual section navigation.

Example:

Overview
Capabilities
Process
Technology
Case Studies
FAQ

Behavior:

page starts normally
↓
section navigation reaches top
↓
becomes sticky
↓
active section changes during scroll

Use IntersectionObserver.

---

# 46. MOBILE SECTION NAVIGATION

On mobile use:

horizontal scroll tabs

or

compact section selector

depending on available width.

Do not allow the sticky navigation to hide section headings.

---

# 47. DELIVERY JOURNEY

Create reusable process visualization.

Example:

DISCOVER
↓
DEFINE
↓
DESIGN
↓
BUILD
↓
TEST
↓
DEPLOY
↓
OPTIMIZE

Desktop:

horizontal.

Mobile:

vertical timeline.

Each stage may include:

Activities
Deliverables
Technology
Outcome

---

# 48. METRICS

Use verified SENZOFT numbers only.

Possible structure:

XX+
Projects

XX+
Clients

XX+
Technologies

XX
Industries

If verified data is unavailable, use qualitative proof instead.

NEVER invent numbers.

---

# 49. HOMEPAGE ARCHITECTURE

Recommended:

HERO
↓
CAPABILITIES
↓
TECHNOLOGY
↓
SERVICES
↓
INDUSTRIES
↓
DELIVERY JOURNEY
↓
CASE STUDIES
↓
WHY SENZOFT
↓
INSIGHTS
↓
CTA
↓
CONTACT
↓
FOOTER

The homepage should feel substantial.

---

# 50. WHY SENZOFT

Use a dark section where appropriate.

Possible content:

- engineering approach
- delivery model
- technology capabilities
- industry understanding
- quality
- support
- collaboration

Use verified claims.

Avoid generic claims with no supporting evidence.

---

# 51. CTA SECTION

Recommended:

DARK BACKGROUND
+
ABSTRACT DIGITAL VISUAL
+
STRONG HEADING
+
SHORT MESSAGE
+
CTA / FORM

Example:

Let's build something together.

Tell us what you're trying to build,
improve or transform.

[ Start a conversation ]

Use SENZOFT branding.

---

# 52. CONTACT

Contact should be simple and trustworthy.

Include:

- contact information
- email
- phone
- location
- inquiry form
- clear CTA

Do not make the form unnecessarily complex.

---

# 53. FOOTER

Keep footer simplified.

Include:

SENZOFT logo

Company location

Contact details

Phone

Email

Social links

© 2026 SENZOFT

Do not turn the footer into a massive sitemap unless required by the existing business requirements.

---

# 54. DESIGN TOKENS

Centralize:

- colors
- typography
- spacing
- radius
- shadows
- breakpoints
- motion
- easing
- z-index
- container widths

Do not scatter values everywhere.

---

# 55. COMPONENT ARCHITECTURE

Prefer reusable components.

Examples:

SiteHeader
MegaMenu
MobileNavigation
Hero
HeroVideo
AmbientBackground
SectionHeader
ServiceCard
IndustryCard
TechnologyCard
TechnologyGrid
CapabilityGrid
JourneyTimeline
MetricsGrid
CaseStudyCard
InsightCard
StickySectionNav
CTASection
ContactSection
SiteFooter

Reuse components.

Avoid creating near-identical components for every page.

---

# 56. DATA ARCHITECTURE

Use one source of truth.

Repositories/data should power:

Services
Industries
Technology
Case Studies
Insights

Do not create:

ServiceDataA
ServiceDataB
ServiceDataC

for the same entities.

Extend existing repositories.

---

# 57. ROUTING

Audit routes before creating new routes.

Every entity should have:

- valid route
- working detail page
- fallback if data is missing

No dead cards.

No broken links.

No fake navigation.

---

# 58. SAFE FALLBACKS

If an entity is missing:

do not render a broken page.

Use:

- fallback content
- valid parent route
- graceful empty state
- controlled error page

Never show:

undefined
null
NaN
blank card

---

# 59. MOBILE RESPONSIVE BREAKPOINTS

Test at least:

360px
375px
390px
412px
430px

Tablet:

768px
834px
1024px

Desktop:

1280px
1366px
1440px
1920px

Do not assume one breakpoint solves everything.

---

# 60. MOBILE DESIGN RULES

Check:

- content clipping
- image visibility
- text wrapping
- button width
- card stacking
- horizontal overflow
- navigation
- sticky elements
- video
- animation
- footer
- form

No important content may disappear on mobile.

---

# 61. MOBILE IMAGE RULE

Do not simply use desktop image positioning.

For each important image determine:

- crop
- focal point
- aspect ratio
- object position
- visibility
- loading behavior

If an image is important to understanding the section, it must remain visible on mobile.

---

# 62. TABLET RULE

Tablet is its own experience.

Do not assume:

desktop layout
+
mobile layout

is sufficient.

Check:

- navigation
- cards
- grids
- typography
- section spacing
- images
- sticky navigation
- video

---

# 63. PERFORMANCE

Optimize:

- LCP
- CLS
- INP
- TTFB
- JavaScript
- images
- videos
- fonts
- animations

Do not sacrifice usability for decorative effects.

---

# 64. JAVASCRIPT PERFORMANCE

Avoid:

- unnecessary global listeners
- expensive scroll handlers
- continuous DOM measurement
- unnecessary state updates
- repeated layout calculations
- excessive React re-renders

Use:

- IntersectionObserver
- CSS transitions
- requestAnimationFrame only when genuinely needed
- memoization where appropriate
- lazy initialization

---

# 65. ANIMATION PERFORMANCE

Animations should preferably use:

transform
opacity

Avoid animating expensive layout properties continuously.

Prefer:

transform
opacity

over:

top
left
width
height

for motion.

---

# 66. THIRD-PARTY LIBRARIES

Before installing a new library:

1. Check package.json.
2. Check existing animation libraries.
3. Check whether the functionality already exists.
4. Reuse existing infrastructure when possible.

Do not introduce multiple animation libraries unnecessarily.

---

# 67. ACCESSIBILITY

Required:

- semantic HTML
- keyboard navigation
- visible focus
- accessible buttons
- accessible links
- alt text
- sufficient contrast
- reduced motion
- mobile navigation accessibility

Do not rely on hover alone.

---

# 68. SEO

Each major page should have:

- one H1
- logical H2/H3 structure
- page title
- meta description
- canonical URL
- descriptive internal links
- image alt text
- clean URL
- crawlable content

Do not keyword stuff.

---

# 69. SEARCH

Search interface:

Desktop:

search icon
↓
search interface
↓
results

Search should eventually cover:

Services
Industries
Technology
Case Studies
Insights

Do not create a fake search interface.

---

# 70. PAGE TRANSITIONS

If page transitions are used:

- keep them short
- avoid blocking navigation
- respect reduced motion
- avoid white flashes
- avoid loading screens for simple navigation

The user should feel continuity rather than waiting.

---

# 71. SCROLL EXPERIENCE

Scrolling should feel smooth but native.

Do not force custom scrolling unless absolutely necessary.

Avoid:

- scroll hijacking
- excessive snap behavior
- artificial delays
- blocking scrolling

Native browser scrolling should remain the default.

---

# 72. BACKGROUND VISUAL SYSTEM

Backgrounds should have hierarchy.

Possible:

WHITE
content

LIGHT TINT
supporting sections

DARK NAVY
technology / differentiator sections

IMAGE/DARK
CTA

Do not use the same background across every page.

---

# 73. TYPOGRAPHY

Use strong hierarchy.

H1:

large
clear
high impact

H2:

strong section identifier

Body:

comfortable reading width

Avoid overly narrow text columns.

Mobile typography must scale intentionally.

Do not simply shrink all typography by the same percentage.

---

# 74. SPACING

Use consistent spacing tokens.

Large sections should have:

clear vertical rhythm

Avoid:

- random padding
- giant unexplained empty areas
- cramped content
- inconsistent card gaps

Mobile spacing should be independently tuned.

---

# 75. CONTENT WIDTH

Use a controlled maximum content width.

Example concept:

full viewport
↓
content container
↓
readable line length

Do not allow paragraphs to span the entire 1920px viewport.

---

# 76. HOVER DESIGN

Hover effects should communicate:

"This element is interactive."

Use:

- subtle movement
- border
- shadow
- image scale
- arrow movement

Do not make every element animate.

---

# 77. TOUCH DEVICES

Hover behavior must never be required for mobile/tablet.

Use:

tap
focus
active

for touch interfaces.

Do not rely on:

mouseenter

for essential mobile functionality.

---

# 78. LOADING STATES

Where data/media loading is visible:

Use appropriate:

- skeleton
- placeholder
- poster
- reserved media area

Avoid sudden content jumps.

---

# 79. ERROR HANDLING

No uncaught UI errors.

If data is missing:

show controlled fallback.

If image fails:

show appropriate fallback.

If video fails:

poster remains visible.

---

# 80. PERFORMANCE + MEDIA STRATEGY

Priority:

ABOVE FOLD
↓
critical content
↓
hero media
↓
important images
↓
below-fold content
↓
decorative media

Do not load all media at once.

---

# 81. QA — HEADER

Verify:

[ ] No hover flicker
[ ] Menu opens intentionally
[ ] Menu remains open when cursor enters dropdown
[ ] Menu switches smoothly
[ ] No blank state
[ ] Escape closes
[ ] Keyboard works
[ ] Mobile works independently
[ ] No layout shift
[ ] Sticky behavior works

---

# 82. QA — MOBILE

Verify:

[ ] No horizontal overflow
[ ] No missing content
[ ] No clipped images
[ ] No broken buttons
[ ] Navigation works
[ ] Cards stack correctly
[ ] Typography is readable
[ ] Video fallback works
[ ] Animations are reduced appropriately
[ ] Footer works
[ ] Forms work

---

# 83. QA — ANIMATION

Verify:

[ ] Scroll reveals work
[ ] No stutter
[ ] No excessive animation
[ ] Card motion is subtle
[ ] Background animation is subtle
[ ] Mobile animation is optimized
[ ] Reduced motion works
[ ] Offscreen animation is paused where appropriate

---

# 84. QA — VIDEO

Verify:

[ ] Poster exists
[ ] Video muted
[ ] autoplay works where allowed
[ ] playsInline
[ ] loop
[ ] mobile fallback
[ ] compressed files
[ ] below-fold videos deferred
[ ] no unnecessary video downloads

---

# 85. QA — PERFORMANCE

Run:

Lighthouse

Chrome DevTools:

Performance
Network
Rendering

Check:

LCP
CLS
INP
TTFB
JS bundle
image sizes
video sizes
long tasks
layout shifts
frame rate

---

# 86. QA — ACCESSIBILITY

Verify:

[ ] Keyboard navigation
[ ] Focus visibility
[ ] Escape behavior
[ ] Semantic elements
[ ] Alt text
[ ] Contrast
[ ] Reduced motion
[ ] Mobile menu accessibility
[ ] Form labels

---

# 87. QA — ROUTES

Test:

Home
Services
Every service
Industries
Every industry
Technology
Every technology
Case Studies
Every case study
Insights
Every insight
About
Careers
Contact

Every route must work.

---

# 88. QA — DATA

Verify:

- no duplicate entities
- no broken references
- no undefined values
- no empty cards
- no fake metrics
- no placeholder content in production
- no unrelated content

---

# 89. IMPLEMENTATION PHASES

Do not implement the entire project randomly.

Use this order.

PHASE 1
Architecture audit

PHASE 2
Header + mega navigation

PHASE 3
Mobile navigation

PHASE 4
Design tokens

PHASE 5
Motion system

PHASE 6
Hero + media system

PHASE 7
Service page architecture

PHASE 8
Industry architecture

PHASE 9
Technology ecosystem

PHASE 10
Case studies

PHASE 11
Insights

PHASE 12
Sticky section navigation

PHASE 13
Content relationships

PHASE 14
Background animations

PHASE 15
Mobile optimization

PHASE 16
Performance optimization

PHASE 17
Accessibility

PHASE 18
SEO

PHASE 19
Cross-device QA

PHASE 20
Final cleanup

---

# 90. PHASE 1 — AUDIT

First inspect everything.

Do not modify major UI.

Report:

- architecture
- components
- routes
- repositories
- current header
- current mobile nav
- current animations
- current media
- responsive strategy
- missing content
- duplicate code
- performance risks

Then proceed with implementation according to the approved sequence.

---

# 91. PHASE 2 — HEADER

Fix the header first.

Primary objective:

stable enterprise navigation.

Focus on:

- hover intent
- menu state
- interaction zone
- transition
- close delay
- menu switching
- keyboard
- mobile

Do not redesign unrelated pages during this phase.

---

# 92. PHASE 3 — MOBILE NAVIGATION

Implement:

- touch-first navigation
- accordion
- nested navigation
- back behavior
- body scroll lock where appropriate
- smooth transitions
- accessibility

Test all mobile widths.

---

# 93. PHASE 4 — DESIGN SYSTEM

Establish:

- colors
- typography
- spacing
- radius
- shadows
- containers
- breakpoints
- motion tokens

Reuse existing tokens where available.

---

# 94. PHASE 5 — MOTION SYSTEM

Create:

- scroll reveal
- card hover
- button motion
- section transitions
- ambient backgrounds

Use reusable components.

---

# 95. PHASE 6 — HERO + MEDIA

Implement:

- hero structure
- image handling
- video handling
- poster fallback
- mobile media strategy
- lazy loading

---

# 96. PHASE 7 — SERVICES

Refactor service pages around:

Problem
↓
Solution
↓
Capabilities
↓
Technology
↓
Process
↓
Use cases
↓
Case studies
↓
Why SENZOFT
↓
CTA

---

# 97. PHASE 8 — INDUSTRIES

Connect:

Industry
↓
Challenges
↓
SENZOFT solutions
↓
Services
↓
Technology
↓
Case studies
↓
Insights
↓
CTA

---

# 98. PHASE 9 — TECHNOLOGY

Build technology ecosystem.

Category
↓
Technology
↓
Services
↓
Industries
↓
Case studies

---

# 99. PHASE 10 — CASE STUDIES

Improve:

- storytelling
- visual hierarchy
- challenge
- solution
- technology
- outcome
- relationships

---

# 100. PHASE 11 — INSIGHTS

Create useful content relationships.

Insight
↓
Service
↓
Industry
↓
Technology
↓
Related insight

---

# 101. PHASE 12 — STICKY SECTION NAVIGATION

Implement on long pages.

Desktop:

horizontal navigation.

Mobile:

horizontal scroll or compact selector.

Active section should update while scrolling.

---

# 102. PHASE 13 — CONTENT GRAPH

Ensure every major content type connects to other content.

Service ↔ Industry

Service ↔ Technology

Service ↔ Case Study

Industry ↔ Case Study

Technology ↔ Case Study

Insight ↔ Service

Insight ↔ Industry

Insight ↔ Technology

---

# 103. PHASE 14 — BACKGROUND MOTION

Add only after content and layout are correct.

Do not use animation to compensate for missing content.

Priority:

CONTENT
>
UX
>
LAYOUT
>
MOTION

---

# 104. PHASE 15 — MOBILE OPTIMIZATION

Review every page specifically at:

360
375
390
412
430

Do not merely resize desktop.

Fix:

- padding
- image crop
- typography
- card stacking
- navigation
- buttons
- sticky elements
- animations
- video

---

# 105. PHASE 16 — PERFORMANCE

Optimize:

- images
- videos
- JavaScript
- animation
- fonts
- lazy loading
- rendering

Measure before and after.

---

# 106. PHASE 17 — ACCESSIBILITY

Perform keyboard and screen-reader-friendly review.

Do not rely on visual appearance alone.

---

# 107. PHASE 18 — SEO

Verify:

- metadata
- headings
- internal links
- canonical URLs
- alt text
- route structure
- crawlable content

---

# 108. PHASE 19 — CROSS DEVICE QA

Test:

Desktop
Tablet
Mobile

Verify the actual rendered experience, not just code correctness.

---

# 109. PHASE 20 — FINAL CLEANUP

Remove:

- dead code
- duplicate components
- unused imports
- unused dependencies
- unused animations
- placeholder content
- broken links
- console errors
- layout warnings

---

# 110. CRITICAL "DO NOT" RULES

DO NOT:

- copy HCLTech
- create random images
- create random videos
- fabricate company metrics
- fabricate clients
- fabricate case-study outcomes
- create duplicate repositories
- create dead routes
- rely on hover for mobile
- overanimate the page
- use huge videos unnecessarily
- add unnecessary libraries
- sacrifice performance for animation
- hide content on mobile
- create giant empty sections
- create generic filler text
- rewrite working architecture without inspection

---

# 111. PRIORITY ORDER

When deciding what to implement first:

1. Information architecture
2. Navigation
3. Mobile UX
4. Content quality
5. Visual hierarchy
6. Responsive layout
7. Motion
8. Video/media
9. Performance
10. Decorative effects

If animation conflicts with usability:

REMOVE/REDUCE ANIMATION.

If visual design conflicts with performance:

OPTIMIZE/REDUCE VISUAL EFFECT.

If page is short because content is missing:

FIX CONTENT ARCHITECTURE.

Do not use animation to hide weak content.

---

# 112. FINAL EXPERIENCE TARGET

The finished SENZOFT website should feel like:

A serious enterprise IT/software company with:

- strong navigation
- meaningful content
- connected services
- connected industries
- technology ecosystem
- useful case studies
- useful insights
- premium visual design
- controlled animation
- cinematic media where appropriate
- excellent mobile UX
- responsive tablet experience
- stable desktop experience
- fast loading
- accessible interaction

---

# 113. FINAL CODEX DIRECTIVE

Treat this document as the MASTER SPECIFICATION.

Do not implement everything in one uncontrolled change.

Work phase-by-phase.

For every phase:

1. Inspect existing implementation.
2. Identify affected files.
3. Reuse existing infrastructure.
4. Implement the smallest clean architectural solution.
5. Test desktop.
6. Test tablet.
7. Test mobile.
8. Check accessibility.
9. Check performance.
10. Check console for errors.
11. Verify routes.
12. Verify content.
13. Verify animations.
14. Verify no regressions.

After each major phase, report:

- files changed
- components changed
- components created
- data changed
- routes changed
- dependencies changed
- animation changes
- performance impact
- responsive changes
- remaining issues

Do not silently make large architectural changes.

The final goal is:

SENZOFT
=
Enterprise IT/software identity
+
MNC-level UX principles
+
SENZOFT branding
+
Strong content architecture
+
Premium motion
+
Optimized media
+
Mobile-first responsive design
+
High performance
+
Accessibility
+
Connected digital experience

END OF MASTER SPECIFICATION