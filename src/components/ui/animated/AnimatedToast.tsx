import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { springs } from "./motion.config";
import * as variants from "./variants";

interface AnimatedToastProps {
  message: string;
  onClose: () => void;
}

export function AnimatedToast({ message, onClose }: AnimatedToastProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants.fadeIn}
      transition={springs.gentle}
      className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg"
    >
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 text-sm">
          Close
        </button>
      </div>
    </motion.div>
  );
} 