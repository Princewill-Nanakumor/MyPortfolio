export const BLOG_CATEGORIES = [
  "",
  "Draft",
  "Next.js",
  "React",
  "CSS",
  "JavaScript",
  "TypeScript",
  "Backend",
  "CLI Tools",
  "Data Engineering",
  "Cloud Engineering",
  "Git",
  "AI/ML",
  "DevOps",
  "Tutorial",
  "Hobbies",
  "Drone",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export const BLOG_CATEGORY_OPTIONS = BLOG_CATEGORIES.filter(
  (category) => category && category !== "Draft"
);

/** Tags for backend tooling, parsing pipelines, and CLI work */
export const BACKEND_WORK_TAGS = [
  "typescript",
  "nodejs",
  "backend",
  "cli-tools",
  "event-parsing",
  "binary-parsing",
  "data-pipeline",
  "data-analysis",
  "telemetry",
  "scoring-algorithms",
  "algorithms",
  "json-output",
  "demoparser",
  "demo-parser",
  "automation",
  "counter-strike-2",
  "game-development",
  "ai",
  "open-source",
  "github",
] as const;

/** Tags for web dev posts */
export const WEB_DEV_TAGS = [
  "react",
  "nextjs",
  "javascript",
  "css",
  "tailwind",
  "api",
  "tutorial",
  "beginner",
  "advanced",
  "tips",
  "web-development",
  "frontend",
  "fullstack",
] as const;

/** Tags for hobby content (e.g. drone footage) */
export const HOBBY_BLOG_TAGS = [
  "drone",
  "fpv",
  "aerial-video",
  "hobbies",
  "video-editing",
] as const;

export const TECH_BLOG_TAGS = [
  ...WEB_DEV_TAGS,
  ...BACKEND_WORK_TAGS,
] as const;

export const POPULAR_BLOG_TAGS = [
  ...TECH_BLOG_TAGS,
  ...HOBBY_BLOG_TAGS,
] as const;
