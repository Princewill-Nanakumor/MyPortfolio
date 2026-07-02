"use client";
import { useState, useEffect, useCallback, FormEvent, useRef } from "react";
import { blogService } from "@/services/blogService";
import { BlogPost } from "@/types/Blog";
import { useToast } from "@/context/ToastContext";

export type AdminFilterStatus = "all" | "published" | "draft";

const hasDraftContent = (data: Partial<BlogPost>): boolean => {
  return Boolean(
    data.title?.trim() ||
      data.excerpt?.trim() ||
      data.image?.trim() ||
      data.category?.trim() ||
      data.readTime?.trim() ||
      (data.tags || []).length > 0 ||
      (data.content || []).length > 0
  );
};

const upsertPost = (prevPosts: BlogPost[], nextPost: BlogPost): BlogPost[] => {
  const existingIndex = prevPosts.findIndex((post) => post._id === nextPost._id);
  if (existingIndex >= 0) {
    const nextPosts = [...prevPosts];
    nextPosts[existingIndex] = nextPost;
    return nextPosts;
  }
  return [nextPost, ...prevPosts];
};

export const useAdminPageController = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [liveDraftPreview, setLiveDraftPreview] = useState<Partial<BlogPost> | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<AdminFilterStatus>("all");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [lockoutTime, setLockoutTime] = useState<number>(0);
  const [, setTimeRemaining] = useState<string>("");
  const latestDraftIdRef = useRef<string | null>(null);
  const createDraftInFlightRef = useRef<Promise<BlogPost | null> | null>(null);

  const { showSuccess, showError, showInfo } = useToast();

  const checkLockoutStatus = useCallback(() => {
    const storedLockoutTime = localStorage.getItem("adminLockoutUntil");
    if (!storedLockoutTime) return;

    const nextLockoutTime = parseInt(storedLockoutTime, 10);
    const now = Date.now();
    if (now < nextLockoutTime) {
      setIsLocked(true);
      setLockoutTime(nextLockoutTime);
      return;
    }

    localStorage.removeItem("adminLockoutUntil");
    setIsLocked(false);
    setLockoutTime(0);
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/verify", {
        method: "GET",
        credentials: "include",
      });
      setIsAuthenticated(response.ok);
    } catch {
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
    checkLockoutStatus();
  }, [checkAuthStatus, checkLockoutStatus]);

  useEffect(() => {
    if (!isLocked) return;

    const timer = setInterval(() => {
      const remaining = lockoutTime - Date.now();
      if (remaining <= 0) {
        setIsLocked(false);
        setLockoutTime(0);
        setTimeRemaining("");
        localStorage.removeItem("adminLockoutUntil");
        clearInterval(timer);
        return;
      }
      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, "0")}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [isLocked, lockoutTime]);

  const loadPosts = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const fetchedPosts = await blogService.getAllPosts();
      setPosts(fetchedPosts);

      if (fetchedPosts.length === 0) {
        showInfo("No posts found", "Create your first blog post to get started!");
      } else {
        showSuccess("Posts loaded", `Successfully loaded ${fetchedPosts.length} posts`);
      }
    } catch {
      const errorMessage = "Failed to load posts from database";
      setError(errorMessage);
      showError("Loading Error", errorMessage);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [showError, showInfo, showSuccess]);

  useEffect(() => {
    if (isAuthenticated) loadPosts();
  }, [isAuthenticated, loadPosts]);

  const filterPosts = useCallback(() => {
    switch (filterStatus) {
      case "published":
        setFilteredPosts(posts.filter((post) => post.published === true));
        break;
      case "draft":
        setFilteredPosts(posts.filter((post) => post.published === false));
        break;
      default:
        setFilteredPosts(posts);
    }
  }, [filterStatus, posts]);

  useEffect(() => {
    if (isAuthenticated) filterPosts();
  }, [filterPosts, isAuthenticated]);

  const mergeLiveDraft = useCallback(
    (basePosts: BlogPost[]): BlogPost[] => {
      if (!isFormOpen || !liveDraftPreview) {
        return basePosts;
      }

      const targetId = liveDraftPreview._id || editingPost?._id || "__live_draft__";
      const hasPersistedTarget = Boolean(liveDraftPreview._id || editingPost?._id);
      if (!hasDraftContent(liveDraftPreview) && !hasPersistedTarget) {
        return basePosts;
      }

      const existingPost =
        basePosts.find((post) => post._id === targetId) ||
        posts.find((post) => post._id === targetId);

      const previewPost: BlogPost = {
        _id: targetId,
        title:
          (liveDraftPreview.title ?? "").trim() === ""
            ? "Untitled Draft"
            : (liveDraftPreview.title as string),
        slug: liveDraftPreview.slug ?? "",
        excerpt: liveDraftPreview.excerpt ?? "",
        content: liveDraftPreview.content ?? [],
        image: liveDraftPreview.image ?? "",
        readTime: liveDraftPreview.readTime ?? "",
        category: liveDraftPreview.category ?? "",
        tags: liveDraftPreview.tags ?? [],
        published: existingPost?.published ?? false,
        likes: existingPost?.likes ?? 0,
        id: existingPost?.id,
        date: existingPost?.date,
        author: existingPost?.author,
        createdAt: existingPost?.createdAt,
        updatedAt: existingPost?.updatedAt,
      };

      return upsertPost(basePosts, previewPost);
    },
    [editingPost?._id, isFormOpen, liveDraftPreview, posts]
  );

  const displayedPosts = mergeLiveDraft(filteredPosts);

  const handleAddPost = useCallback(
    async (newPost: Partial<BlogPost>): Promise<void> => {
      try {
        setError(null);
        const matchedDraft = !newPost._id
          ? posts.find(
              (post) =>
                !post.published &&
                ((newPost.slug && post.slug === newPost.slug) ||
                  (newPost.title &&
                    post.title &&
                    post.title.trim() === newPost.title.trim()))
            )
          : null;

        const draftToPublishId = newPost._id || matchedDraft?._id;

        const publishedPost = draftToPublishId
          ? await blogService.updatePost(draftToPublishId, {
              ...newPost,
              published: true,
            })
          : await blogService.createPost({ ...newPost, published: true });

        setPosts((prevPosts) => {
          const withPublished = upsertPost(prevPosts, publishedPost);

          return withPublished.filter((post) => {
            if (post._id === publishedPost._id) return true;
            if (post.published) return true;

            const sameSlug =
              Boolean(post.slug) &&
              Boolean(publishedPost.slug) &&
              post.slug === publishedPost.slug;
            const sameTitle =
              Boolean(post.title) &&
              Boolean(publishedPost.title) &&
              post.title.trim() === publishedPost.title.trim();

            return !(sameSlug || sameTitle);
          });
        });

        latestDraftIdRef.current = publishedPost._id || null;
        setIsFormOpen(false);
        showSuccess("Post Created", `${publishedPost.title} has been created successfully!`);
      } catch {
        try {
          const draftPost = newPost._id
            ? await blogService.updatePost(newPost._id, { ...newPost, published: false })
            : await blogService.createPost({ ...newPost, published: false });

          setPosts((prevPosts) => upsertPost(prevPosts, draftPost));
          setIsFormOpen(false);
          setError(null);
          showInfo(
            "Saved as Draft",
            `${draftPost.title} could not be published and was saved as a draft.`
          );
        } catch {
          const errorMessage = "Failed to create post and save draft";
          setError(errorMessage);
          showError("Creation Error", errorMessage);
        }
      }
    },
    [posts, showError, showInfo, showSuccess]
  );

  const handleAutoSaveDraft = useCallback(
    async (draftData: Partial<BlogPost>): Promise<BlogPost | null> => {
      if (!hasDraftContent(draftData)) return null;
      try {
        const draftId = draftData._id || latestDraftIdRef.current;

        if (draftId) {
          const updatedDraft = await blogService.updatePost(draftId, {
            ...draftData,
            _id: draftId,
            published: false,
          });
          latestDraftIdRef.current = updatedDraft._id || draftId;
          setPosts((prevPosts) => upsertPost(prevPosts, updatedDraft));
          return updatedDraft;
        }

        if (createDraftInFlightRef.current) {
          return await createDraftInFlightRef.current;
        }

        createDraftInFlightRef.current = (async () => {
          const generatedDraftSlug = `draft-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 8)}`;

          const createdDraft = await blogService.createPost({
            ...draftData,
            slug: draftData.slug?.trim() || generatedDraftSlug,
            published: false,
          });
          latestDraftIdRef.current = createdDraft._id || null;
          setPosts((prevPosts) => upsertPost(prevPosts, createdDraft));
          return createdDraft;
        })();

        const savedDraft = await createDraftInFlightRef.current;
        createDraftInFlightRef.current = null;
        return savedDraft;

      } catch (error) {
        createDraftInFlightRef.current = null;
        console.warn("Auto-save draft failed:", error);
        return null;
      }
    },
    []
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

        const updated = await blogService.updatePost(editingPost._id, {
          ...updatedPost,
          published: updatedPost.published ?? true,
        });
        setPosts((prevPosts) =>
          prevPosts.map((post) => (post._id === updated._id ? updated : post))
        );
        setEditingPost(null);
        setIsFormOpen(false);
        showSuccess("Post Updated", `${updated.title} has been updated successfully!`);
      } catch {
        const errorMessage = "Failed to update post";
        setError(errorMessage);
        showError("Update Error", errorMessage);
      }
    },
    [editingPost?._id, showError, showSuccess]
  );

  const handleTogglePublish = useCallback(
    async (postId: string, published: boolean): Promise<void> => {
      const post = posts.find((item) => item._id === postId);
      const postTitle = post?.title || "Post";

      try {
        setError(null);
        const updated = await blogService.togglePublish(postId, published);
        setPosts((prevPosts) =>
          prevPosts.map((item) => (item._id === updated._id ? updated : item))
        );
        showSuccess(
          published ? "Post Published" : "Post Unpublished",
          `${postTitle} is now ${published ? "published" : "a draft"}.`
        );
      } catch {
        const errorMessage = `Failed to ${published ? "publish" : "unpublish"} post`;
        setError(errorMessage);
        showError("Publish Error", errorMessage);
      }
    },
    [posts, showError, showSuccess]
  );

  const handleDeletePost = useCallback(
    async (postId: string): Promise<void> => {
      const postToDelete = posts.find((post) => post._id === postId);
      const postTitle = postToDelete?.title || "Post";

      if (!confirm(`Are you sure you want to delete "${postTitle}"?`)) {
        showInfo("Deletion Cancelled", "Post deletion was cancelled");
        return;
      }

      try {
        setError(null);
        await blogService.deletePost(postId);
        setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
        showSuccess("Post Deleted", `${postTitle} has been deleted successfully!`);
      } catch {
        const errorMessage = "Failed to delete post";
        setError(errorMessage);
        showError("Delete Error", errorMessage);
      }
    },
    [posts, showError, showInfo, showSuccess]
  );

  const openEditForm = useCallback(
    (post: BlogPost): void => {
      setEditingPost(post);
      setIsFormOpen(true);
      latestDraftIdRef.current = post._id || null;
    },
    []
  );

  const closeForm = useCallback((): void => {
    setIsFormOpen(false);
    setEditingPost(null);
    setLiveDraftPreview(null);
    latestDraftIdRef.current = null;
    createDraftInFlightRef.current = null;
  }, []);

  const handleLogin = useCallback(
    async (e: FormEvent): Promise<void> => {
      e.preventDefault();
      if (isLocked) {
        setAuthError("Account is temporarily locked. Please try again later.");
        return;
      }

      setIsAuthenticating(true);
      setAuthError("");
      try {
        const response = await fetch("/api/admin/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ password }),
        });

        const data = await response.json();
        if (response.ok) {
          setIsAuthenticated(true);
          setPassword("");
          setIsLocked(false);
          setLockoutTime(0);
          setTimeRemaining("");
          localStorage.removeItem("adminLockoutUntil");
          showSuccess("Access Granted", "Welcome to the admin panel!");
          return;
        }

        setAuthError(data.error || "Authentication failed");
        showError("Access Denied", data.error || "Authentication failed");
        if (response.status === 429) {
          setIsLocked(true);
          const lockoutUntil = Date.now() + 60 * 60 * 1000;
          setLockoutTime(lockoutUntil);
          localStorage.setItem("adminLockoutUntil", lockoutUntil.toString());
        }
      } catch {
        setAuthError("Authentication failed. Please try again.");
        showError("Authentication Error", "Failed to authenticate");
      } finally {
        setIsAuthenticating(false);
      }
    },
    [isLocked, password, showError, showSuccess]
  );

  const handleLogout = useCallback(async (): Promise<void> => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsAuthenticated(false);
      setPassword("");
      setAuthError("");
      setIsLocked(false);
      setLockoutTime(0);
      setTimeRemaining("");
      localStorage.removeItem("adminLockoutUntil");
      showInfo("Logged Out", "You have been logged out of the admin panel");
    }
  }, [showInfo]);

  return {
    error,
    setError,
    posts,
    displayedPosts,
    filterStatus,
    setFilterStatus,
    isAuthenticated,
    isLocked,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    authError,
    isAuthenticating,
    loading,
    isFormOpen,
    setIsFormOpen,
    editingPost,
    setLiveDraftPreview,
    handleLogin,
    handleLogout,
    openEditForm,
    closeForm,
    handleDeletePost,
    handleAddPost,
    handleEditPost,
    handleAutoSaveDraft,
    handleTogglePublish,
  };
};
