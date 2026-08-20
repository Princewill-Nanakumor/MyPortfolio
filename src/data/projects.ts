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
      "Production-inspired customer support platform with tickets, roles, and admin tooling — built with Next.js 16 and PostgreSQL by Nanakumor Princewill.",
    builtFor:
      "Support teams that need a clean ticket inbox, role-separated admin tools, and audit-friendly history — not a throwaway CRUD demo.",
    problem:
      "Many portfolio “ticket apps” stop at create/read/update. Real support work needs auth, roles, conversation threads, priorities, and safe data handling when records should disappear from day-to-day views without hard-deleting history.",
    overview:
      "Helix Ticketing App is a full-stack helpdesk I built to practice enterprise patterns end to end: JWT auth, RBAC, ticket conversations, admin console, activity logging, soft deletes, validation, and production monitoring. It is an original portfolio product by Nanakumor Princewill — not affiliated with other products named Helix.",
    capabilities: [
      "User and admin experiences with separate permissions",
      "Ticket creation, status/priority updates, and threaded discussion",
      "Admin console for users, tickets, and system activity",
      "Soft-delete flows so records can leave active queues without vanishing from audit context",
      "Responsive UI for everyday support work on desktop and mobile",
    ],
    architecture: [
      "Next.js App Router app with typed API handlers and Zod validation at the edges",
      "PostgreSQL + Prisma as the relational source of truth for users, tickets, and logs",
      "JWT sessions with bcrypt password hashing and role checks on protected routes",
      "Sentry wired for runtime error visibility in deployed environments",
    ],
    outcomes: [
      "A deployable support product shape — auth, RBAC, conversations, and admin tooling in one stack",
      "Clear separation between end-user ticket work and operator administration",
      "Data-safety habits (soft deletes + activity logging) baked into the domain model",
      "Live demo and public GitHub repo for walkthroughs and code review",
    ],
    technology:
      "Next.js 16, React 19, TypeScript, PostgreSQL, Prisma, Tailwind CSS, JWT, bcrypt, Zod, Sentry",
    github: "https://github.com/Princewill-Nanakumor/ticketing_app",
    link: "https://hilex-ticketing-app.netlify.app",
    year: "2026",
    searchTerms: [
      "Helix Ticketing App Nanakumor Princewill",
      "Next.js helpdesk",
      "Next.js ticketing app",
      "PostgreSQL Prisma JWT ticketing",
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
      "Image gallery app with direct S3 uploads via presigned URLs, validation, pagination, and signed downloads.",
    builtFor:
      "Anyone who needs a small, secure image gallery where the browser talks to S3 directly and the app server stays out of the heavy upload path.",
    problem:
      "Routing every upload through an app server wastes bandwidth and hits timeouts on larger files. Galleries also need controlled downloads and pagination that still feel snappy as object counts grow.",
    overview:
      "A Next.js gallery focused on cloud storage patterns: browsers upload to S3 with short-lived presigned URLs, the API validates file types, and downloads use signed URLs. Cursor pagination keeps browsing efficient without dumping the whole bucket into one response.",
    capabilities: [
      "Direct browser → S3 uploads through presigned URLs",
      "Server-side fallback upload path when the direct path is unavailable",
      "File-type validation before objects are accepted",
      "Cursor-based gallery pagination for larger libraries",
      "Signed download URLs for time-bounded access",
      "Responsive gallery UI on the App Router",
    ],
    architecture: [
      "Next.js 16 API routes mint presigned upload/download URLs via AWS SDK v3",
      "Client uploads straight to the bucket; metadata stays app-controlled",
      "Validation layer (including file-type checks) before trusting objects",
      "Cursor pagination over listing results for scalable browsing",
    ],
    outcomes: [
      "Demonstrates production-minded S3 access patterns (presign, validate, signed read)",
      "Keeps large binary traffic off the Node process when possible",
      "Deployed gallery demo with public source for review",
    ],
    technology:
      "React, TypeScript, Next.js 16 (App Router), Tailwind CSS 4, AWS S3, AWS SDK for JavaScript (v3), file-type, S3 Presigned URLs, Vercel",
    github: "https://github.com/Princewill-Nanakumor/aws_s3bucket_image_upload",
    link: "https://s3imageupload.netlify.app",
    year: "2026",
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
  },
  {
    slug: "motherland-crm-solutions",
    image: "/crm.jpg",
    name: "Motherland CRM Solutions",
    summary:
      "Multi-tenant SaaS CRM for high-volume lead sales teams — import, assign, collaborate, and track performance in real time.",
    builtFor:
      "Sales-driven teams stuck in Excel/Google Sheets who need import → assign → work → track, with admins and agents seeing different surfaces of the same workspace.",
    problem:
      "Spreadsheets don’t show live lead status, can’t safely share ownership across a team, and collapse under volume. Teams need workspace isolation, role-based views, bulk import, and realtime updates without building five separate tools.",
    overview:
      "Motherland CRM Solutions is a multi-tenant SaaS CRM I designed and shipped: admins import and assign leads, agents work assigned queues, and everyone stays in sync over Ably. Billing, subscriptions, notifications, and field-level permissions sit on a Next.js + MongoDB stack aimed at real sales throughput — live at motherlandcrmsolutions.com.",
    capabilities: [
      "CSV/Excel import with fuzzy header mapping, validation, preview, and batch insert",
      "Admin vs agent dashboards (all leads vs assigned-only) with server-side pagination",
      "Lead detail panel with status, comments, activity log, and prev/next navigation",
      "Bulk assign / status / delete with sticky selection UX",
      "Realtime workspace sync so lead changes appear across open sessions",
      "USDT deposit flow (TRC20/ERC20) with operator approve/reject and plan limits",
      "Field masking for phone/email when agents lack permission",
      "Reminders and notification center for follow-ups and system events",
    ],
    architecture: [
      "Shared-DB multi-tenancy: every record scoped by `adminId` (workspace boundary)",
      "NextAuth credentials JWTs with hard 24h expiry enforced in token, middleware, and client",
      "TanStack Query for server state; Zustand for panel/selection UI; filters live in the URL",
      "Ably channels per workspace (+ per-open lead) invalidate the right query caches",
      "MongoDB models/indexes tuned for filtered lead lists, unique email-per-workspace, and imports",
      "Zod + React Hook Form shared validation; dnd-kit column order persisted per user",
    ],
    outcomes: [
      "Production CRM covering auth, tenancy, realtime, import, billing, and RBAC in one product",
      "Import path that turns spreadsheet chaos into queryable, assignable leads",
      "Tables that stay fast under large lead counts via server pagination + compound indexes",
      "Live product URL for demos; deep engineering write-up available separately on the blog",
    ],
    technology:
      "Next.js 15, React 19, TypeScript, MongoDB, Mongoose, Tailwind CSS v4, NextAuth, TanStack React Query, Zustand, Ably, Framer Motion, TanStack Table, dnd-kit, React Hook Form, Zod, Resend, Netlify",
    github: "https://github.com/Princewill-Nanakumor/MotherlandCrmSolutions",
    link: "https://motherlandcrmsolutions.com/",
    year: "2025",
    searchTerms: [
      "Motherland CRM Solutions",
      "multi-tenant SaaS CRM Next.js",
      "Ably realtime CRM",
      "lead import Excel CRM",
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
