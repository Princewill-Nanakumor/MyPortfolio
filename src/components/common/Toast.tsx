"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiX,
  HiCheckCircle,
  HiExclamation,
  HiInformationCircle,
  HiExclamationCircle,
} from "react-icons/hi";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300); // Wait for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, id, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(id), 300);
  };

  const getToastStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-50 border-green-200",
          icon: "text-green-500",
          title: "text-green-800",
          message: "text-green-700",
          close: "text-green-400 hover:text-green-600",
          iconComponent: HiCheckCircle,
        };
      case "error":
        return {
          bg: "bg-red-50 border-red-200",
          icon: "text-red-500",
          title: "text-red-800",
          message: "text-red-700",
          close: "text-red-400 hover:text-red-600",
          iconComponent: HiExclamation,
        };
      case "warning":
        return {
          bg: "bg-yellow-50 border-yellow-200",
          icon: "text-yellow-500",
          title: "text-yellow-800",
          message: "text-yellow-700",
          close: "text-yellow-400 hover:text-yellow-600",
          iconComponent: HiExclamationCircle,
        };
      case "info":
        return {
          bg: "bg-blue-50 border-blue-200",
          icon: "text-blue-500",
          title: "text-blue-800",
          message: "text-blue-700",
          close: "text-blue-400 hover:text-blue-600",
          iconComponent: HiInformationCircle,
        };
      default:
        return {
          bg: "bg-gray-50 border-gray-200",
          icon: "text-gray-500",
          title: "text-gray-800",
          message: "text-gray-700",
          close: "text-gray-400 hover:text-gray-600",
          iconComponent: HiInformationCircle,
        };
    }
  };

  const styles = getToastStyles();
  const IconComponent = styles.iconComponent;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`relative flex items-start p-4 border rounded-xl shadow-lg max-w-sm w-full ${styles.bg}`}
        >
          {/* Icon */}
          <div className={`flex-shrink-0 mr-3 ${styles.icon}`}>
            <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className={`text-sm font-medium sm:text-base ${styles.title}`}>
              {title}
            </h4>
            {message && (
              <p className={`mt-1 text-xs sm:text-sm ${styles.message}`}>
                {message}
              </p>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className={`flex-shrink-0 ml-3 p-1 rounded-lg transition-colors duration-200 ${styles.close}`}
            aria-label="Close toast"
          >
            <HiX className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 h-1 bg-current opacity-20 rounded-b-xl">
            <motion.div
              className="h-full bg-current rounded-b-xl"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: duration / 1000, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
