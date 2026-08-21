// src/models/BlogPost.ts
import mongoose, { Schema, Document, Model } from "mongoose";
import { BLOG_CATEGORIES } from "@/constants/blog";

export interface IContentBlock {
  type: "paragraph" | "h1" | "h2" | "h3" | "code" | "list" | "image" | "video";
  text?: string;
  items?: string[];
  imageUrl?: string;
  videoUrl?: string;
}

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: IContentBlock[];
  image: string;
  readTime: string;
  category:
    | ""
    | "Draft"
    | "Next.js"
    | "React"
    | "CSS"
    | "JavaScript"
    | "TypeScript"
    | "Backend"
    | "CLI Tools"
    | "Data Engineering"
    | "Cloud Engineering"
    | "Git"
    | "AI/ML"
    | "DevOps"
    | "Tutorial"
    | "Hobbies"
    | "Drone";
  tags: string[];
  published: boolean;
  likes: number;
  /** Links this post to a portfolio project (`Project.slug`) for Read Blog */
  projectSlug?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContentBlockSchema = new Schema<IContentBlock>({
  type: {
    type: String,
    enum: ["paragraph", "h1", "h2", "h3", "code", "list", "image", "video"],
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
  videoUrl: {
    type: String,
    default: "",
  },
});

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: {
      type: String,
      required: false,
      default: "",
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
      required: false,
      default: "",
    },
    content: [ContentBlockSchema],
    image: {
      type: String,
      required: false,
      default: "",
    },
    readTime: {
      type: String,
      default: "5 min read",
    },
    category: {
      type: String,
      required: false,
      enum: [...BLOG_CATEGORIES],
      default: "",
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
    projectSlug: {
      type: String,
      required: false,
      default: "",
      trim: true,
      index: true,
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
BlogPostSchema.index({ projectSlug: 1 });

// Type-safe model creation
const BlogPost: Model<IBlogPost> =
  (mongoose.models.BlogPost as Model<IBlogPost>) ||
  mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);

export default BlogPost;
