"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiLockClosed } from "react-icons/hi";
import AdminLockedNotice from "./AdminLockedNotice";
import AdminLoginForm from "./AdminLoginForm";

interface AdminAuthCardProps {
  isLocked: boolean;
  password: string;
  showPassword: boolean;
  authError: string;
  isAuthenticating: boolean;
  onPasswordChange: (value: string) => void;
  onToggleShowPassword: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

const AdminAuthCard: React.FC<AdminAuthCardProps> = ({
  isLocked,
  password,
  showPassword,
  authError,
  isAuthenticating,
  onPasswordChange,
  onToggleShowPassword,
  onSubmit,
}) => {
  return (
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
              <AdminLockedNotice />
            ) : (
              <AdminLoginForm
                password={password}
                showPassword={showPassword}
                authError={authError}
                isAuthenticating={isAuthenticating}
                onPasswordChange={onPasswordChange}
                onToggleShowPassword={onToggleShowPassword}
                onSubmit={onSubmit}
              />
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AdminAuthCard;
