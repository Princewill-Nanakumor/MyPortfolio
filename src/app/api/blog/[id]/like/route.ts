// src/app/api/blog/[id]/like/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/db/mongodb";
import blogPost from "@/models/blogPost";

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

type ApiResponse<T> = ApiSuccess<T> | ApiError;

// POST - Like a blog post
export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<{ likes: number }>>> {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "Post ID is required",
          message: "Post ID is required",
        },
        { status: 400 }
      );
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

    const post = await blogPost.findById(id);
    if (!post) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "Post not found",
          message: "Post not found",
        },
        { status: 404 }
      );
    }

    // Increment likes
    post.likes = (post.likes || 0) + 1;
    await post.save();

    return NextResponse.json<ApiSuccess<{ likes: number }>>({
      success: true,
      data: { likes: post.likes },
      message: "Post liked successfully",
    });
  } catch (error: unknown) {
    console.error("Error liking post:", error);

    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "Failed to like post",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE - Unlike a blog post
export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<{ likes: number }>>> {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "Post ID is required",
          message: "Post ID is required",
        },
        { status: 400 }
      );
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

    const post = await blogPost.findById(id);
    if (!post) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "Post not found",
          message: "Post not found",
        },
        { status: 404 }
      );
    }

    // Decrement likes (but don't go below 0)
    post.likes = Math.max(0, (post.likes || 0) - 1);
    await post.save();

    return NextResponse.json<ApiSuccess<{ likes: number }>>({
      success: true,
      data: { likes: post.likes },
      message: "Post unliked successfully",
    });
  } catch (error: unknown) {
    console.error("Error unliking post:", error);

    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "Failed to unlike post",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
