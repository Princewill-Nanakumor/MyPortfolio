import type { MetadataRoute } from "next";
import connectDB from "@/db/mongodb";
import blogPost from "@/models/blogPost";

const SITE_URL = "https://princewillnanakumor.com";
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
      url: `${SITE_URL}/success`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  try {
    const isConnected = await connectDB();
    if (!isConnected) {
      return staticRoutes;
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
        changeFrequency: "weekly",
        priority: 0.8,
      }));

    return [...staticRoutes, ...blogRoutes];
  } catch (error) {
    console.error("Failed to generate sitemap:", error);
    return staticRoutes;
  }
}
