// src/app/api/upload-image/route.ts
import { NextResponse, NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64String = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64String, {
      folder: "portfolio-uploads",
      resource_type: "auto",
    });

    return NextResponse.json<UploadSuccess>({
      success: true,
      imageUrl: result.secure_url,
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
