import { NextResponse, NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface UploadSuccess {
  success: true;
  videoUrl: string;
  message: string;
}

interface UploadError {
  error: string;
}

type UploadResponse = UploadSuccess | UploadError;

const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-msvideo",
];

export async function POST(
  request: NextRequest
): Promise<NextResponse<UploadResponse>> {
  try {
    const formData = await request.formData();
    const file = formData.get("video") as File | null;

    if (!file) {
      return NextResponse.json<UploadError>(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      return NextResponse.json<UploadError>(
        { error: "Invalid file type. Only MP4, WebM, MOV, and AVI are allowed." },
        { status: 400 }
      );
    }

    if (file.size > MAX_VIDEO_SIZE) {
      return NextResponse.json<UploadError>(
        { error: "File size too large. Maximum 50MB allowed." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64String = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64String, {
      folder: "portfolio-uploads/videos",
      resource_type: "video",
      upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    });

    return NextResponse.json<UploadSuccess>({
      success: true,
      videoUrl: result.secure_url,
      message: "Video uploaded successfully",
    });
  } catch (error: unknown) {
    console.error("Video upload error:", error);
    return NextResponse.json<UploadError>(
      { error: "Failed to upload video" },
      { status: 500 }
    );
  }
}
