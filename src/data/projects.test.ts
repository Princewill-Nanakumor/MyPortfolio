import { describe, it, expect } from "vitest";
import {
  getProjectBySlug,
  getProjectImageUrl,
  getProjectTechList,
  projects,
  SITE_URL,
} from "./projects";

describe("getProjectBySlug", () => {
  it("returns a known project", () => {
    const project = getProjectBySlug("helix-ticketing-app");
    expect(project?.name).toBe("Helix Ticketing App");
  });

  it("returns undefined for unknown slug", () => {
    expect(getProjectBySlug("does-not-exist")).toBeUndefined();
  });

  it("every project has a unique non-empty slug", () => {
    const slugs = projects.map((p) => p.slug);
    expect(slugs.every(Boolean)).toBe(true);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("getProjectImageUrl", () => {
  it("prefixes relative paths with SITE_URL", () => {
    const project = getProjectBySlug("helix-ticketing-app")!;
    expect(getProjectImageUrl(project)).toBe(
      `${SITE_URL}/helix_homepage_img.jpg`
    );
  });

  it("keeps absolute http image urls", () => {
    const absolute = {
      ...projects[0],
      image: "https://cdn.example.com/cover.png",
    };
    expect(getProjectImageUrl(absolute)).toBe(
      "https://cdn.example.com/cover.png"
    );
  });
});

describe("project ↔ blog linking", () => {
  it("Helix has a static blogSlug fallback", () => {
    const helix = getProjectBySlug("helix-ticketing-app");
    expect(helix?.blogSlug).toBe(
      "helix-ticketing-app-nextjs-postgresql-prisma-jwt"
    );
  });

  it("every blogSlug points at a non-empty string when set", () => {
    for (const project of projects) {
      if (project.blogSlug) {
        expect(project.blogSlug.trim().length).toBeGreaterThan(0);
      }
    }
  });
});