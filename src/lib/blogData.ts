import connectDB from "@/db/mongodb";
import blogPost from "@/models/blogPost";
import { BlogPost, ContentBlock } from "@/types/Blog";
import {
  decodePostIdentifier,
  escapeRegex,
  isMongoObjectId,
} from "@/utils/blogQueries";
import { normalizeContentBlocks } from "@/utils/normalizeContentBlocks";
import { selectBlogSlugForProject } from "@/utils/resolveProjectBlog";

type LeanBlockLike = {
  type: ContentBlock["type"];
  text?: string;
  items?: string[];
  imageUrl?: string;
  videoUrl?: string;
};

type LeanPostLike = {
  _id?: { toString: () => string } | string;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: LeanBlockLike[];
  image?: string;
  readTime?: string;
  category?: string;
  tags?: string[];
  published?: boolean;
  likes?: number;
  projectSlug?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

function serializeBlock(block: LeanBlockLike): ContentBlock {
  const [normalized] = normalizeContentBlocks([block]);
  return normalized;
}

function serializePost(doc: LeanPostLike): BlogPost {
  return {
    _id: doc._id ? String(doc._id) : undefined,
    title: doc.title || "",
    slug: doc.slug || "",
    excerpt: doc.excerpt || "",
    content: Array.isArray(doc.content) ? doc.content.map(serializeBlock) : [],
    image: doc.image || "",
    readTime: doc.readTime || "",
    category: doc.category || "",
    tags: Array.isArray(doc.tags) ? doc.tags : [],
    published: Boolean(doc.published),
    likes: typeof doc.likes === "number" ? doc.likes : 0,
    ...(doc.projectSlug ? { projectSlug: doc.projectSlug } : {}),
    createdAt: doc.createdAt
      ? new Date(doc.createdAt).toISOString()
      : undefined,
    updatedAt: doc.updatedAt
      ? new Date(doc.updatedAt).toISOString()
      : undefined,
  };
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const isConnected = await connectDB();
  if (!isConnected) return [];

  const docs = (await blogPost
    .find({ published: true })
    // "Latest" should match the visible card date (createdAt / publish date),
    // not only the last-edited time (updatedAt).
    .sort({ createdAt: -1, updatedAt: -1 })
    .lean()) as LeanPostLike[];

  return docs.map(serializePost);
}

/**
 * Resolve the published blog slug for a portfolio project.
 * Order: explicit project.blogSlug → post.projectSlug → slug contains project.slug
 */
export async function resolveBlogSlugForProject(project: {
  slug: string;
  blogSlug?: string;
}): Promise<string | null> {
  const posts = await getPublishedPosts();
  return selectBlogSlugForProject(project, posts);
}

export async function getPostBySlug(
  slugOrId: string
): Promise<BlogPost | null> {
  const isConnected = await connectDB();
  if (!isConnected) return null;

  const identifier = decodePostIdentifier(slugOrId);
  let doc: LeanPostLike | null = null;

  if (isMongoObjectId(identifier)) {
    doc = (await blogPost.findById(identifier).lean()) as LeanPostLike | null;
  }

  if (!doc) {
    doc = (await blogPost
      .findOne({ slug: identifier })
      .lean()) as LeanPostLike | null;
  }

  if (!doc) {
    doc = (await blogPost
      .findOne({
        slug: { $regex: new RegExp(`^${escapeRegex(identifier)}$`, "i") },
      })
      .lean()) as LeanPostLike | null;
  }

  return doc ? serializePost(doc) : null;
}
