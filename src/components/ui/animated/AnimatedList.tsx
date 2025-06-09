import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { springs, durations, prefersReducedMotion } from "./motion.config";
import * as variants from "./variants";

type ListVariant = "staggered" | "cascade" | "fade" | "slide" | "scale";
type ListDirection = "up" | "down" | "left" | "right";

interface AnimatedListProps {
  items: React.ReactNode[];
  variant?: ListVariant;
  direction?: ListDirection;
  staggerDelay?: number;
  isOrdered?: boolean;
  onAnimationComplete?: () => void;
  className?: string;
}

export function AnimatedList({
  items,
  variant = "staggered",
  direction = "up",
  staggerDelay = 0.1,
  isOrdered = false,
  onAnimationComplete,
  className,
}: AnimatedListProps) {
  const getAnimationVariant = () => {
    if (prefersReducedMotion) return {};

    const baseVariant = {
      hidden: { opacity: 0 },
      visible: (i: number) => ({
        opacity: 1,
        transition: {
          delay: i * staggerDelay,
          ...springs.gentle,
          duration: durations.normal,
        },
      }),
      exit: { opacity: 0 },
    };

    const directionOffset = {
      up: { y: 20 },
      down: { y: -20 },
      left: { x: 20 },
      right: { x: -20 },
    };

    switch (variant) {
      case "staggered":
        return {
          ...baseVariant,
          hidden: { ...baseVariant.hidden, ...directionOffset[direction] },
          visible: (i: number) => ({
            ...baseVariant.visible(i),
            [direction === "left" || direction === "right" ? "x" : "y"]: 0,
          }),
        };
      case "cascade":
        return {
          hidden: { opacity: 0, scale: 0.8, y: 20 },
          visible: (i: number) => ({
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
              delay: i * staggerDelay,
              ...springs.bouncy,
            },
          }),
        };
      case "fade":
        return variants.fadeIn;
      case "slide":
        return variants.fadeInUp;
      case "scale":
        return variants.scaleIn;
      default:
        return baseVariant;
    }
  };

  const ListComponent = isOrdered ? "ol" : "ul";
  const animationVariants = getAnimationVariant();

  return (
    <motion[typeof ListComponent]
      component={ListComponent}
      className={cn("list-none", className)}
    >
      <AnimatePresence>
        {items.map((item, i) => (
          <motion.li
            key={i}
            custom={i}
            variants={animationVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onAnimationComplete={
              i === items.length - 1 ? onAnimationComplete : undefined
            }
          >
            {item}
          </motion.li>
        ))}
      </AnimatePresence>
    </motion[typeof ListComponent]>
  );
} 