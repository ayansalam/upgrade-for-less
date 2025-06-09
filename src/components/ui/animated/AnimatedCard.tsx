import * as React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { springs, durations, prefersReducedMotion } from "./motion.config";
import * as variants from "./variants";

type AnimationVariant = "scale" | "lift" | "glow" | "shine" | "fade" | "slide";

interface AnimatedCardProps extends React.ComponentPropsWithoutRef<typeof Card> {
  animation?: AnimationVariant;
  isHoverable?: boolean;
  isClickable?: boolean;
  children: React.ReactNode;
}

export function AnimatedCard({
  animation = "lift",
  isHoverable = true,
  isClickable = false,
  children,
  className,
  ...props
}: AnimatedCardProps) {
  const getAnimationVariant = () => {
    if (prefersReducedMotion) return {};

    switch (animation) {
      case "scale":
        return variants.hoverScale;
      case "lift":
        return variants.hoverLift;
      case "glow":
        return variants.hoverGlow;
      case "shine":
        return variants.hoverShine;
      case "fade":
        return variants.fadeIn;
      case "slide":
        return variants.fadeInUp;
      default:
        return variants.hoverLift;
    }
  };

  const cardTransition = {
    ...springs.gentle,
    duration: durations.normal,
  };

  return (
    <motion.div
      variants={getAnimationVariant()}
      initial={animation === "fade" || animation === "slide" ? "hidden" : "initial"}
      animate={animation === "fade" || animation === "slide" ? "visible" : undefined}
      exit={animation === "fade" || animation === "slide" ? "exit" : undefined}
      whileHover={isHoverable ? "hover" : undefined}
      whileTap={isClickable ? "tap" : undefined}
      transition={cardTransition}
    >
      <Card
        className={cn(
          isClickable && "cursor-pointer",
          isHoverable && "transition-colors",
          className
        )}
        {...props}
      >
        {children}
      </Card>
    </motion.div>
  );
} 