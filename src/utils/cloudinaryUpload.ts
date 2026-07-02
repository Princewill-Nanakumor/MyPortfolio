const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export interface CloudinaryVideoUploadResult {
  secure_url: string;
  public_id: string;
}

export async function uploadVideoToCloudinary(
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      "Cloudinary is not configured. Check NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET."
    );
  }

  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", "portfolio-uploads/videos");

    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`
    );

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || !onProgress) return;
      onProgress(Math.round((event.loaded / event.total) * 100));
    };

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText) as CloudinaryVideoUploadResult & {
          error?: { message?: string };
        };

        if (xhr.status >= 200 && xhr.status < 300 && data.secure_url) {
          resolve(data.secure_url);
          return;
        }

        reject(
          new Error(
            data.error?.message ||
              `Video upload failed with status ${xhr.status}`
          )
        );
      } catch {
        reject(new Error("Video upload failed. Invalid response from Cloudinary."));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Video upload failed. Check your network connection."));
    };

    xhr.onabort = () => {
      reject(new Error("Video upload was cancelled."));
    };

    xhr.send(formData);
  });
}
