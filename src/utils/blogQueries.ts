import mongoose from "mongoose";

export function decodePostIdentifier(value: string): string {
  try {
    return decodeURIComponent(value).trim();
  } catch {
    return value.trim();
  }
}

export function isMongoObjectId(value: string): boolean {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return false;
  }

  try {
    return String(new mongoose.Types.ObjectId(value)) === value;
  } catch {
    return false;
  }
}

export function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
