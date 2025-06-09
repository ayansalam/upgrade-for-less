import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { springs, durations } from "./motion.config";
import * as variants from "./variants";

interface AnimatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function AnimatedModal({
  isOpen,
  onClose,
  children,
  className,
}: AnimatedModalProps) {
  return (
    <div className={cn("fixed inset-0 z-50 flex items-center justify-center", className)}>
      {isOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants.scaleIn}
          transition={springs.gentle}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <button onClick={onClose} className="absolute top-2 right-2">
            Close
          </button>
          {children}
        </motion.div>
      )}
    </div>
  );
} 