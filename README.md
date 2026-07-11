# MyPortfolio — princewillnanakumor.com

Personal portfolio + blog CMS for **Nanakumor Princewill** (Next.js developer).

Live site: [princewillnanakumor.com](https://princewillnanakumor.com)  
Repo: [Princewill-Nanakumor/MyPortfolio](https://github.com/Princewill-Nanakumor/MyPortfolio)

## What this project is

A Next.js 15 App Router site with:

- Public portfolio (hero, about, skills, projects, contact)
- SEO-focused blog (`/blog`, `/blog/[slug]`) with server-rendered article HTML
- Dedicated project pages (`/projects`, `/projects/[slug]`)
- Admin CMS (`/admin`) to draft/publish posts, upload images/videos
- MongoDB (Mongoose) for posts; Cloudinary for media; Nodemailer for contact

## Tech stack

| Layer        | Choice                                           |
| ------------ | ------------------------------------------------ |
| Framework    | Next.js 15 (App Router), React 18, TypeScript    |
| Styling      | Tailwind CSS, Framer Motion                      |
| Data         | MongoDB + Mongoose                               |
| Auth (admin) | JWT + bcrypt (`middleware.ts` protects `/admin`) |
| Media        | Cloudinary                                       |
| Email        | Nodemailer                                       |
| Deploy       | Vercel                                           |

## Quick start

```bash
npm install
# create .env from the keys listed below
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run typecheck
npm run lint
npm run build
```

## Environment variables

Do **not** commit `.env`. Typical keys (confirm exact names in `src/app/api/**` and DB helpers):

## Repository map

```
src/
  app/                 # Routes (App Router)
    page.tsx           # Homepage (SSR posts for blog section)
    blog/              # Blog index + [slug] (SSR + metadata + JSON-LD)
    projects/          # Project index + [slug]
    admin/             # CMS UI (auth-gated)
    api/               # REST handlers (blog, admin auth, upload, contact)
    robots.ts          # robots.txt
    sitemap.ts         # Dynamic sitemap
  components/          # UI (hero, about, blog, admin forms, etc.)
  data/projects.ts     # Static featured projects + slugs
  lib/                 # blogData.ts, seo.ts (server helpers)
  models/              # Mongoose schemas (blog posts)
  db/                  # Mongo connection
  types/               # Shared TS types
middleware.ts          # Protects admin routes
```

## Important product routes

| URL                                      | Purpose                         |
| ---------------------------------------- | ------------------------------- |
| `/`                                      | Portfolio homepage              |
| `/blog`                                  | Published posts list            |
| `/blog/[slug]`                           | Article (SSR body for crawlers) |
| `/projects`                              | Projects index                  |
| `/projects/[slug]`                       | Project detail + SEO            |
| `/admin`                                 | Blog CMS (login required)       |
| `/api/blog`                              | CRUD / list posts               |
| `/api/admin/*`                           | Auth verify / logout            |
| `/api/contact`                           | Contact form                    |
| `/api/upload-image`, `/api/upload-video` | Media uploads                   |

## SEO / crawlability notes

- Blog posts and homepage blog cards are server-fetched (`src/lib/blogData.ts`).
- Article body uses semantic `h1`/`h2`/`h3`/`p` via `BlogArticleBody` (no `opacity: 0` on text).
- `robots.ts` allows major crawlers; disallows `/admin` and `/api/`.
- `sitemap.ts` includes home, blog, projects, and published posts.
- JSON-LD: Person/WebSite sitewide; BlogPosting + breadcrumbs on posts; CreativeWork on projects.

## Blog content model

Posts store structured `content` blocks (`h1`, `h2`, `h3`, `paragraph`, `code`, `list`, `image`, `video`) — see `src/types/Blog.ts` and the admin `BlogPostForm`.

Only **published** posts appear on the public site and in the sitemap.

## For AI / code reviewers

**[AGENTS.md](./AGENTS.md)** is the full map: how requests flow, every page/API, every component, content blocks, auth, and edit conventions.

When asking an AI to review this repo, paste or attach:

1. This README + **all of** `AGENTS.md`
2. The specific files/PR diff under review
3. A scoped question (e.g. “review SEO on `/blog/[slug]`” or “find draft/publish bugs”)

A bare GitHub link alone often fails if the tool cannot clone the repo or only sees a short README.
