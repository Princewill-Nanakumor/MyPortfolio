// src/components/admin/AdminActionBar.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import { HiPlus, HiFilter } from "react-icons/hi";
import { BlogPost } from "@/types/Blog";

interface AdminActionBarProps {
  posts: BlogPost[];
  filterStatus: "all" | "published" | "draft";
  setFilterStatus: (status: "all" | "published" | "draft") => void;
  setIsFormOpen: (open: boolean) => void;
}

const AdminActionBar: React.FC<AdminActionBarProps> = ({
  posts,
  filterStatus,
  setFilterStatus,
  setIsFormOpen,
}) => {
  return (
    <motion.div
      className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      {/* Filter */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <HiFilter className="w-5 h-5 text-text-secondary" />
          <span className="text-sm font-medium text-text-primary">Filter:</span>
        </div>
        <div className="flex overflow-hidden bg-white border border-gray-200 rounded-xl shadow-soft">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              filterStatus === "all"
                ? "bg-secondary-indigo text-white"
                : "text-text-secondary hover:text-text-primary hover:bg-gray-50"
            }`}
          >
            All ({posts.length})
          </button>
          <button
            onClick={() => setFilterStatus("published")}
            className={`px-4 py-2 text-sm font-medium transition-colors border-l border-gray-200 ${
              filterStatus === "published"
                ? "bg-green-600 text-white"
                : "text-text-secondary hover:text-text-primary hover:bg-gray-50"
            }`}
          >
            Published ({posts.filter((post) => post.published).length})
          </button>
          <button
            onClick={() => setFilterStatus("draft")}
            className={`px-4 py-2 text-sm font-medium transition-colors border-l border-gray-200 ${
              filterStatus === "draft"
                ? "bg-orange-600 text-white"
                : "text-text-secondary hover:text-text-primary hover:bg-gray-50"
            }`}
          >
            Drafts ({posts.filter((post) => !post.published).length})
          </button>
        </div>
      </div>

      {/* Add Post Button */}
      <button
        onClick={() => setIsFormOpen(true)}
        className="inline-flex items-center btn-primary"
      >
        <HiPlus className="w-4 h-4 mr-2" />
        Add New Post
      </button>
    </motion.div>
  );
};

export default AdminActionBar;
