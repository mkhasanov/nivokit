# NivoKit — Global Utility Platform

**Status:** Initial product blueprint, 22 October 2026. NivoKit is a working brand, not a registered/verified domain or trademark.

## Vision
A fast, accessible, elegant all-in-one utility site where searchers land directly on exactly the tool they need. Each tool delivers real value without mandatory login or distracting UI.

**Tagline:** Useful tools. Zero friction.

## Positioning
- Global `.com` brand, English-first; support Russian, Uzbek, Spanish and German as quality-reviewed localization becomes available.
- Multi-category architecture; focused first release with 12 excellent tools, not 100 thin/empty pages.
- Tool page is the product; homepage is the tool finder.
- Initially completely free; ads and paid features only when there is meaningful traffic and true additional user value.
- Privacy: process user files within the browser where feasible and make processing location clear. Never claim universal zero-upload privacy if an exception later exists.

## Brand checks before purchase
NivoKit is a *proposed* coined name. Search did not surface an obvious exact-name active brand in a limited general-web check. **This is not evidence that nivokit.com is available or safe as a trademark.** Verify live domain registration, national and international trademark databases, and social usernames before spending money or publishing the brand. Never hardcode the final domain until verified.

## Information architecture
- `/en/` — homepage + instant tool search
- `/en/pdf/`, `/en/image/`, `/en/developer/`, `/en/calculators/`, `/en/text/` — category hubs
- `/en/pdf/merge-pdf`, `/en/pdf/split-pdf`, `/en/pdf/rotate-pdf`
- `/en/image/compress-image`, `/en/image/resize-image`, `/en/image/convert-image`
- `/en/text/word-counter` — paste text or read a local DOCX file (word count, no lossy conversion claims)
- `/en/developer/json-formatter`, `/en/developer/sql-formatter`, `/en/developer/unix-timestamp-converter`
- `/en/calculators/percentage-calculator`, `/en/calculators/loan-calculator`
- One locale path per real translated page, e.g. `/ru/`, `/uz/`, `/es/`, `/de/` only when complete.
- Localized page should have correct translated heading, instructions, button labels, FAQ and metadata. Slugs may remain stable to keep links simple; locale must be in URL.
- Footer: Privacy, Terms, About, Contact, Accessibility.

## UX design principles
1. User lands on a tool and can start using it immediately above the fold; no obligatory registration, popups, or marketing modal.
2. Homepage: one very clear hero, one large search box with instant keyboard-accessible suggestions, popular tools, and clean category blocks.
3. Tool page: short plain-English H1, one-line benefit statement, primary action area, result/download state, progress, helpful error states, 3-step instructions, factual FAQ, related tools.
4. Desktop and mobile: mobile-first responsive UI, generous spacing, visible interactive states, readable typography, clear accessible contrast, dark mode optional with robust defaults.
5. Command search with Ctrl/Cmd+K, typo-tolerant matching, localized tool labels and synonyms; keyboard arrows + Enter + Esc, proper combobox accessibility. Users should land on real tool URLs.
6. Never show fake numbers, reviews, testimonials, fabricated badges, countdowns, or unusable demo buttons.
7. No ads near upload/download controls; keep users safe from accidental clicks.
8. Modern design tokens: neutral background, one distinct accent, consistent 8px spacing rhythm, max 1200px content width, restrained radius/shadow; avoid gradient-heavy template look.

## MVP feature inventory (12 functional tools)
| Category | Tool | Core requirements |
| --- | --- | --- |
| PDF | Merge PDF | Multiple files, reorder, combine, download, handle encrypted/broken PDFs gracefully |
| PDF | Split PDF | Page selection or range; export selected/new PDFs |
| PDF | Rotate PDF | Select rotation for all or selected pages; downloadable result |
| Image | Compress image | JPG/WebP quality with honest size estimates; lossless PNG cannot guarantee chosen KB |
| Image | Resize image | Explicit width/height, aspect lock, downloadable image |
| Image | Convert image | JPG/PNG/WebP based on what the browser can decode/encode; no untested HEIC promises |
| Text/Word | Word counter | Characters/words/reading estimate, plain text and locally parsed DOCX content |
| Developer | JSON formatter | Validate, prettify, minify; useful line/column errors where possible |
| Developer | SQL formatter | Formatting only; PostgreSQL dialect when available; no SQL execution |
| Developer | Unix timestamp converter | Seconds/ms, timezone-safe input/output, DST edge cases |
| Calculator | Percentage calculator | Common use cases (X% of Y, X is what % of Y, increase/decrease) |
| Calculator | Loan calculator | Monthly payment, principal vs interest totals, amortization, zero-interest case, assumptions clearly shown |

**Deferred intentionally:** PDF compression, PDF-to-DOCX, DOCX-to-PDF, background removal, live exchange rates, bank comparisons, accounts, payment plans, heavy AI processing. These need independent quality, cost or source verification. No empty coming-soon SEO pages.

## Tech and operations
- Nuxt 4 (current supported stable), Vue 3, TypeScript, pnpm.
- Static site generation with full pre-rendered HTML for all live category and tool URLs. Serve from reliable static host/CDN such as Cloudflare Pages or Netlify; avoid a required always-on Node server initially.
- CSS: Tailwind (supported version) or lightweight tokens with minimal runtime. Accessible, lightweight icons.
- Libraries chosen on merit and tested in real browsers: pdf-lib for PDF edits; Canvas/Blob for supported raster images; mammoth or secure compatible parser for DOCX text extraction; sql-formatter for SQL presentation. Lazy-load heavy packages only on applicable tool pages.
- Functional code split: typed registry of tools, route metadata, client-only processors, localizations and URL mapping.
- No DB or user login. No uploads, backend API, object storage, third-party analytics, payments or tracking required for initial local MVP. Later APIs only when necessary and documented.
- Process files in volatile browser memory; never send files to a remote server. Implement sensible validation, file limits, and memory cleanup. Document realistic limitations.
- Deploy configuration and README with concise setup commands, checklists and privacy behavior.

## SEO policy and requirements
- Google does NOT guarantee any page a high search ranking. Build honest, useful, accessible pages.
- Pre-render real visible HTML: unique H1/title/meta description, concise explanation, direct working tool, practical how-to and FAQs written for humans.
- Per-tool canonical URLs (normally self-referencing), breadcrumbs with actual links, category cross-links and related tool links.
- Locale-aware `lang`, correct reciprocal `hreflang` for all actually published translations; `x-default` to language chooser/home if applicable; no auto IP redirect of crawlers.
- XML sitemap with **only** live indexable URLs; robots.txt; OG/Twitter sharing preview; structured data for BreadcrumbList, Organization/WebSite and appropriate software type only when accurate, compliant and applicable. No invented ratings/reviews.
- Never index search-result URLs, empty pages, duplicate boilerplate or unreviewed machine translations; avoid doorway pages and keyword stuffing.
- Separate distinct intent per tool; headings/how-tos should solve that intent immediately rather than burying functionality under SEO text.
- Set up Google Search Console and monitor indexing, clicks, CTR, queries, countries and pages after deployment; improve based on measured data.

## Performance and accessibility acceptance criteria
- Target at 75th percentile in real-user data: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 on mobile and desktop where measurable.
- Aim ≥95 in Lighthouse Performance/Accessibility/SEO for representative pages under a stated lab configuration; this is an engineering target, not a guarantee.
- Keyboard-only workflow works, all controls labeled, focus visible, appropriate live-region feedback, WCAG 2.2 AA-minded design.
- No synchronous heavy processing that freezes the main UI: use Web Workers where practical.
- Image previews and progress states should be efficient; release object URLs/memory when no longer needed.
- Build, typecheck, lint, unit tests and critical E2E pass; no dead links.

## Traffic and monetization model
- Start free and privacy-first, with no ads until enough content quality and visitors.
- After data supports monetization: contextually appropriate ads subject to provider policies (Google AdSense language restrictions are important for Uzbek-language pages), direct sponsorship and paid workflow features.
- Avoid false claims about RPM or guaranteed traffic. Use actual Search Console + analytics; compare bounce/engagement only where consent/compliance allows.

## MVP release gates
1. Exactly 12 honest, fully functioning tools with representative tests, error handling and useful instructions.
2. All public routes pre-render properly and accessible without client JS for primary SEO copy/navigation.
3. Search, navigation and translation controls usable on mobile and keyboard.
4. Privacy copy reflects actual implementation, third-party data handling and dependencies.
5. Page and interaction performance budget checked.
6. No release of unfinished locale URLs; start English-first and expand reviewed translations incrementally.
7. Real website verification (domain, trademark, user testing) precedes buying or launch.

## Official references
- Google Search Central SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Google multilingual sites: https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites
- Google Search Central Core Web Vitals: https://developers.google.com/search/docs/appearance/core-web-vitals
- Nuxt prerendering: https://nuxt.com/docs/4.x/getting-started/prerendering
