"use client";
import React from "react";

interface AdminLoadingStateProps {
  message?: string;
}

const AdminLoadingState: React.FC<AdminLoadingStateProps> = ({
  message = "Loading...",
}) => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-4 border-2 rounded-full border-secondary-indigo border-t-transparent animate-spin"></div>
        <p className="text-text-secondary">{message}</p>
      </div>
    </div>
  );
};

export default AdminLoadingState;
