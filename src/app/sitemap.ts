import type { MetadataRoute } from "next";
import connectDB from "@/db/mongodb";
import blogPost from "@/models/blogPost";
import { projects } from "@/data/projects";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

function buildStaticAndProjectRoutes(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/llms.txt`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${SITE_URL}/projects/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  return [...staticRoutes, ...projectRoutes];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Always emit home, blog index, projects index, and every project slug —
  // even if MongoDB is down (blog posts are optional extras).
  const base = buildStaticAndProjectRoutes();

  try {
    const isConnected = await connectDB();
    if (!isConnected) {
      return base;
    }

    const posts = await blogPost
      .find({ published: true }, { slug: 1, updatedAt: 1 })
      .sort({ updatedAt: -1 })
      .lean();

    const blogRoutes: MetadataRoute.Sitemap = posts
      .filter((post) => Boolean(post.slug))
      .map((post) => ({
        url: `${SITE_URL}/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt || Date.now()),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));

    return [...base, ...blogRoutes];
  } catch (error) {
    console.error("Failed to add blog posts to sitemap:", error);
    return base;
  }
}
