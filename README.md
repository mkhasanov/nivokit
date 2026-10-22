# NivoKit

NivoKit is a privacy-minded collection of focused browser utilities. This repository currently contains the Phase 1 vertical slice: the shared product shell, search and SEO architecture, plus one complete image resizing tool.

> NivoKit is a working name. Verify the production domain, trademark, operator identity, and public contact details before launch.

## What is live

- Nuxt 4, Vue 3, TypeScript, pnpm, and Tailwind CSS 4
- Responsive light/dark design system with keyboard-visible focus and reduced-motion support
- English homepage at `/en/`, image category at `/en/image/`, and image resizer at `/en/image/resize-image`
- Keyboard-accessible fuzzy search with `Ctrl/Cmd+K`
- Client-side JPG, PNG, and WebP resizing with validation, aspect locking, quality selection, preview, and download
- Canonical metadata, social metadata, structured data, sitemap, and robots output
- Pre-rendered static deployment output with no database or required runtime backend
- Accurate about, privacy, terms, contact, and accessibility pages

Only finished tools are present in the registry, search, category pages, and sitemap. The remaining MVP tools and non-English locales are intentionally not published yet.

## Requirements

- Node.js 20.19+ (the onboarding environment uses Node.js 24)
- pnpm 11
- Chromium for `pnpm test:e2e`; set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` if it is not at `/usr/bin/chromium`

## Setup

```bash
pnpm install --frozen-lockfile
cp .env.example .env
pnpm dev
```

The app runs at `http://localhost:3000`. The `.env` copy is optional for local development because that URL is the development fallback.

Set `NUXT_PUBLIC_SITE_URL` to the verified absolute public origin for a production build. Do not publish with the localhost fallback because canonical and sitemap URLs use this value.

## Quality checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
pnpm generate
```

Preview the generated site with:

```bash
pnpm preview --listen 3000
```

## Architecture

- `shared/tools.ts` — serializable category/tool registry and route generation shared by app and Nitro
- `app/data/tool-components.ts` — lazy component mapping for live tools
- `app/utils/search.ts` — dependency-free fuzzy/alias search
- `app/utils/image/` — dynamically imported browser image processor
- `app/pages/[locale]/` — locale-first homepage, category, information, and tool routes
- `server/routes/` — static-generation-friendly `sitemap.xml` and `robots.txt`
- `tests/` — registry/search/image unit tests and Chromium browser smoke tests

English is the only published locale. The route and content types are locale-aware so reviewed translations can be added without exposing placeholder pages.

## Privacy behavior

The image resizer uses browser decoding, Canvas, Blob URLs, and a local download. It does not upload selected files. Object URLs are revoked when replaced or when the component is unmounted. The only persistent browser value is the theme preference in local storage. This release includes no analytics, advertising, tracking, account, API, or database.

## Phase status

Phase 1 delivers a working product foundation and one vertical slice. Still pending:

- The other 11 MVP utilities and their representative fixtures/tests
- Reviewed Russian, Uzbek, Spanish, and German content
- Broader Playwright coverage across the remaining tools and responsive navigation states
- Formal assistive-technology testing and Lighthouse budget recording
- Verified domain/trademark, production host, operator identity, legal review, and support address
- Deployment and Search Console configuration after the public origin is approved
