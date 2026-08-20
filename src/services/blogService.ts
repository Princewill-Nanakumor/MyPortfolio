// src/services/blogService.ts
import { BlogPost, BlogFilters, ApiResponse } from "./../types/Blog";

class BlogService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = "/api/blog";
  }

  private async parseErrorResponse(
    response: Response
  ): Promise<{ message: string; details?: unknown }> {
    try {
      const rawText = await response.text();
      const errorData = rawText ? JSON.parse(rawText) : {};
      return {
        message:
          errorData?.message ||
          errorData?.error ||
          (rawText && typeof rawText === "string" ? rawText : undefined) ||
          `HTTP error! status: ${response.status}`,
        details: errorData,
      };
    } catch {
      return {
        message: `HTTP error! status: ${response.status}`,
      };
    }
  }

  async getAllPosts(filters: BlogFilters = {}): Promise<BlogPost[]> {
    try {
      const queryParams = new URLSearchParams();

      if (filters.category && filters.category !== "All") {
        queryParams.append("category", filters.category);
      }

      if (filters.published !== undefined) {
        queryParams.append("published", filters.published.toString());
      }

      if (filters.search) {
        queryParams.append("search", filters.search);
      }

      if (filters.tag) {
        queryParams.append("tag", filters.tag);
      }

      if (filters.limit) {
        queryParams.append("limit", filters.limit.toString());
      }

      if (filters.skip) {
        queryParams.append("skip", filters.skip.toString());
      }

      const url = `${this.baseUrl}${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await this.parseErrorResponse(response);
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data: ApiResponse<BlogPost[]> = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch posts");
      }

      // Ensure all posts have likes field
      const posts = data.data || [];
      return posts.map((post) => ({
        ...post,
        likes: typeof post.likes === "number" ? post.likes : 0,
      }));
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw new Error(
        `Failed to fetch blog posts: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async getPost(idOrSlug: string): Promise<BlogPost> {
    try {
      const identifier = idOrSlug.trim();
      const response = await fetch(
        `${this.baseUrl}/${encodeURIComponent(identifier)}`
      );

      if (!response.ok) {
        const errorData = await this.parseErrorResponse(response);
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data: ApiResponse<BlogPost> = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch post");
      }

      // Ensure likes is a number
      const post = data.data;
      return {
        ...post,
        likes: typeof post.likes === "number" ? post.likes : 0,
      };
    } catch (error) {
      console.error("Error fetching post:", error);
      throw new Error(
        `Failed to fetch blog post: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async createPost(postData: Partial<BlogPost>): Promise<BlogPost> {
    console.log("➕ blogService.createPost called with:", postData);

    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...postData,
          likes: 0, // Initialize likes to 0 for new posts
          published: postData.published ?? true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      });

      console.log("➡️ Response status:", response.status);

      if (!response.ok) {
        const errorData = await this.parseErrorResponse(response);
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data: ApiResponse<BlogPost> = await response.json();
      console.log("✅ API response:", data);

      if (!data.success) {
        throw new Error(data.message || "Failed to create post");
      }

      return data.data;
    } catch (error) {
      throw new Error(
        `Failed to create blog post: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async updatePost(id: string, postData: Partial<BlogPost>): Promise<BlogPost> {
    console.log("🔄 blogService.updatePost called with:", { id, postData });

    try {
      const {
        _id: _ignoredId,
        id: _ignoredAltId,
        ...safePostData
      } = postData as Partial<BlogPost> & { id?: string | number };

      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...safePostData,
          published: postData.published ?? true,
          updatedAt: new Date().toISOString(),
        }),
      });

      console.log("➡️ Response status:", response.status);

      if (!response.ok) {
        const errorData = await this.parseErrorResponse(response);
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data: ApiResponse<BlogPost> = await response.json();
      console.log("✅ API response:", data);

      if (!data.success) {
        throw new Error(data.message || "Failed to update post");
      }

      return data.data;
    } catch (error) {
      throw new Error(
        `Failed to update blog post: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async deletePost(id: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await this.parseErrorResponse(response);
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data: ApiResponse<string> = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to delete post");
      }

      return data.data;
    } catch (error) {
      console.error("Error deleting post:", error);
      throw new Error(
        `Failed to delete blog post: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async togglePublish(id: string, published: boolean): Promise<BlogPost> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          published,
          updatedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await this.parseErrorResponse(response);
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data: ApiResponse<BlogPost> = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to update post");
      }

      return data.data;
    } catch (error) {
      console.error("Error toggling publish status:", error);
      throw new Error(
        `Failed to update blog post: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  // Like/Unlike methods
  async likePost(id: string): Promise<{ likes: number }> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await this.parseErrorResponse(response);
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data: ApiResponse<{ likes: number }> = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to like post");
      }

      return data.data;
    } catch (error) {
      console.error("Error liking post:", error);
      throw new Error(
        `Failed to like post: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async unlikePost(id: string): Promise<{ likes: number }> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}/like`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data: ApiResponse<{ likes: number }> = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to unlike post");
      }

      return data.data;
    } catch (error) {
      console.error("Error unliking post:", error);
      throw new Error(
        `Failed to unlike post: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  // Helper methods
  async getPublishedPosts(limit?: number): Promise<BlogPost[]> {
    return this.getAllPosts({
      published: true,
      ...(limit && { limit }),
    });
  }

  async getDraftPosts(): Promise<BlogPost[]> {
    return this.getAllPosts({ published: false });
  }

  async searchPosts(
    query: string,
    filters: BlogFilters = {}
  ): Promise<BlogPost[]> {
    return this.getAllPosts({
      search: query,
      ...filters,
    });
  }

  async getPostsByCategory(
    category: string,
    filters: BlogFilters = {}
  ): Promise<BlogPost[]> {
    return this.getAllPosts({
      category,
      ...filters,
    });
  }

  async getPostsByTag(
    tag: string,
    filters: BlogFilters = {}
  ): Promise<BlogPost[]> {
    return this.getAllPosts({
      tag,
      ...filters,
    });
  }

  async getRecentPosts(limit: number = 5): Promise<BlogPost[]> {
    return this.getAllPosts({
      limit,
      published: true,
    });
  }
}

// Export singleton instance
export const blogService = new BlogService();
