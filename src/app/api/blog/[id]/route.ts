// src/app/api/blog/[id]/route.ts
import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/db/mongodb";
import blogPost from "@/models/blogPost";
import mongoose from "mongoose";

interface ApiSuccess<T> {
  success: true;
  data: T;
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
  content: unknown;
  image?: string;
  readTime?: string;
  category?: string;
  tags?: string[];
  published?: boolean;
  likes?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

type ApiResponse<T> = ApiSuccess<T> | ApiError;

const buildDraftDefaults = (
  body: Partial<BlogPostBody>
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
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  return {
    title,
    excerpt: body.excerpt?.trim() || "Draft excerpt",
    content: Array.isArray(body.content) ? body.content : [],
    image: body.image?.trim() || "",
    category: body.category?.trim() || "Draft",
    slug: body.slug?.trim() || `${baseSlug || "untitled-draft"}-${timestamp}`,
  };
};

// GET - Fetch single blog post
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<any>>> {
  try {
    const { id } = await context.params;
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

    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { slug: id };

    const post = await blogPost.findOne(query).lean();

    if (!post) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "Blog post not found",
          message: "The requested blog post could not be found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiSuccess<any>>({
      success: true,
      data: post,
    });
  } catch (error: unknown) {
    console.error("Error fetching blog post:", error);

    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "Failed to fetch blog post",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// PUT - Update blog post
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<any>>> {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as Partial<BlogPostBody>;

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
    }

    body.updatedAt = new Date();

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

    if (body.slug) {
      const existingPost = await blogPost.findOne({
        slug: body.slug,
        _id: { $ne: id },
      });
      if (existingPost) {
        return NextResponse.json<ApiError>(
          {
            success: false,
            error: "Slug already exists",
            message: "A post with this slug already exists",
          },
          { status: 400 }
        );
      }
    }

    const updatedPost = await blogPost.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: isPublishing,
    });

    if (!updatedPost) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "Blog post not found",
          message: "The blog post to update could not be found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiSuccess<any>>({
      success: true,
      data: updatedPost,
      message: "Blog post updated successfully",
    });
  } catch (error: unknown) {
    console.error("Error updating blog post:", error);

    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "Failed to update blog post",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete blog post
export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<string>>> {
  try {
    const { id } = await context.params;

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

    const deletedPost = await blogPost.findByIdAndDelete(id);

    if (!deletedPost) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "Blog post not found",
          message: "The blog post to delete could not be found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiSuccess<string>>({
      success: true,
      data: "Blog post deleted successfully",
      message: "Blog post deleted successfully",
    });
  } catch (error: unknown) {
    console.error("Error deleting blog post:", error);

    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "Failed to delete blog post",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
