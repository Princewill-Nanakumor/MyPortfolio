// src/app/api/blog/route.ts
import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/db/mongodb";
import blogPost from "@/models/blogPost";

interface ApiSuccess<T> {
  success: true;
  data: T;
  count?: number;
  message?: string;
}

interface ApiError {
  success: false;
  error: string;
  message?: string;
}

interface BlogPostBody {
  title: string;
  slug?: string;
  excerpt: string;
  content: unknown; // refine if you have a concrete content type
  image?: string;
  readTime?: string;
  category?: string;
  tags?: string[];
  published?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

type ApiResponse<T> = ApiSuccess<T> | ApiError;

const buildDraftDefaults = (
  body: BlogPostBody
): {
  title: string;
  excerpt: string;
  content: unknown[];
  image: string;
  category: string;
  slug: string;
} => {
  const title = body.title?.trim() || "";
  const timestamp = Date.now();

  const slug =
    body.slug?.trim() ||
    `${(title || "untitled-draft")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")}-${timestamp}`;

  return {
    title,
    excerpt: body.excerpt?.trim() || "Draft excerpt",
    content: Array.isArray(body.content) ? body.content : [],
    image: body.image?.trim() || "",
    category: body.category?.trim() || "Draft",
    slug,
  };
};

// GET - Fetch all blog posts
export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<any[]>>> {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const published = searchParams.get("published");
    const limitParam = searchParams.get("limit");
    const skipParam = searchParams.get("skip");

    const isConnected = await connectDB();
    if (!isConnected) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "Database connection failed",
          message: "Unable to connect to MongoDB database",
        },
        { status: 503 }
      );
    }

    const query: Record<string, unknown> = {};

    if (category && category !== "All") {
      query.category = category;
    }

    if (published !== null) {
      query.published = published === "true";
    }

    const limit = limitParam ? Math.max(1, parseInt(limitParam, 10)) : undefined;
    const skip = skipParam ? Math.max(0, parseInt(skipParam, 10)) : undefined;

    // Match public blog: newest published/created posts first (not last-edited).
    let postsQuery = blogPost.find(query).sort({ createdAt: -1, updatedAt: -1 });

    if (typeof skip === "number" && !Number.isNaN(skip)) {
      postsQuery = postsQuery.skip(skip);
    }

    if (typeof limit === "number" && !Number.isNaN(limit)) {
      postsQuery = postsQuery.limit(limit);
    }

    const posts = await postsQuery.lean();

    return NextResponse.json<ApiSuccess<any[]>>({
      success: true,
      data: posts,
      count: posts.length,
    });
  } catch (error: unknown) {
    console.error("Error fetching blog posts:", error);

    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "Failed to fetch blog posts",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST - Create new blog post
export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<any>>> {
  try {
    const body = (await request.json()) as BlogPostBody;

    const isPublishing = body.published === true;

    if (isPublishing && (!body.title || !body.excerpt || !body.content)) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "Missing required fields",
          message: "Title, excerpt, and content are required",
        },
        { status: 400 }
      );
    }

    if (!isPublishing) {
      const defaults = buildDraftDefaults(body);
      body.title = defaults.title;
      body.excerpt = defaults.excerpt;
      body.content = defaults.content;
      body.image = defaults.image;
      body.category = defaults.category;
      body.slug = defaults.slug;

      const isConnected = await connectDB();
      if (!isConnected) {
        return NextResponse.json<ApiError>(
          {
            success: false,
            error: "Database connection failed",
            message: "Unable to connect to MongoDB database",
          },
          { status: 503 }
        );
      }

      const draftPayload = {
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt,
        content: body.content,
        image: body.image,
        readTime: body.readTime || "",
        category: body.category,
        tags: body.tags || [],
        published: false,
        likes: 0,
        updatedAt: new Date(),
      };

      const draftPost = await blogPost.findOneAndUpdate(
        { slug: body.slug },
        {
          $set: draftPayload,
          $setOnInsert: { createdAt: new Date() },
        },
        {
          upsert: true,
          new: true,
          runValidators: false,
        }
      );

      return NextResponse.json<ApiSuccess<any>>(
        {
          success: true,
          data: draftPost,
          message: "Draft saved successfully",
        },
        { status: 201 }
      );
    } else if (!body.slug && body.title) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }

    const isConnected = await connectDB();
    if (!isConnected) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "Database connection failed",
          message: "Unable to connect to MongoDB database",
        },
        { status: 503 }
      );
    }

    const existingPost = await blogPost.findOne({ slug: body.slug });
    if (existingPost) {
      if (!isPublishing) {
        const updatedDraft = await blogPost.findByIdAndUpdate(
          existingPost._id,
          {
            ...body,
            published: false,
            updatedAt: new Date(),
          },
          { new: true, runValidators: true }
        );

        return NextResponse.json<ApiSuccess<any>>({
          success: true,
          data: updatedDraft,
          message: "Draft updated successfully",
        });
      }

      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "Slug already exists",
          message: "A post with this slug already exists",
        },
        { status: 400 }
      );
    }

    body.published = body.published !== undefined ? body.published : false;
    body.createdAt = new Date();
    body.updatedAt = new Date();

    const newPost = new blogPost(body);
    const savedPost = await newPost.save();

    return NextResponse.json<ApiSuccess<any>>(
      {
        success: true,
        data: savedPost,
        message: "Blog post created successfully",
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error creating blog post:", error);

    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "Failed to create blog post",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
