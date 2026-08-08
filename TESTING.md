# Testing

How to run and maintain tests for MyPortfolio (`princewillnanakumor.com`).

## Prerequisites

- Node.js 22+
- npm
- Chromium (installed automatically via `postinstall`; run `npx playwright install chromium` if missing)

## Current suite (approximate)

- **40** Vitest tests (utils, static project data, mocked contact API).
- **8** Playwright tests (navigation smoke, contact flow, 404, SEO, accessibility).

Counts drift as tests are added; re-run `npm test` / `npm run test:e2e` for exact numbers.

## Testing strategy

MyPortfolio follows a layered testing approach suited to a personal portfolio + blog CMS:

- Unit tests verify pure helpers (slug/ObjectId queries, content-block search, video URL parsing, project lookups).
- API tests verify request validation and happy/error paths with external services mocked (e.g. Nodemailer).
- Playwright E2E verifies high-value public workflows: pages load, contact submits, SEO surfaces stay correct, and basic accessibility holds.

Business logic is tested close to its implementation. E2E stays thin — smoke + one contact path + SEO/a11y checks — not exhaustive UI coverage.

The admin CMS is primarily verified through manual testing at the moment because reproducing authenticated editor workflows requires significantly more setup than the public-facing portfolio. Cloudinary uploads and Mongo-backed blog CRUD are likewise not E2E’d yet for the same reason.

## CI

No GitHub Actions test workflow is wired yet. Planned: a `.github/workflows/test.yml` workflow on PRs / `main` that enforces style, types, unit tests, and E2E.

Prefer **separate jobs** (rather than one long combined script) so failures are easy to identify:

```text
lint → typecheck → vitest → playwright
```

Each job should run its own command:

```bash
npm run lint
npm run typecheck
npm test
npm run test:e2e
```

Until CI exists, run locally before merging:

```bash
npm run lint && npm run typecheck && npm test && npm run test:e2e
```

## Commands

```bash
# Unit + API tests (Vitest)
npm test

# Watch mode
npm run test:watch

# Playwright (starts/reuses local Next; Chromium via postinstall)
npm run test:e2e

# Playwright UI mode
npm run test:e2e:ui

# First-time / after Playwright upgrade — if browsers are missing
npx playwright install chromium
```

Vitest does not need MongoDB or email credentials. Contact E2E stubs `POST /api/contact` so it never sends real mail. SEO checks against `robots.txt` / `sitemap.xml` work with the local Next server Playwright starts.

`postinstall` installs Chromium for local/CI use. It **skips on Vercel** (`VERCEL` env) so production deploys don’t try to download browsers. If you see `Executable doesn't exist … chrome-headless-shell` locally, run `npx playwright install chromium` once.

## What’s covered

| Layer | Location | What is tested |
| --- | --- | --- |
| Blog helpers | `src/utils/blogQueries.test.ts` | Slug decode, regex escape, Mongo ObjectId checks |
| Content blocks | `src/utils/contentBlockSearch.test.ts` | Search match, indices, block summaries |
| Video helpers | `src/utils/videoUtils.test.ts` | YouTube / Vimeo / direct / Cloudinary embed URLs |
| Projects data | `src/data/projects.test.ts` | Slug lookup, image URLs, tech chip splitting |
| Contact API | `src/app/api/contact/route.test.ts` | Validation, `201` success, mail failure → `500` (Nodemailer mocked) |
| E2E navigation | `e2e/navigation.spec.ts` | Home, Projects, Blog, Contact section load |
| E2E contact | `e2e/contact.spec.ts` | Fill form → mocked API → `/success` |
| E2E 404 | `e2e/not-found.spec.ts` | Custom not-found UI + 404 status |
| E2E SEO | `e2e/seo.spec.ts` | Canonical, Open Graph, `robots.txt`, `sitemap.xml` |
| E2E a11y | `e2e/accessibility.spec.ts` | axe-core on home + blog (WCAG 2 A/AA). Color-contrast checks are disabled in automated tests because they require browser rendering details better verified manually. |

## Layout

- `vitest.config.ts` — unit/API runner (`src/**/*.{test,spec}.{ts,tsx}`)
- `playwright.config.ts` — E2E runner (`e2e/`), webServer on `:3000`
- `e2e/*.spec.ts` — Playwright specs
- `src/**/*.test.ts` — Vitest specs co-located with source

## Not in git

Playwright output (`test-results/`, `playwright-report/`, `blob-report/`, `playwright/.cache/`) is gitignored. Don’t commit pass/fail dumps; re-run the commands above for current results.

## Planned

- GitHub Actions CI (`test.yml`: separate lint, typecheck, Vitest, and Playwright jobs)
- Blog publish / slug rules API tests (`/api/blog`, draft vs published)
- Admin auth + lockout tests (`/api/admin/auth`)
- Component tests for admin content-block list / filters (Testing Library)
- Optional: one published-post E2E when a stable fixture post exists
