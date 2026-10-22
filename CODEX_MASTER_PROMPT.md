# Codex master prompt — NivoKit

You are the lead product engineer, Nuxt/Vue architect, UI/UX designer, SEO engineer, and QA engineer for a new product: **NivoKit** (WORKING brand name; do not assume the domain is available or permanently hardcode it).

Implement a production-minded, fast, polished, accessible and genuinely useful **global all-in-one online utilities** site according to the attached `PRODUCT_BLUEPRINT.md`. The actual code is your responsibility. Do not simply make a pretty static mock. Do not ask me to pay for APIs, Google Ads, subscriptions, or services. Prefer zero runtime backend and zero database for MVP.

## Mandatory product goals
1. Search visitors should land directly on the exact SEO-friendly utility page, not a generic homepage.
2. Every released tool works, can be tested, has good empty/loading/success/error states, and is straightforward for non-technical users.
3. Premium-quality, restrained UI — comparable care to the best SaaS products but less clutter. Responsive mobile-first, good accessibility, fast navigation.
4. A universal sitewide fuzzy/alias search: typing `compress pdf`, `resize image`, `калькулятор`, `json`, etc. filters actual tools; pressing Enter navigates to the tool page. Provide Ctrl/Cmd+K shortcut and keyboard support.
5. SEO is a first-class feature, not an afterthought; no claim of guaranteed Google rankings.
6. Clean, maintainable scalable TypeScript, easy for a single developer to extend with new tools and locales.

## Technology choices
- Nuxt 4, Vue 3 Composition API, TypeScript, pnpm; use the current compatible stable package versions.
- Static site output with prerendered HTML (`nuxt generate`) and CDN deployment. No required Node server, database, user login, object storage, or file processing API at MVP.
- Build a `tools` registry with typed `id`, category, slug, localized labels/descriptions, synonyms, metadata and lazy component import references. Route generation derives from registry. Avoid nested conditionals hardcoding every tool.
- Use reliable open-source dependencies only where appropriate; avoid downloading oversized dependencies for all visitors. Load the PDF library solely for PDF routes, DOCX parser solely for Word route, SQL formatter solely for SQL route.
- Browser-only processing for inputs. Avoid uploading user files. Validate inputs, manage file size and memory, support accessible error recovery and safe downloads.
- Use a simple design token system, lightweight icons, and styling optimized for fast rendering.

## Required 12 actually functional tools
PDF: `merge-pdf`, `split-pdf`, `rotate-pdf` (using a tested browser library such as pdf-lib; support meaningful error cases).
Image: `compress-image`, `resize-image`, `convert-image` (JPEG/PNG/WebP only where browser support exists; honest results, never promise guaranteed target size; support drag-and-drop and file picker).
Text/Word: `word-counter` (paste text, optional browser-side DOCX reading/extraction; plain word-count semantics documented).
Developer: `json-formatter` (validate, prettify, minify), `sql-formatter` (presentation-only, PostgreSQL dialect), `unix-timestamp-converter` (seconds vs milliseconds handled correctly).
Calculators: `percentage-calculator`, `loan-calculator` (fully specified mathematical behavior and zero-interest handling).

Do NOT implement stub buttons or claim PDF-to-Word, Word-to-PDF, PDF compression or HEIC support without tested real support. Do not publish a tool page for incomplete features.

## UX implementation details
- Homepage: clear brand mark, concise headline, single prominent search, popular tools, category groups, responsive card list, language selector, footer.
- Tool detail pages: active tool area ABOVE long instructional text; visible purpose, one primary CTA, simple controls; processing feedback; proper download/export; short explanations, plain FAQs, related utilities. No unnecessary sign-in dialogs.
- Full keyboard usability, visible focus, ESC close dialogs, meaningful aria-labels and screen reader status announcements. Reduced motion support.
- Empty, error and unsupported-format states have actionable copy; limit large files gracefully. Do not silently fail or hang.
- Consistent branding: working name NivoKit, tagline "Useful tools. Zero friction.". Do not claim legal/domain clearance.
- Create premium clean aesthetic with neutral grays, one accent, ample whitespace, accessible contrast, readable type, subtle shadows, no visual clutter.

## International SEO / localization
- Implement i18n infrastructure for `en`, `ru`, `uz`, `es`, `de` but **publish only complete reviewed locales**; initial release can be English only with translation files/templates prepared. No indexable placeholder or machine-spun clone pages.
- URL structure `/{locale}/{category}/{tool-slug}`. Example `/en/pdf/merge-pdf` and `/en/calculators/loan-calculator`.
- Per-page server/prerendered H1, title, meta descriptions, canonical URL, real useful intro/how-to/FAQ, OG. The canonical is usually the page's own language version, not all languages pointing to English.
- Sitemap lists published URLs only; crawlable internal links, structured data only when eligible and truthful; use `hreflang` only for real reciprocal translations; robots excludes unnecessary transient/empty search pages. Do not block crawlable tools.
- No automatic geolocation redirection for search engines; user can change language explicitly.
- Avoid artificial 1000-word SEO articles, duplicate content, manipulative keyword stuffing, fake testimonials or ratings.
- Define a placeholder environment variable `NUXT_PUBLIC_SITE_URL` for the canonical origin; do not invent a verified production domain.

## Performance, testing and standards
- Performance targets p75: LCP <=2.5s, INP <=200ms, CLS <=0.1. Lab aspiration >=95 Lighthouse Performance/Accessibility/SEO, with configuration documented and no fraudulent guarantees.
- Test workflows with Vitest for pure logic and Playwright for navigation/functional flows (e.g. merge and split sample PDF, resize image, JSON error, loan zero-interest, responsive nav and search). Add fixture files generated locally in tests, not external files.
- Static generated HTML must include real titles and content; tools must hydrate and run in client without errors. Verify output of prerendered URLs.
- Include `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` and `pnpm generate` scripts, CI-friendly.
- Use English UI copy for first release. Prepare planned localization architecture and a rigorous process for additional locales.
- Provide privacy, about, contact, terms and accessibility pages with accurate non-invented content; do not insert fake contact details. For unknown owner information, leave a clearly marked deployment configuration blocker and do not silently publish fictitious legal text.
- No paid services, no tracking scripts by default. Consent compliance is necessary if analytics/advertising is added later.

## How to work and deliver in phases
PHASE 1: Inspect working directory. Build a short plan, architecture, file structure and scripts; initialize Nuxt project and shared UI foundations. Do not blindly overwrite unrelated user files.
PHASE 2: Homepage, accessible navigation/search, category/tool routing, typed registry and SEO metadata, static generation and tested locale architecture.
PHASE 3: Implement all 12 tools for real, one category at a time, each with input validation, browser-only processing where appropriate, download/results and tests. No placeholders presented as completed products.
PHASE 4: Performance tuning, SEO verification of generated HTML/sitemap, browser testing (desktop/mobile), accessibility checks, content review, deployment setup and README.

Important: At the end of every phase, run checks, summarize exactly what is complete vs pending, and include reproducible commands. If something is blocked, state it transparently and do not call it done. Stop after Phase 1 and report your progress if a large implementation will require separate turns; prioritize a fully working vertical slice over an extensive broken scaffold. If asked to continue, progress through remaining phases until the release gate is satisfied.

First action: read `PRODUCT_BLUEPRINT.md`, create a concise implementation plan, inspect the repository, initialize the project, build the design system and homepage + one truly working utility page with tests. Show which parts of the blueprint are not yet implemented.
