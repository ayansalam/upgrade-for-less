import * as React from "react";
import { MotionConfig } from "framer-motion";

// Global spring presets
export const springs = {
  bouncy: {
    type: "spring",
    damping: 10,
    stiffness: 100,
    mass: 1,
  },
  gentle: {
    type: "spring",
    damping: 20,
    stiffness: 60,
  },
  stiff: {
    type: "spring",
    damping: 20,
    stiffness: 300,
  },
  slow: {
    type: "spring",
    damping: 30,
    stiffness: 40,
  },
} as const;

// Global duration presets
export const durations = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  verySlow: 0.8,
} as const;

// Global ease presets
export const easing = {
  smooth: [0.4, 0, 0.2, 1],
  smoothIn: [0.4, 0, 1, 1],
  smoothOut: [0, 0, 0.2, 1],
  anticipate: [0.4, 0, 0.6, -0.4],
  bounce: [0.68, -0.55, 0.265, 1.55],
} as const;

// Default animation config
export const defaultAnimationConfig = {
  initial: false,
  reducedMotion: "user",
  transition: {
    ...springs.gentle,
    duration: durations.normal,
  },
} as const;

// Helper to check if reduced motion is preferred
export const prefersReducedMotion = typeof window !== 'undefined' 
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
  : false;

interface AnimationProviderProps {
  children: React.ReactNode;
}

// Export a configured MotionConfig component with explicit return
export const AnimationProvider: React.FC<AnimationProviderProps> = ({ children }) => {
  return (
    <MotionConfig {...defaultAnimationConfig}>
      {children}
    </MotionConfig>
  );
}; 