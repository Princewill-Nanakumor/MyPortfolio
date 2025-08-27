"use client";
import { motion, AnimatePresence } from "framer-motion";

interface MessageModalProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const MessageModal = ({ message, isVisible, onClose }: MessageModalProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-sm p-4 text-center bg-white rounded-lg shadow-xl sm:p-6 lg:p-8"
          >
            <p className="mb-4 text-base font-medium text-gray-800 sm:text-lg lg:text-xl">
              {message}
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:px-6 sm:py-3 sm:text-base"
            >
              OK
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MessageModal;
