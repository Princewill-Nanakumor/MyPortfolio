// src/app/api/blog/[id]/route.ts
import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/db/mongodb";
import blogPost from "@/models/blogPost";
import {
  decodePostIdentifier,
  escapeRegex,
  isMongoObjectId,
} from "@/utils/blogQueries";

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
    const id = decodePostIdentifier((await context.params).id);
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

    let post = null;

    if (isMongoObjectId(id)) {
      post = await blogPost.findById(id).lean();
    }

    if (!post) {
      post = await blogPost.findOne({ slug: id }).lean();
    }

    if (!post) {
      post = await blogPost
        .findOne({
          slug: {
            $regex: new RegExp(`^${escapeRegex(id)}$`, "i"),
          },
        })
        .lean();
    }

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

    const existingPost = await blogPost.findById(id).lean();

    if (!existingPost) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "Blog post not found",
          message: "The blog post to update could not be found",
        },
        { status: 404 }
      );
    }

    if (!isPublishing) {
      const defaults = buildDraftDefaults(body);
      body.title = body.title?.trim() || existingPost.title || defaults.title;
      body.excerpt =
        body.excerpt?.trim() || existingPost.excerpt || defaults.excerpt;
      body.content =
        Array.isArray(body.content) && body.content.length > 0
          ? body.content
          : existingPost.content || defaults.content;
      body.image = body.image?.trim() || existingPost.image || defaults.image;
      body.category =
        body.category?.trim() || existingPost.category || defaults.category;
      body.slug = body.slug?.trim() || existingPost.slug || defaults.slug;
    }

    if (isPublishing) {
      const title = body.title?.trim() || existingPost.title;
      const excerpt = body.excerpt?.trim() || existingPost.excerpt;
      const content = body.content ?? existingPost.content;

      if (!title || !excerpt || !content) {
        return NextResponse.json<ApiError>(
          {
            success: false,
            error: "Missing required fields",
            message: "Title, excerpt, and content are required",
          },
          { status: 400 }
        );
      }

      body.title = title;
      body.excerpt = excerpt;
      body.content = content;
      body.slug = body.slug?.trim() || existingPost.slug;
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
