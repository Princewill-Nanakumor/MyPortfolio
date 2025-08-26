// src/app/api/upload-image/route.ts
import { NextResponse, NextRequest } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

interface UploadSuccess {
  success: true;
  imageUrl: string;
  message: string;
}

interface UploadError {
  error: string;
}

type UploadResponse = UploadSuccess | UploadError;

export async function POST(
  request: NextRequest
): Promise<NextResponse<UploadResponse>> {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json<UploadError>(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json<UploadError>(
        { error: "Invalid file type. Only images are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json<UploadError>(
        { error: "File size too large. Maximum 5MB allowed." },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    // Generate unique filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const filepath = path.join(uploadsDir, filename);

    // Save file
    await writeFile(filepath, buffer);

    // Return the public URL
    const imageUrl = `/uploads/${filename}`;

    return NextResponse.json<UploadSuccess>({
      success: true,
      imageUrl,
      message: "Image uploaded successfully",
    });
  } catch (error: unknown) {
    console.error("Upload error:", error);
    return NextResponse.json<UploadError>(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
