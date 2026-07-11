# AGENTS.md — how this app works (AI + human map)

This is the deep guide for **MyPortfolio** (`princewillnanakumor.com`).  
Start here before changing code. High-level overview also lives in `README.md`.

---

## 1. What the product is

A **Next.js 15 App Router** personal site with three surfaces:

1. **Public portfolio** — homepage sections (hero → about → skills → projects → blog previews → contact)
2. **Public blog + project SEO pages** — server-rendered HTML for crawlers
3. **Admin CMS** — password login, create/edit/publish posts, Cloudinary uploads

Data for blog posts lives in **MongoDB** (Mongoose). Featured projects are **static TypeScript** in `src/data/projects.ts` (not the DB).

---

## 2. Runtime & stack

| Concern | Implementation |
| --- | --- |
| Framework | Next.js 15, React 18, TypeScript |
| Routing | App Router under `src/app/` |
| Styling | Tailwind + `globals.css` utility classes; Framer Motion for motion |
| DB | MongoDB via `src/db/mongodb.ts` + models in `src/models/` |
| Admin auth | JWT cookie `adminToken`; bcrypt on login; `middleware.ts` for `/admin/*` subpaths |
| Media | Cloudinary (`upload-image`, `upload-video` APIs + `src/utils/cloudinaryUpload.ts`) |
| Email | Nodemailer (`src/nodemailer/nodemailer.ts`) via `/api/contact` |
| Deploy | Vercel |

Scripts: `npm run dev` · `typecheck` · `lint` · `build`

---

## 3. How requests flow

```
Browser
  ├─ Public pages  → Server Components fetch data (blogData / projects)
  │                    └─ Client islands for interactivity (likes, forms, motion)
  ├─ /admin        → Client page + useAdminPageController
  │                    └─ blogService → /api/blog* (cookie auth on mutations)
  └─ /api/*        → Route handlers → Mongo / Cloudinary / email
```

**SEO rule:** Anything users/crawlers must read (titles, headings, paragraphs on blog + marketing sections) should be in the **initial HTML**. Do not wrap that text in Framer Motion `opacity: 0`. Blog article body is rendered by server component `BlogArticleBody` and passed into the client shell as `children`.

---

## 4. End-to-end feature flows

### 4.1 Homepage

1. `src/app/page.tsx` (Server) calls `getPublishedPosts()`, takes first 3.
2. Renders: `Hero` → `About` → `Skills` → `Projects` → `BlogSection posts={…}` → `Contact`.
3. `AOSInit` loads AOS (no `data-aos` attrs currently; mostly unused).
4. Root `layout.tsx` wraps all pages with Navbar, fonts, ToastProvider, CustomCursor, Person/WebSite JSON-LD.

### 4.2 Blog list

1. `src/app/blog/page.tsx` (Server) fetches published posts + metadata + Blog JSON-LD.
2. Renders static `h1` + passes posts to `BlogListClient` (category filter + cards).

### 4.3 Blog post (critical SEO path)

1. `src/app/blog/[slug]/page.tsx` (Server):
   - `getPostBySlug(slug)` from `src/lib/blogData.ts`
   - `generateMetadata` (title, description, OG, canonical, robots)
   - BlogPosting + Breadcrumb JSON-LD
2. Passes post into `BlogPostClient` **with children** = `<BlogArticleBody post={post} omitTitle />`.
3. `BlogPostClient` (Client): likes, share, design/layout switcher (localStorage), wraps `BlogPostLayout`.
4. `BlogPostLayout` → `BlogHeader` (page `h1` = title) + `BlogContent` (renders server `children` or falls back to `BlogArticleBody`).
5. Content blocks (`h1`/`h2`/`h3`/`paragraph`/…) come from Mongo `content[]` and render as real HTML tags in `BlogArticleBody`.

### 4.4 Projects

- Source of truth: `src/data/projects.ts` (`slug`, name, description, tech, github, optional live `link`, year, image).
- Homepage section: `Projects.tsx` links to `/projects/[slug]`.
- `/projects` + `/projects/[slug]`: full SSR pages with unique metadata + JSON-LD.
- Sitemap includes each project URL.

### 4.5 Admin CMS

1. `src/app/admin/page.tsx` is fully client-driven via `useAdminPageController`.
2. Login UI: `AdminAuthCard` / `AdminLoginForm` → `POST /api/admin/auth` → sets `adminToken` cookie.
3. Middleware matcher is `/admin/:path*` (subpaths). `/admin` itself is the login/dashboard entry; authenticated UI loads posts via `blogService`.
4. Create/edit: modal (`AdminPostFormModal`) → `BlogPostForm` + block editors → `POST`/`PUT` `/api/blog`.
5. Publish vs draft: `published` boolean on the model. Public site and sitemap only use `published: true`.
6. Slug behavior (important): avoid auto-rewriting slug on every title edit; draft saves should preserve existing slugs (see form + API). Lookup uses `src/utils/blogQueries.ts`.

### 4.6 Contact

1. `Contact.tsx` submits to `/api/contact`.
2. API validates, may persist via contact model, sends mail through Nodemailer.
3. Success UX may route to `/success`.

### 4.7 Likes

- `BlogPostClient` → `POST`/`DELETE` `/api/blog/[id]/like`.
- Liked IDs also mirrored in `localStorage` (`likedPosts`) for UI state.

---

## 5. Directory tree (mental model)

```
middleware.ts              # JWT gate for /admin/:path*
src/
  app/                     # Routes only (pages + API + SEO files)
  components/              # UI by feature folder
  lib/                     # Server-safe helpers (blog fetch, SEO JSON-LD)
  services/                # Client HTTP wrappers (blogService)
  hooks/                   # Client hooks (admin controller)
  models/                  # Mongoose schemas
  db/                      # connectDB
  data/                    # Static content (projects)
  types/                   # Shared TS types
  constants/               # Blog categories, etc.
  utils/                   # Slug queries, Cloudinary, video URL helpers
  context/                 # React context (toasts)
  nodemailer/              # Email transport
  hooks / services …       # as above
```

---

## 6. Pages (`src/app/**/page.tsx`)

| File | URL | Role |
| --- | --- | --- |
| `app/page.tsx` | `/` | Homepage; SSR recent posts into `BlogSection` |
| `app/blog/page.tsx` | `/blog` | Blog index; SSR list + JSON-LD; client filter grid |
| `app/blog/[slug]/page.tsx` | `/blog/[slug]` | Article SSR metadata + `BlogArticleBody` children |
| `app/projects/page.tsx` | `/projects` | Projects index (static data) |
| `app/projects/[slug]/page.tsx` | `/projects/[slug]` | Project detail + CreativeWork JSON-LD |
| `app/admin/page.tsx` | `/admin` | CMS login + dashboard (client) |
| `app/success/page.tsx` | `/success` | Post-contact thank-you |
| `app/not-found.tsx` | any 404 | Custom not-found UI |
| `app/layout.tsx` | all | Root shell: fonts, Navbar, toasts, site JSON-LD |
| `app/robots.ts` | `/robots.txt` | Allow crawlers; disallow `/admin`, `/api/` |
| `app/sitemap.ts` | `/sitemap.xml` | Home, blog, projects, published posts |

### Client route helpers (not pages, but co-located)

| File | Used by | Role |
| --- | --- | --- |
| `app/blog/BlogListClient.tsx` | `/blog` | Category chips + post cards |
| `app/blog/[slug]/BlogPostClient.tsx` | `/blog/[slug]` | Likes, share, design switcher, layout shell |

---

## 7. API routes (`src/app/api/**/route.ts`)

| Route | Methods (typical) | Role |
| --- | --- | --- |
| `/api/blog` | GET, POST | List/create posts (filters; create needs auth) |
| `/api/blog/[id]` | GET, PUT, DELETE | Read/update/delete by id or slug-aware id |
| `/api/blog/[id]/like` | POST, DELETE | Increment/decrement likes |
| `/api/admin/auth` | POST | Login → JWT cookie |
| `/api/admin/verify` | GET | Check session |
| `/api/admin/logout` | POST | Clear cookie |
| `/api/contact` | POST | Contact form + email |
| `/api/upload-image` | POST | Cloudinary image upload |
| `/api/upload-video` | POST | Cloudinary video upload |

Client access for blog CRUD goes through **`src/services/blogService.ts`** (not raw `fetch` scattered everywhere in admin).

---

## 8. Components catalog

### 8.1 Portfolio sections

| Component | Role |
| --- | --- |
| `hero/Hero.tsx` | Landing hero; typewriter name; CTA; crawlable `h1`/`h2`/paragraph |
| `about/About.tsx` | About copy + image slider |
| `skills/Skills.tsx` | Tech stack icon grid |
| `projects/Projects.tsx` | Featured projects on homepage; links to `/projects/[slug]` |
| `blog/BlogSection.tsx` | “Latest Blog Posts” cards on homepage (receives `posts` prop) |
| `contact/Contact.tsx` | Contact form UI |
| `navbar/Navbar.tsx` | Site navigation (root layout) |

### 8.2 Blog reading experience

| Component | Role |
| --- | --- |
| `blog/BlogArticleBody.tsx` | **Server** semantic HTML for content blocks (crawlable) |
| `blog/BlogContent.tsx` | Client wrapper: mounts article body + share footer |
| `blog/BlogHeader.tsx` | Category, **page `h1` title**, meta, like/share, featured image |
| `blog/BlogPostLayout.tsx` | Layout modes: default / magazine / split (+ sidebar) |
| `blog/DesignConfig.tsx` | Design theme + layout option definitions |
| `blog/DesignSwitcher.tsx` | Floating UI to change theme/layout (localStorage) |
| `blog/VideoEmbed.tsx` | YouTube/etc embeds from block `videoUrl` |
| `blog/MessageModal.tsx` | Simple message modal (e.g. “link copied”) |
| `blog/RelatedPosts.tsx` | Related posts grid (if wired) |
| `blog/BlogPostHeader.tsx` | Older/alternate header (prefer `BlogHeader` on current path) |
| `blog/BlogPostFooter.tsx` | Older/alternate footer |

### 8.3 Admin CMS UI

| Component | Role |
| --- | --- |
| `admin/page/AdminPageShell.tsx` | Outer admin page chrome |
| `admin/page/AdminAuthCard.tsx` | Auth card wrapper |
| `admin/page/AdminLoginForm.tsx` | Username/password form |
| `admin/page/AdminLoadingState.tsx` | Loading spinner/state |
| `admin/page/AdminLockedNotice.tsx` | Lockout / locked notice |
| `admin/page/AdminDashboardContent.tsx` | Post list + filters + actions |
| `admin/page/AdminPostFormModal.tsx` | Modal hosting create/edit form |
| `admin/AdminHeader.tsx` | Dashboard header |
| `admin/AdminContent.tsx` | Main content region |
| `admin/AdminActionBar.tsx` | Action buttons bar |
| `admin/BlogPostList.tsx` | List of posts in admin |
| `admin/BlogPostForm.tsx` | Full create/edit form orchestration |
| `admin/BlogPostBasicInfo.tsx` | Title, slug, excerpt, image, category, read time |
| `admin/BlogPostContentBuilder.tsx` | Content-blocks section of the form |
| `admin/BlogPostNavigation.tsx` | Step / section navigation in form |
| `admin/BlogPostProgressBar.tsx` | Form progress indicator |
| `admin/BlogPostTagManager.tsx` | Tags UI |
| `admin/BlogPostPreview.tsx` | Live preview of draft |
| `admin/ContentBlockEditor.tsx` | Edit a single block (text/image/video/…) |
| `admin/ContentBlockList.tsx` | Sortable list (dnd-kit) + search + reorder |
| `admin/ContentBlockPreview.tsx` | Compact block preview (drag overlay) |

### 8.4 Shared / common

| Component | Role |
| --- | --- |
| `common/SocialLinks.tsx` | Social icon links |
| `common/ScrollToTop.tsx` | Scroll-to-top control |
| `common/CustomCursor.tsx` | Custom cursor (layout) |
| `common/Toast.tsx` | Single toast |
| `common/ToastContainer.tsx` | Toast stack |
| `common/AOSInit.tsx` | Initializes AOS library on homepage |

---

## 9. Lib, models, services, utils

| File | Role |
| --- | --- |
| `lib/blogData.ts` | Server: `getPublishedPosts`, `getPostBySlug`, serialize Mongo → `BlogPost` |
| `lib/seo.ts` | `SITE_URL`, `SITE_NAME`, OG defaults, Person/WebSite/breadcrumb helpers |
| `models/blogPost.ts` | Mongoose schema: title, slug, excerpt, content[], image, category, tags, published, likes |
| `models/contact.ts` | Contact submissions schema (if used by API) |
| `db/mongodb.ts` | `connectDB()` singleton-style connection |
| `services/blogService.ts` | Browser client for `/api/blog*` used by admin |
| `hooks/useAdminPageController.ts` | All admin page state: auth, filters, CRUD, draft preview |
| `data/projects.ts` | Static project list + `getProjectBySlug` helpers |
| `types/Blog.ts` | `BlogPost`, `ContentBlock`, filters, API response types |
| `constants/blog.ts` | `BLOG_CATEGORIES` (includes Cloud Engineering, etc.) |
| `utils/blogQueries.ts` | Slug/id decoding, regex escape, ObjectId checks |
| `utils/cloudinaryUpload.ts` | Upload helpers |
| `utils/videoUtils.ts` | Detect YouTube/etc + embed URLs |
| `utils/contentBlockSearch.ts` | Search/filter blocks in admin list |
| `context/ToastContext.tsx` | Global toast API |
| `nodemailer/nodemailer.ts` | Mail transport setup |

---

## 10. Content block model

Each post `content` is an array of blocks:

```ts
type: "h1" | "h2" | "h3" | "paragraph" | "code" | "list" | "image" | "video"
text?: string
items?: string[]      // lists
imageUrl?: string     // images
videoUrl?: string     // videos
```

- Authored in admin via `ContentBlockList` / `ContentBlockEditor`.
- Rendered publicly by `BlogArticleBody` as real `<h1>`…`<p>` (and media).
- Page title remains the main article `h1` in `BlogHeader` when `omitTitle` is used on the body.

---

## 11. Auth & security notes for agents

- Cookie: `adminToken` (JWT, role `admin`).
- `middleware.ts` protects **`/admin/:path*`** only (not bare `/admin`).
- Never commit `.env`. Never weaken auth on mutating blog/upload routes without explicit request.
- `robots.ts` should keep `/admin` and `/api/` disallowed.
- Fallback JWT secret in middleware is a smell for production — prefer `JWT_SECRET` always set.

---

## 12. Conventions when editing

1. Match local TypeScript/Tailwind patterns; small focused diffs.
2. Prefer Server Components for readable public content.
3. Public marketing/blog text must stay visible in SSR HTML (no `opacity: 0` on copy).
4. Adding a project → update `src/data/projects.ts` (slug required).
5. Adding a blog category → `constants/blog.ts` **and** Mongoose category union in `models/blogPost.ts`.
6. Do not rewrite README/AGENTS unless asked (except keeping this file accurate when architecture changes).
7. Commits / push / PRs only when the user asks.

---

## 13. High-risk files (review carefully)

| Area | Files |
| --- | --- |
| Publish / slug bugs | `api/blog/**`, `BlogPostForm.tsx`, `blogQueries.ts`, `blogData.ts` |
| Crawlability | `blog/[slug]/page.tsx`, `BlogArticleBody.tsx`, `BlogContent.tsx`, `sitemap.ts`, `robots.ts` |
| Auth | `middleware.ts`, `api/admin/**` |
| Uploads | `api/upload-image`, `api/upload-video`, Cloudinary utils |
| Admin UX state | `useAdminPageController.ts` |

---

## 14. How to brief another AI

Paste this file + `README.md`, then ask a **scoped** question, e.g.:

> Using AGENTS.md, review the blog publish flow in `useAdminPageController` and `api/blog/[id]/route.ts`. Check draft saves cannot overwrite published slugs.

Do **not** only send the GitHub URL — many AIs cannot clone or only see an empty README.
