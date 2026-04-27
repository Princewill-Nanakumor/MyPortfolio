"use client";
import React from "react";

interface AdminPageShellProps {
  children: React.ReactNode;
}

const AdminPageShell: React.FC<AdminPageShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen pt-20 bg-bg-primary">
      <div className="px-6 mx-auto max-w-7xl sm:px-8 lg:px-12">
        <div className="py-12">{children}</div>
      </div>
    </div>
  );
};

export default AdminPageShell;
