"use client";
import { useState, useEffect, useCallback } from "react";
import BlogPostForm from "@/components/admin/BlogPostForm";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminActionBar from "@/components/admin/AdminActionBar";
import AdminContent from "@/components/admin/AdminContent";
import { blogService } from "@/services/blogService";
import { BlogPost } from "@/types/Blog";
import { useToast } from "@/context/ToastContext";

const AdminPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "published" | "draft"
  >("all");

  const { showSuccess, showError, showInfo } = useToast();

  // Memoize loadPosts function to prevent infinite re-renders
  const loadPosts = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const fetchedPosts = await blogService.getAllPosts();
      setPosts(fetchedPosts);

      if (fetchedPosts.length === 0) {
        showInfo(
          "No posts found",
          "Create your first blog post to get started!"
        );
      } else {
        showSuccess(
          "Posts loaded",
          `Successfully loaded ${fetchedPosts.length} posts`
        );
      }
    } catch (err) {
      const errorMessage = "Failed to load posts from database";
      setError(errorMessage);
      showError("Loading Error", errorMessage);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError, showInfo]);

  // Load posts from MongoDB
  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // Memoize filterPosts function to prevent infinite re-renders
  const filterPosts = useCallback(() => {
    let filtered: BlogPost[] = [...posts];

    switch (filterStatus) {
      case "published":
        filtered = posts.filter((post) => post.published === true);
        break;
      case "draft":
        filtered = posts.filter((post) => post.published === false);
        break;
      default:
        filtered = posts; // "all"
    }

    setFilteredPosts(filtered);
  }, [posts, filterStatus]);

  // Filter posts when posts or filterStatus changes
  useEffect(() => {
    filterPosts();
  }, [filterPosts]);

  const handleAddPost = useCallback(
    async (newPost: Partial<BlogPost>): Promise<void> => {
      try {
        setError(null);
        const createdPost = await blogService.createPost(newPost);
        setPosts((prevPosts) => [createdPost, ...prevPosts]);
        setIsFormOpen(false);
        showSuccess(
          "Post Created",
          `${createdPost.title} has been created successfully!`
        );
      } catch (err) {
        const errorMessage = "Failed to create post";
        setError(errorMessage);
        showError("Creation Error", errorMessage);
      }
    },
    [showSuccess, showError]
  );

  const handleEditPost = useCallback(
    async (updatedPost: Partial<BlogPost>): Promise<void> => {
      try {
        setError(null);
        if (!editingPost?._id) {
          const errorMessage = "No post ID found for editing";
          setError(errorMessage);
          showError("Edit Error", errorMessage);
          return;
        }

        const updated = await blogService.updatePost(
          editingPost._id,
          updatedPost
        );

        // Update the posts array with the updated post
        setPosts((prevPosts) => {
          const newPosts = prevPosts.map((post) =>
            post._id === updated._id ? updated : post
          );
          return newPosts;
        });

        setEditingPost(null);
        setIsFormOpen(false);

        showSuccess(
          "Post Updated",
          `${updated.title} has been updated successfully!`
        );
      } catch (err) {
        const errorMessage = "Failed to update post";
        setError(errorMessage);
        showError("Update Error", errorMessage);
      }
    },
    [editingPost?._id, showSuccess, showError]
  );

  const handleDeletePost = useCallback(
    async (postId: string): Promise<void> => {
      const postToDelete = posts.find((post) => post._id === postId);
      const postTitle = postToDelete?.title || "Post";

      if (confirm(`Are you sure you want to delete "${postTitle}"?`)) {
        try {
          setError(null);
          await blogService.deletePost(postId);
          setPosts((prevPosts) =>
            prevPosts.filter((post) => post._id !== postId)
          );
          showSuccess(
            "Post Deleted",
            `${postTitle} has been deleted successfully!`
          );
        } catch (err) {
          const errorMessage = "Failed to delete post";
          setError(errorMessage);
          showError("Delete Error", errorMessage);
        }
      } else {
        showInfo("Deletion Cancelled", "Post deletion was cancelled");
      }
    },
    [posts, showSuccess, showError, showInfo]
  );

  const openEditForm = useCallback(
    (post: BlogPost): void => {
      setEditingPost(post);
      setIsFormOpen(true);
      showInfo("Edit Mode", `Editing "${post.title}"`);
    },
    [showInfo]
  );

  const closeForm = useCallback((): void => {
    setIsFormOpen(false);
    setEditingPost(null);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-bg-primary">
        <div className="px-6 mx-auto max-w-7xl sm:px-8 lg:px-12">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 border-2 rounded-full border-secondary-indigo border-t-transparent animate-spin"></div>
              <p className="text-text-secondary">Loading posts...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-bg-primary">
      <div className="px-6 mx-auto max-w-7xl sm:px-8 lg:px-12">
        <div className="py-12">
          <AdminHeader error={error} setError={setError} />

          <AdminActionBar
            posts={posts}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            setIsFormOpen={setIsFormOpen}
          />

          <AdminContent
            filteredPosts={filteredPosts}
            filterStatus={filterStatus}
            onEdit={openEditForm}
            onDelete={handleDeletePost}
            setIsFormOpen={setIsFormOpen}
          />

          {/* Form Modal */}
          {isFormOpen && (
            <BlogPostForm
              post={editingPost}
              onSave={editingPost ? handleEditPost : handleAddPost}
              onCancel={closeForm}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
