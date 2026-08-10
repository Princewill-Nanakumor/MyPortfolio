"use client";
import React from "react";
import { HiLockClosed, HiEye, HiEyeOff } from "react-icons/hi";

interface AdminLoginFormProps {
  password: string;
  showPassword: boolean;
  authError: string;
  isAuthenticating: boolean;
  onPasswordChange: (value: string) => void;
  onToggleShowPassword: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

const AdminLoginForm: React.FC<AdminLoginFormProps> = ({
  password,
  showPassword,
  authError,
  isAuthenticating,
  onPasswordChange,
  onToggleShowPassword,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
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
            onChange={(e) => onPasswordChange(e.target.value)}
            className="w-full px-4 py-3 pr-12 transition-colors border border-gray-300 rounded-xl shadow-none focus:outline-none focus:border-secondary-indigo"
            placeholder="Enter password"
            required
          />
          <button
            type="button"
            onClick={onToggleShowPassword}
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
  );
};

export default AdminLoginForm;
