// src/models/BlogPost.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContentBlock {
  type: "paragraph" | "heading" | "code" | "list" | "image";
  text?: string;
  items?: string[];
  imageUrl?: string;
}

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: IContentBlock[];
  image: string;
  readTime: string;
  category:
    | "Next.js"
    | "React"
    | "CSS"
    | "JavaScript"
    | "TypeScript"
    | "Backend"
    | "Git"
    | "AI/ML"
    | "DevOps"
    | "Tutorial";
  tags: string[];
  published: boolean;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

const ContentBlockSchema = new Schema<IContentBlock>({
  type: {
    type: String,
    enum: ["paragraph", "heading", "code", "list", "image"],
    required: true,
  },
  text: {
    type: String,
    default: "",
  },
  items: [
    {
      type: String,
    },
  ],
  imageUrl: {
    type: String,
    default: "",
  },
});

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    excerpt: {
      type: String,
      required: true,
      maxLength: 500,
    },
    content: [ContentBlockSchema],
    image: {
      type: String,
      required: true,
    },
    readTime: {
      type: String,
      default: "5 min read",
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Next.js",
        "React",
        "CSS",
        "JavaScript",
        "TypeScript",
        "Backend",
        "Git",
        "AI/ML",
        "DevOps",
        "Tutorial",
      ],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    likes: {
      type: Number,
      default: 0,
    },
    published: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Create index for better search performance
BlogPostSchema.index({ title: "text", excerpt: "text", tags: "text" });
BlogPostSchema.index({ slug: 1 });
BlogPostSchema.index({ category: 1 });
BlogPostSchema.index({ published: 1 });

// Type-safe model creation
const BlogPost: Model<IBlogPost> =
  (mongoose.models.BlogPost as Model<IBlogPost>) ||
  mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);

export default BlogPost;
