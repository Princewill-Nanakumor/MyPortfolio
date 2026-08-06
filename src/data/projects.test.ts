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
      `${SITE_URL}/helix_homepage_img.png`
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

describe("getProjectTechList", () => {
  it("splits and trims technology chips", () => {
    expect(
      getProjectTechList({
        ...projects[0],
        technology: "Next.js,  React , TypeScript",
      })
    ).toEqual(["Next.js", "React", "TypeScript"]);
  });
});
