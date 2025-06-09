import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps extends HTMLMotionProps<"div"> {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "primary" | "secondary";
}

const spinTransition = {
  repeat: Infinity,
  ease: "linear",
  duration: 1,
};

const sizes = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-3",
};

const variants = {
  default: "border-muted-foreground/20 border-t-muted-foreground",
  primary: "border-primary/20 border-t-primary",
  secondary: "border-secondary/20 border-t-secondary",
};

export function LoadingSpinner({
  size = "md",
  variant = "default",
  className,
  ...props
}: LoadingSpinnerProps) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={spinTransition}
      className={cn(
        "rounded-full border-solid",
        sizes[size],
        variants[variant],
        className
      )}
      {...props}
    />
  );
} 