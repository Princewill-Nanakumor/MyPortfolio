// src/components/admin/AdminHeader.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";

interface AdminHeaderProps {
  error: string | null;
  setError: (error: string | null) => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ error, setError }) => {
  return (
    <>
      {/* Header */}
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="mb-4 heading-2 text-text-primary">
          Blog <span className="gradient-text">Administration</span>
        </h1>
        <div className="flex items-center justify-center mb-4 space-x-2 sm:space-x-4">
          <div className="w-8 h-px sm:w-16 bg-gradient-to-r from-transparent to-secondary-indigo"></div>
          <div className="w-2 h-2 rounded-full sm:w-3 sm:h-3 bg-secondary-indigo"></div>
          <div className="w-8 h-px sm:w-16 bg-gradient-to-r from-secondary-indigo to-transparent"></div>
        </div>
        <p className="max-w-2xl mx-auto body-large text-text-secondary">
          Manage your blog posts stored in MongoDB database
        </p>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          className="p-4 mb-6 border border-red-200 bg-red-50 rounded-xl"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-sm text-red-600 hover:text-red-800"
          >
            Dismiss
          </button>
        </motion.div>
      )}
    </>
  );
};

export default AdminHeader;
