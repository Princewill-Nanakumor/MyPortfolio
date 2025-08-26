"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiLockClosed, HiEye, HiEyeOff, HiClock } from "react-icons/hi";
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

  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  // Lockout states
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [lockoutUntil, setLockoutUntil] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  const { showSuccess, showError, showInfo } = useToast();

  // Check authentication and lockout status on mount
  useEffect(() => {
    const authStatus = localStorage.getItem("adminAuthenticated");
    const storedFailedAttempts = localStorage.getItem("adminFailedAttempts");
    const storedLockoutUntil = localStorage.getItem("adminLockoutUntil");

    if (authStatus === "true") {
      setIsAuthenticated(true);
    }

    if (storedFailedAttempts) {
      setFailedAttempts(parseInt(storedFailedAttempts));
    }

    if (storedLockoutUntil) {
      const lockoutTime = parseInt(storedLockoutUntil);
      const now = Date.now();

      if (now < lockoutTime) {
        setIsLocked(true);
        setLockoutUntil(lockoutTime);
      } else {
        // Lockout expired, reset
        localStorage.removeItem("adminLockoutUntil");
        localStorage.removeItem("adminFailedAttempts");
        setFailedAttempts(0);
        setIsLocked(false);
      }
    }
  }, []);

  // Timer for lockout countdown
  useEffect(() => {
    if (!isLocked) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const remaining = lockoutUntil - now;

      if (remaining <= 0) {
        setIsLocked(false);
        setLockoutUntil(0);
        setFailedAttempts(0);
        localStorage.removeItem("adminLockoutUntil");
        localStorage.removeItem("adminFailedAttempts");
        clearInterval(timer);
      } else {
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, "0")}`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isLocked, lockoutUntil]);

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

  // Load posts from MongoDB only when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadPosts();
    }
  }, [loadPosts, isAuthenticated]);

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
    if (isAuthenticated) {
      filterPosts();
    }
  }, [filterPosts, isAuthenticated]);

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

  // Authentication handlers
  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (isLocked) {
      setAuthError("Account is temporarily locked. Please try again later.");
      return;
    }

    setIsAuthenticating(true);
    setAuthError("");

    try {
      // Get password from environment variable
      const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASS;

      if (!correctPassword) {
        setAuthError(
          "Admin password not configured. Please contact administrator."
        );
        showError("Configuration Error", "Admin password not configured");
        return;
      }

      if (password === correctPassword) {
        // Successful login - reset failed attempts
        setIsAuthenticated(true);
        setFailedAttempts(0);
        localStorage.setItem("adminAuthenticated", "true");
        localStorage.removeItem("adminFailedAttempts");
        localStorage.removeItem("adminLockoutUntil");
        showSuccess("Access Granted", "Welcome to the admin panel!");
      } else {
        // Failed login - increment attempts
        const newFailedAttempts = failedAttempts + 1;
        setFailedAttempts(newFailedAttempts);
        localStorage.setItem(
          "adminFailedAttempts",
          newFailedAttempts.toString()
        );

        if (newFailedAttempts >= 3) {
          // Lock account for 1 hour
          const lockoutTime = Date.now() + 60 * 60 * 1000; // 1 hour
          setIsLocked(true);
          setLockoutUntil(lockoutTime);
          localStorage.setItem("adminLockoutUntil", lockoutTime.toString());

          setAuthError("Too many failed attempts. Account locked");
          showError("Account Locked", "Too many failed attempts.");
        } else {
          const remainingAttempts = 3 - newFailedAttempts;
          setAuthError(`Incorrect password.`);
          showError("Access Denied", `Incorrect password.`);
        }
      }
    } catch (err) {
      setAuthError("Authentication failed. Please try again.");
      showError("Authentication Error", "Failed to authenticate");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = (): void => {
    setIsAuthenticated(false);
    localStorage.removeItem("adminAuthenticated");
    setPassword("");
    setAuthError("");
    showInfo("Logged Out", "You have been logged out of the admin panel");
  };

  // Show authentication modal if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-20 bg-bg-primary">
        <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
          <AnimatePresence>
            <motion.div
              className="w-full max-w-md mx-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-8 bg-white rounded-2xl shadow-large">
                <div className="mb-8 text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-secondary-indigo/10">
                    <HiLockClosed className="w-8 h-8 text-secondary-indigo" />
                  </div>
                  <h1 className="mb-2 text-2xl font-bold text-text-primary">
                    Admin Access Required
                  </h1>
                  <p className="text-text-secondary">
                    Please enter the admin password to continue
                  </p>
                </div>

                {isLocked ? (
                  <div className="space-y-4 text-center">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full">
                      <HiClock className="w-8 h-8 text-red-600" />
                    </div>
                    <div>
                      <h2 className="mb-2 text-lg font-semibold text-red-600">
                        Account Temporarily Locked
                      </h2>
                      <p className="mb-4 text-sm text-gray-600">
                        Too many failed login attempts. Please try again later.
                      </p>
                      <div className="font-mono text-2xl text-red-600">
                        {timeRemaining}
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        Time remaining until unlock
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                      <label
                        htmlFor="password"
                        className="block mb-2 text-sm font-medium text-text-primary"
                      >
                        Admin Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-4 py-3 pr-12 transition-colors border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary-indigo/20 focus:border-secondary-indigo"
                          placeholder="Enter password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute text-gray-400 transition-colors transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <HiEyeOff className="w-5 h-5" />
                          ) : (
                            <HiEye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {authError && (
                      <div className="p-3 text-sm text-red-700 border border-red-200 bg-red-50 rounded-xl">
                        {authError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isAuthenticating || !password.trim()}
                      className="flex items-center justify-center w-full gap-2 px-6 py-3 text-white transition-colors bg-secondary-indigo rounded-xl hover:bg-secondary-indigo/80 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAuthenticating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                          Authenticating...
                        </>
                      ) : (
                        <>
                          <HiLockClosed className="w-4 h-4" />
                          Access Admin Panel
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

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
          {/* Logout Button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 transition-colors border border-gray-300 rounded-xl hover:bg-gray-50"
            >
              <HiLockClosed className="w-4 h-4" />
              Logout
            </button>
          </div>

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
