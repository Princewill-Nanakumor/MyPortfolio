// src/models/contact.ts
import mongoose, { Schema, Document, Model } from "mongoose";

// Define interface for type safety
export interface IContact extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: Date;
  ipAddress: string;
}

const contactSchema = new Schema<IContact>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  ipAddress: {
    type: String,
    default: "unknown",
  },
});

// Type-safe model creation
const Contact: Model<IContact> =
  (mongoose.models.Contact as Model<IContact>) ||
  mongoose.model<IContact>("Contact", contactSchema);

export default Contact;
