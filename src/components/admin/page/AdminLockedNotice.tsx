"use client";
import React from "react";
import { HiClock } from "react-icons/hi";

const AdminLockedNotice: React.FC = () => {
  return (
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
      </div>
    </div>
  );
};

export default AdminLockedNotice;
