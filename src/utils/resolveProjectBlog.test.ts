import { describe, it, expect } from "vitest";
import { selectBlogSlugForProject } from "./resolveProjectBlog";

const posts = [
  {
    slug: "helix-ticketing-app-nextjs-postgresql-prisma-jwt",
    projectSlug: "helix-ticketing-app",
  },
  {
    slug: "motorlane-virtual-car-showroom-nextjs-dummyjson",
    projectSlug: "car-showroom",
  },
  {
    slug: "vin-decoder-nextjs-zod-nhtsa-vpic",
    projectSlug: "vin-decoder",
  },
  {
    slug: "unrelated-post-about-css",
  },
];

describe("selectBlogSlugForProject", () => {
  it("prefers an explicit project.blogSlug when that post exists", () => {
    expect(
      selectBlogSlugForProject(
        {
          slug: "car-showroom",
          blogSlug: "motorlane-virtual-car-showroom-nextjs-dummyjson",
        },
        posts
      )
    ).toBe("motorlane-virtual-car-showroom-nextjs-dummyjson");
  });

  it("ignores an explicit blogSlug that is not published", () => {
    expect(
      selectBlogSlugForProject(
        {
          slug: "car-showroom",
          blogSlug: "missing-post",
        },
        posts
      )
    ).toBe("motorlane-virtual-car-showroom-nextjs-dummyjson");
  });

  it("matches by post.projectSlug when blogSlug is absent", () => {
    expect(
      selectBlogSlugForProject({ slug: "helix-ticketing-app" }, posts)
    ).toBe("helix-ticketing-app-nextjs-postgresql-prisma-jwt");
  });

  it("matches by blog slug shape containing the project slug", () => {
    expect(
      selectBlogSlugForProject(
        { slug: "vin-decoder" },
        [
          {
            slug: "vin-decoder-nextjs-zod-nhtsa-vpic",
          },
        ]
      )
    ).toBe("vin-decoder-nextjs-zod-nhtsa-vpic");
  });

  it("returns null when nothing matches", () => {
    expect(
      selectBlogSlugForProject({ slug: "no-blog-project" }, posts)
    ).toBeNull();
  });

  it("returns null for an empty post list", () => {
    expect(
      selectBlogSlugForProject({ slug: "helix-ticketing-app" }, [])
    ).toBeNull();
  });
});
