"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Toast, { ToastItem } from "./Toast";

interface ToastContainerProps {
  toasts: ToastItem[];
  onRemoveToast: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemoveToast,
}) => {
  return (
    <div className="fixed z-[10050] space-y-3 pointer-events-none top-4 right-4 sm:top-6 sm:right-6">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast, index) => (
          <motion.div
            key={toast.id}
            layout
            className="pointer-events-auto"
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{ zIndex: 1000 - index }}
          >
            <Toast {...toast} onClose={onRemoveToast} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
