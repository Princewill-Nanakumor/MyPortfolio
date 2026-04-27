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

    const posts = await blogPost.find(query).sort({ createdAt: -1 }).lean();

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
