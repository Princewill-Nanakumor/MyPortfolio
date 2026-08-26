export const SITE_URL = "https://princewillnanakumor.com";
export const SITE_NAME = "Nanakumor Princewill";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/myPhoto.jpg`;

export interface Project {
  slug: string;
  image: string;
  name: string;
  /** Short blurb for homepage / index cards */
  summary: string;
  /** Who the product is for */
  builtFor: string;
  /** The pain the project addresses */
  problem: string;
  /** Longer overview unique to the detail page */
  overview: string;
  /** Product / user-facing capabilities */
  capabilities: string[];
  /** Short system-design notes (not a blog walkthrough) */
  architecture: string[];
  /** Concrete outcomes / what the build demonstrates */
  outcomes: string[];
  technology: string;
  github: string;
  link?: string;
  linkLabel?: string;
  /** Optional related blog post slug (used for the "Blog" button) */
  blogSlug?: string;
  /** Optional label override for the blog button */
  blogLabel?: string;
  year: string;
  /** Extra phrases so search/AI don't confuse this with unrelated “Helix” brands */
  searchTerms?: string[];
}

export const projects: Project[] = [
  {
    slug: "car-showroom",
    image: "/motorlane-showroom.png",
    name: "Motorlane — Virtual Car Showroom",
    summary:
      "Vehicle catalog from DummyJSON with search, filters, sorting, and a comment system persisted in localStorage.",
    builtFor:
      "A lightweight virtual showroom where visitors can browse vehicles fast and leave personal notes without a backend.",
    problem:
      "Building a responsive catalog experience is easy to get wrong: search/filter UX, scalable browsing, and keeping user comments after refresh.",
    overview:
      "Motorlane is a Next.js app that pulls vehicle data from DummyJSON, lets visitors search and filter by brand/price/rating, and provides a vehicle detail page with image gallery + specs. Comments combine API reviews with locally saved visitor notes stored in localStorage.",
    capabilities: [
      "Vehicle catalog from DummyJSON (`/products/category/vehicle`)",
      "Search by brand, title, and description",
      "Filters for min/max price, rating, and brand",
      "Sorting by price, rating, and name",
      "Vehicle detail page with image gallery and specifications",
      "Merged comments: API reviews + local comments",
      "Comment form with Zod + React Hook Form validation",
      "Comments restored after refresh via localStorage",
    ],
    architecture: [
      "Next.js 15 App Router with a server/client mix for UI pages",
      "DummyJSON as the data source (vehicle list + vehicle details)",
      "Client-side comment persistence using localStorage keyed by vehicleId",
      "Zod schemas + React Hook Form for comment input validation",
      "Plain CSS layout tuned for 420px–1440px screens",
    ],
    outcomes: [
      "An interactive catalog UX that feels responsive without needing a database",
      "Persistent visitor feedback (comments) that survives reloads",
      "A complete showcase of consuming a public API and building a small SPA-like experience",
    ],
    technology:
      "Next.js 15, React 19, TypeScript, Zod, React Hook Form, Plain CSS, localStorage, ESLint",
    github: "https://github.com/Princewill-Nanakumor/Motorlane-showroom.git",
    link: "https://motorlane-showroom.netlify.app",
    linkLabel: "Live Demo",
    year: "2026",
    blogSlug: "motorlane-virtual-car-showroom-nextjs-dummyjson",
    searchTerms: [
      "Motorlane Virtual Car Showroom",
      "car showroom Next.js",
      "DummyJSON vehicle catalog",
      "Next.js 15 App Router DummyJSON",
    ],
  },
  {
    slug: "vin-decoder",
    image: "/vn-decoder.png",
    name: "VIN Decoder",
    summary:
      "Decode vehicle VINs using the NHTSA VPIC API with Zod + React Hook Form validation, plus variable browsing and decode history.",
    builtFor:
      "Drivers and vehicle shoppers who want quick, validated VIN decoding with an easy way to explore decoded variables.",
    problem:
      "VIN decoding apps often lack solid validation and transparency — showing unclear error states or mixing inconsistent results.",
    overview:
      "VIN Decoder is a minimal Next.js app that uses the free NHTSA VPIC API to decode VINs. It validates input with Zod + React Hook Form, shows API Messages and validation errors clearly, and keeps the last 3 decoded VINs in localStorage so users can re-open results quickly.",
    capabilities: [
      "Decode VINs on the home page with Zod + React Hook Form validation",
      "Show API `Message` values and client-side validation errors in the UI",
      "Display only decode results that include both a Variable and a Value",
      "Keep the last 3 decoded VINs in localStorage and reload on click",
      "Browse all vehicle variables at `/variables`",
      "View variable details at `/variables/[id]` (description, type, group)",
      "Responsive layout from about 420px to 1440px (plain CSS)",
    ],
    architecture: [
      "Next.js 15 App Router with client-side routing for interactive flows",
      "NHTSA VPIC API client wrappers for VIN decode and variable browsing",
      "Zod schemas + React Hook Form for strict input validation",
      "localStorage helpers for decode history persistence",
      "Plain CSS UI (no CSS frameworks) for consistent layout control",
    ],
    outcomes: [
      "A small but complete public-API showcase: validate input, decode, display, and persist history",
      "An information-browsing UX that goes beyond a single output by adding variable exploration routes",
    ],
    technology:
      "Next.js 15, TypeScript, React, Zod, React Hook Form, ESLint, NHTSA VPIC API, localStorage, Plain CSS",
    github: "https://github.com/Princewill-Nanakumor/vin-decover.git",
    link: "https://vin-decover.vercel.app",
    linkLabel: "Live Demo",
    year: "2026",
    blogSlug: "vin-decoder-nextjs-zod-nhtsa-vpic",
    searchTerms: [
      "VIN Decoder",
      "NHTSA VPIC API",
      "VIN decode Next.js 15",
      "Zod React Hook Form VIN validation",
    ],
  },
  {
    slug: "helix-ticketing-app",
    image: "/helix_homepage_img.jpg",
    name: "Helix Ticketing App",
    summary:
      "Production-inspired helpdesk with JWT auth, RBAC, soft deletes, Dockerized Postgres, and a layered Vitest/Playwright suite — built with Next.js 16 by Nanakumor Princewill.",
    builtFor:
      "Support teams that need a clean ticket inbox, role-separated admin tools, audit-friendly history, and deployable local infrastructure — not a throwaway CRUD demo.",
    problem:
      "Many portfolio “ticket apps” stop at create/read/update. Real support work needs auth, roles, conversation threads, priorities, safe soft deletes, clear loading/empty states, and a database story that travels with the app (migrations + Docker).",
    overview:
      "Helix Ticketing App is a full-stack helpdesk I built to practice enterprise patterns end to end: JWT sessions, RBAC, ticket conversations, admin console, activity logging, soft deletes, Zod validation, flash toasts, closed-ticket UX, Sentry monitoring, Prisma migrations, and Docker Compose for Postgres 17. It is an original portfolio product by Nanakumor Princewill — not affiliated with other products named Helix.",
    capabilities: [
      "User and admin experiences with separate permissions and ownership-aware ticket queues",
      "Ticket creation, priorities, threaded comments, activity history, and close flows",
      "Closed tickets visually muted (strikethrough / faded) with replies disabled",
      "Admin console for users with soft-delete that reassigns tickets instead of erasing history",
      "Flash toasts, confirm modals, loading spinners, and empty states across key flows",
      "Docker Compose + Prisma migrations for a reproducible Postgres setup",
    ],
    architecture: [
      "Next.js 16 App Router with Server Actions (no separate REST API) and Zod at every mutation edge",
      "PostgreSQL 17 + Prisma 7 as the relational source of truth, with versioned SQL migrations",
      "JWT httpOnly sessions (jose) + bcrypt hashing, login rate limits, and soft-delete-aware session checks",
      "Sentry for runtime visibility; Vitest unit/integration + Playwright E2E with axe a11y",
      "Optional Docker image + Compose stack for app + Postgres local/demo environments",
    ],
    outcomes: [
      "A deployable support product shape — auth, RBAC, conversations, admin tooling, and polish UX in one stack",
      "Clear separation between end-user ticket work and operator administration",
      "Data-safety habits (soft deletes + activity logging + migrations) baked into the domain model",
      "Documented layered tests and a public GitHub repo for walkthroughs and code review",
    ],
    technology:
      "Next.js 16, React 19, TypeScript, PostgreSQL, Prisma, Tailwind CSS v4, JWT (jose), bcrypt, Zod, Sentry, Docker, Vitest, Playwright",
    github: "https://github.com/Princewill-Nanakumor/ticketing_app",
    link: "https://hilex-ticketing-app.netlify.app",
    year: "2026",
    blogSlug: "helix-ticketing-app-nextjs-postgresql-prisma-jwt",
    blogLabel: "Read Blog",
    searchTerms: [
      "Helix Ticketing App Nanakumor Princewill",
      "Next.js helpdesk",
      "Next.js ticketing app",
      "PostgreSQL Prisma JWT ticketing",
      "Docker Compose Next.js ticketing",
      "customer support platform Next.js 16",
    ],
  },
  {
    slug: "counter-strike-2-demo-analyzer",
    image: "/counter-strike-2-pc-mac-game-steam-cover.jpg",
    name: "Counter Strike 2 Demo Analyzer",
    summary:
      "CLI-style Node.js tool that parses CS2 demos, ranks high-impact deaths, and emits JSON for coaching and replay pipelines.",
    builtFor:
      "Coaching / analytics pipelines that need ranked “surprise death” candidates from raw `.dem` files — ready for replay review or downstream AI tooling.",
    problem:
      "CS2 demos store match state as ticks, not video. Finding deaths where the victim never oriented toward the attacker means extracting events, reconstructing spatial context, and scoring candidates — then exporting clip-friendly boundaries instead of a single death tick.",
    overview:
      "A TypeScript Node.js analyzer that turns Counter-Strike 2 demos into ranked JSON. It parses deaths and tick snapshots, scores awareness-oriented signals (view angle vs killer direction, recent mouse movement), and outputs start/death/end tick windows so replays and coaching tools can jump to useful clips.",
    capabilities: [
      "Ingests CS2 `.dem` files and extracts death events plus per-tick player props",
      "Scores candidates using view-angle gap and recent yaw movement",
      "Ranks high-impact moments for manual review or automation",
      "Emits structured JSON with victim, killer, weapon, and score fields",
      "Adds pre/post roll tick windows so clips don’t start on an already-dead frame",
    ],
    architecture: [
      "@laihoe/demoparser2 for event + tick extraction (deaths, position, pitch/yaw)",
      "Offline scoring pass over death windows (~128 ticks of mouse/view context)",
      "Tick math at ~64 ticks/second for clip boundary generation",
      "CLI-friendly TypeScript pipeline — no UI dependency; JSON is the product",
    ],
    outcomes: [
      "End-to-end path from raw demo → ranked candidates → replay validation workflow",
      "Clip metadata that is render-friendly (`startTick` / `tick` / `endTick`)",
      "Reusable analytics pattern: parse events, score spatial signals, export for humans or AI",
      "Public repo documenting the pipeline for technical review",
    ],
    technology:
      "Node.js, TypeScript, @laihoe/demoparser2, Counter-Strike 2 Demo Parser",
    github: "https://github.com/Princewill-Nanakumor/-cs2-demo-analyzer",
    year: "2026",
    blogSlug:
      "building-a-counter-strike-2-demo-analyzer-with-node-js-and-typescript",
    searchTerms: [
      "CS2 demo analyzer",
      "Counter-Strike 2 demoparser TypeScript",
      "game analytics pipeline Node.js",
    ],
  },
  {
    slug: "aws-s3bucket-image-upload-app",
    image: "/aws_image_upload_app.jpg",
    name: "AWS S3 Image Upload App",
    summary:
      "Password-gated image gallery with direct S3 uploads via presigned URLs, server fallback with magic-byte validation, cursor pagination, and signed downloads.",
    builtFor:
      "Anyone who needs a small, secure image gallery where browsing can stay public, but uploads and deletes stay behind a password — and large files skip the Node process when possible.",
    problem:
      "Routing every upload through an app server wastes bandwidth and hits timeouts. Public demos also need a simple access gate, brute-force protection, and validation that doesn’t trust browser MIME types alone.",
    overview:
      "A Next.js 16 gallery focused on cloud storage patterns: browsers upload to S3 with short-lived presigned URLs, an authenticated multipart fallback sniffs file bytes with file-type, and downloads use signed URLs or an optional CDN. A shared password unlocks mutations with HMAC sessions and a 2-attempt / 5-hour lockout. Cursor pagination keeps browsing efficient without dumping the whole bucket into one response.",
    capabilities: [
      "Password-gated uploads with HMAC-signed HttpOnly session cookies (7-day TTL)",
      "Dual-layer brute-force lockout: 2 failed attempts → 5-hour device lock",
      "Direct browser → S3 PUT via 5-minute presigned upload URLs",
      "Authenticated multipart fallback with magic-byte validation (file-type) when direct upload fails",
      "Public gallery listing under uploads/ with cursor pagination (default 12, max 30)",
      "15-minute signed download URLs, or optional CDN URLs via AWS_S3_CDN_URL",
      "Authenticated delete with confirm modal; keys restricted to uploads/ prefix",
      "Full-size preview lightbox with prev/next over loaded pages",
    ],
    architecture: [
      "Next.js 16 App Router + React 19; AWS SDK v3 S3Client + s3-request-presigner",
      "Auth module: APP_ACCESS_PASSWORD, HMAC tokens, requireAuth on mutating routes",
      "Upload pipeline: POST /api/upload (presign) → client PUT; fallback POST /api/upload/fallback",
      "Read path: GET /api/files lists uploads/ and mints GetObject URLs (or CDN) without auth",
      "Validation: 5MB cap; jpg/png/webp/gif/avif; fallback sniffs bytes before PutObject",
      "Object keys: uploads/{timestamp}-{uuid}-{sanitizedName}",
    ],
    outcomes: [
      "Demonstrates production-minded S3 access patterns (presign, validate, signed read, fallback)",
      "Keeps large binary traffic off the Node process when the direct path succeeds",
      "Shows public-read / private-write asymmetry with a lightweight password gate",
      "Deployed Netlify demo with public source for review",
    ],
    technology:
      "React, TypeScript, Next.js 16 (App Router), Tailwind CSS 4, AWS S3, AWS SDK for JavaScript (v3), file-type, S3 Presigned URLs, Netlify",
    github: "https://github.com/Princewill-Nanakumor/aws_s3bucket_image_upload",
    link: "https://s3imageupload.netlify.app",
    year: "2026",
    blogSlug:
      "building-a-production-ready-aws-s3-image-upload-system-with-next-js-16-and-typescript",
  },
  {
    slug: "kyiv-electricity-survey-app",
    image: "/kyiv-electricity-survey.jpg",
    name: "Kyiv Electricity Survey App",
    summary:
      "Multi-step survey collecting Kyiv electricity availability, with responses delivered live via Telegram.",
    builtFor:
      "Organizers who need structured field responses about electricity availability — delivered into a chat they already monitor, without standing up a heavy ops dashboard.",
    problem:
      "Collecting civic status updates over ad-hoc messages is messy. Teams need a guided mobile form, validated answers, and instant delivery into a channel staff already use.",
    overview:
      "A guided multi-step survey for Kyiv electricity availability. Residents complete a carousel-style form; validated payloads are forwarded through a Telegram bot so organizers see structured updates in near real time.",
    capabilities: [
      "Multi-step / carousel survey flow optimized for phones",
      "Zod-validated answers before anything is sent",
      "Telegram Bot API delivery into an organizer chat",
      "Low-friction participation — no account required for respondents",
      "Clear success/error states so users know the report landed",
    ],
    architecture: [
      "Next.js front end with typed form state and Zod schemas",
      "Server route that formats the payload and calls Telegram’s Bot API",
      "Minimal ops surface: chat as the inbox, web form as the collector",
    ],
    outcomes: [
      "Shows how a thin web app + messaging API can replace spreadsheet field collection",
      "Structured responses instead of free-form chat noise",
      "Live Netlify deployment for demos and field testing",
    ],
    technology:
      "React, TypeScript, Next.js, Tailwind CSS, Telegram Bot API, Zod",
    github:
      "https://github.com/Princewill-Nanakumor/MultipleStepForm_TelegramBot",
    link: "https://electricysurverybot.netlify.app/",
    year: "2026",
    blogSlug:
      "kyiv-electricity-availability-survey-multi-step-form-with-telegram-integration",
  },
  {
    slug: "motherland-crm-solutions",
    image: "/crm.png",
    name: "Motherland CRM Solutions",
    summary:
      "Multi-tenant SaaS CRM for high-volume sales teams — import, assign, collaborate in realtime, with sub-admin permissions, board analytics, and dialer call logs.",
    builtFor:
      "Sales-driven teams stuck in Excel/Google Sheets who need import → assign → work → track, with admins, sub-admins, and agents seeing different surfaces of the same workspace.",
    problem:
      "Spreadsheets don’t show live lead status, can’t safely share ownership across a team, and collapse under volume. Teams need workspace isolation, granular RBAC, bulk import/export, dialer-aware call history, and realtime updates without building five separate tools.",
    overview:
      "Motherland CRM Solutions is a multi-tenant SaaS CRM I designed and shipped: admins import and assign leads, sub-admins get opt-in permissions, agents work assigned queues, and everyone stays in sync over Ably. Board status charts, softphone call logs, seasonal holiday animations, host-based branding, reminders, billing, and a Vitest/Playwright suite sit on a Next.js + MongoDB stack aimed at real sales throughput — live at motherlandcrmsolutions.com.",
    capabilities: [
      "CSV/Excel import with fuzzy header mapping, validation, preview, batch insert, and export",
      "ADMIN / SUBADMIN / AGENT roles — sub-admins get grantable permissions (assign, status, reminders, comments)",
      "Admin vs agent dashboards with server-side pagination and include/exclude multi-filters",
      "Lead detail panel with status, comments, activity log, reminders, and prev/next navigation",
      "Bulk assign / unassign / status / delete with confirmation modals",
      "Realtime workspace sync (Ably) so lead changes appear across open sessions",
      "Dashboard status-count analytics (Recharts bar/pie from /api/leads/status-counts)",
      "Softphone dialer integration (MicroSIP/Zoiper) with call logs including lead source",
      "Seasonal holiday animations — New Year, Valentine, Women’s Day, St. Patrick, Independence, Halloween, Thanksgiving, Christmas (toggleable, respects reduced motion)",
      "USDT deposit flow (TRC20/ERC20) with operator approve/reject and plan limits",
      "Field masking for phone/email; collapsible sidebar",
      "Host-based multi-brand theming (Motherland + Vertex) with self-hosted brand fonts",
    ],
    architecture: [
      "Shared-DB multi-tenancy: every record scoped by `adminId` (workspace boundary)",
      "Tenant RBAC matrix in roles.ts — ADMIN full access; SUBADMIN via permissions[]; AGENT assigned-only",
      "NextAuth credentials JWTs with hard 24h expiry enforced in token, middleware, and client",
      "TanStack Query for server state; Zustand for panel/selection UI; filters live in the URL",
      "Ably channels per workspace (+ per-open lead) invalidate the right query caches",
      "Holiday effects: date-window rules resolve without loading animation chunks; overlay dynamic-imported + localStorage toggle",
      "MongoDB models/indexes tuned for filtered lead lists, unique email-per-workspace, and imports",
      "Zod + React Hook Form shared validation; dnd-kit column order; Radix dialogs/selects",
      "Layered tests: ~146 Vitest + Playwright smoke/lifecycle; CI on Node 22; optional Vercel Speed Insights",
    ],
    outcomes: [
      "Production CRM covering auth, tenancy, realtime, import/export, billing, dialer logs, and RBAC",
      "Sub-admin model that extends agent capacity without creating a second workspace owner",
      "Tables that stay fast under large lead counts via server pagination + compound indexes",
      "Automated regression coverage and a live product URL for demos",
    ],
    technology:
      "Next.js 15, React 19, TypeScript, MongoDB, Mongoose, Tailwind CSS v4, Radix UI, NextAuth, TanStack React Query, TanStack Table, Zustand, Ably, Framer Motion, Recharts, dnd-kit, React Hook Form, Zod, Resend, Vitest, Playwright, Vercel",
    github: "https://github.com/Princewill-Nanakumor/MotherlandCrmSolutions",
    link: "https://motherlandcrmsolutions.com/",
    year: "2026",
    blogSlug:
      "from-spreadsheets-to-a-full-saas-crm-building-motherland-crm-solutions",
    searchTerms: [
      "Motherland CRM Solutions",
      "multi-tenant SaaS CRM Next.js",
      "Ably realtime CRM",
      "lead import Excel CRM",
      "SUBADMIN CRM permissions",
      "Vertex CRM branding",
      "holiday animations CRM dashboard",
    ],
  },
  {
    slug: "my-portfolio",
    image: "/myportfolio.jpg",
    name: "My Portfolio",
    summary:
      "This site — portfolio, SEO blog CMS, project pages, and admin publishing on Next.js + MongoDB.",
    builtFor:
      "My public presence online: recruiters, clients, and crawlers that need fast, readable pages plus a private admin flow to publish.",
    problem:
      "A static brochure site can’t ship long-form posts or unique project URLs well. A CMS without SSR/SEO discipline is invisible. This app had to be both a marketing site and a maintainable publishing system.",
    overview:
      "The portfolio combines a public marketing surface, SSR blog articles, dedicated project pages, and a JWT-protected admin CMS. Posts use structured content blocks, Cloudinary media, and sitemap/JSON-LD so content stays crawlable while the admin experience stays practical for drafting and publishing.",
    capabilities: [
      "Homepage sections for about, skills, projects, blog previews, and contact",
      "SSR blog list + article pages with semantic HTML for SEO",
      "Admin CMS: drafts, publish, content blocks, tags, categories",
      "Cloudinary uploads for images and video embeds",
      "Per-project detail routes with unique metadata",
      "Contact form email delivery via Nodemailer",
      "Theme/layout preferences for reading comfort",
    ],
    architecture: [
      "Next.js App Router: server components for crawlable content, client islands for interactivity",
      "MongoDB + Mongoose for posts; static TypeScript data for featured projects",
      "JWT cookie auth + middleware for `/admin` subpaths",
      "Dynamic sitemap/robots; Person / WebSite / BlogPosting JSON-LD",
      "Vercel deployment with Speed Insights instrumentation",
    ],
    outcomes: [
      "One codebase for portfolio, blog SEO, and CMS publishing",
      "Project and article URLs that are shareable and indexable",
      "Admin workflow that doesn’t require redeploying to ship a post",
    ],
    technology:
      "Next.js, React, TypeScript, Tailwind CSS, Framer Motion, MongoDB, Mongoose, Cloudinary, Vercel",
    github: "https://github.com/Princewill-Nanakumor/MyPortfolio",
    link: "https://princewillnanakumor.com/",
    year: "2023",
    blogSlug:
      "building-a-modern-portfolio-website-with-next-js-and-blog-system",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getProjectImageUrl(project: Project): string {
  if (project.image.startsWith("http")) return project.image;
  return `${SITE_URL}${project.image}`;
}

/** Comma-separated tech string → chips */
export function getProjectTechList(project: Project): string[] {
  return project.technology
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}
