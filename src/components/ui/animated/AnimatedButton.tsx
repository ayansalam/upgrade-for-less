import * as React from "react";
import { motion, Variants, Target } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { springs, durations, prefersReducedMotion } from "./motion.config";
import * as variants from "./variants/index";

type AnimationVariant = "scale" | "bounce" | "rotate" | "lift" | "glow" | "shine";

interface AnimatedButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  animation?: AnimationVariant;
  isLoading?: boolean;
  loadingText?: string;
}

export function AnimatedButton({
  variant = "default",
  animation = "scale",
  size = "default",
  isLoading = false,
  loadingText,
  children,
  className,
  ...props
}: AnimatedButtonProps) {
  const getAnimationVariant = () => {
    if (prefersReducedMotion) return {};

    switch (animation) {
      case "scale":
        return variants.hoverScale;
      case "bounce":
        return variants.hoverBounce;
      case "rotate":
        return variants.hoverRotate;
      case "lift":
        return variants.hoverLift;
      case "glow":
        return variants.hoverGlow;
      case "shine":
        return variants.hoverShine;
      default:
        return variants.hoverScale;
    }
  };

  const buttonTransition = {
    ...springs.bouncy,
    duration: durations.fast,
  };

  const isCTA = variant === "default" && className?.includes("bg-gradient-to-r");

  const buttonContent = isLoading ? (
    <React.Fragment>
      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      <span>{loadingText || children}</span>
    </React.Fragment>
  ) : (
    children
  );

  return (
    <motion.div
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      animate="visible"
      variants={getAnimationVariant()}
      transition={buttonTransition}
    >
      <Button
        variant={variant}
        size={size}
        className={cn(
          isCTA && "bg-gradient-to-r from-primary to-secondary hover:opacity-90",
          isLoading && "cursor-not-allowed opacity-80",
          className
        )}
        disabled={isLoading}
        {...props}
      >
        {buttonContent}
      </Button>
    </motion.div>
  );
} 