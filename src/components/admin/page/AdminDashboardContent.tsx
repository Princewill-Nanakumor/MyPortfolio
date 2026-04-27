"use client";
import React from "react";
import { HiLockClosed } from "react-icons/hi";
import { BlogPost } from "@/types/Blog";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminActionBar from "@/components/admin/AdminActionBar";
import AdminContent from "@/components/admin/AdminContent";

interface AdminDashboardContentProps {
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  posts: BlogPost[];
  displayedPosts: BlogPost[];
  filterStatus: "all" | "published" | "draft";
  setFilterStatus: (status: "all" | "published" | "draft") => void;
  setIsFormOpen: (open: boolean) => void;
  onLogout: () => Promise<void>;
  onEdit: (post: BlogPost) => void;
  onDelete: (postId: string) => Promise<void>;
}

const AdminDashboardContent: React.FC<AdminDashboardContentProps> = ({
  error,
  setError,
  posts,
  displayedPosts,
  filterStatus,
  setFilterStatus,
  setIsFormOpen,
  onLogout,
  onEdit,
  onDelete,
}) => {
  return (
    <>
      <div className="flex justify-end mb-6">
        <button
          onClick={onLogout}
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
        filteredPosts={displayedPosts}
        filterStatus={filterStatus}
        onEdit={onEdit}
        onDelete={onDelete}
        setIsFormOpen={setIsFormOpen}
      />
    </>
  );
};

export default AdminDashboardContent;
