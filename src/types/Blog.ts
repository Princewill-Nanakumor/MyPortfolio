// src/types/Blog.ts
export interface BlogPost {
  _id?: string;
  id?: number;
  title: string;
  slug: string;
  excerpt: string;
  content: ContentBlock[];
  image: string;
  readTime: string;
  category: string;
  tags: string[];
  published: boolean;
  likes: number;
  date?: string;
  author?: {
    name?: string;
    bio?: string;
    avatar?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

// .ts
export interface NewContentItem {
  type: "paragraph" | "h1" | "h2" | "h3" | "code" | "list" | "image";
  text: string;
  items: string[];
  imageUrl?: string;
}

export interface ContentBlock {
  type: "h1" | "h2" | "h3" | "paragraph" | "code" | "list" | "image"; // Add "image" here
  text?: string;
  items?: string[];
  imageUrl?: string; // Add this for image blocks
}

export interface BlogFilters {
  category?: string;
  published?: boolean;
  search?: string;
  tag?: string;
  limit?: number;
  skip?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
