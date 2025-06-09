import { springs, durations, easing } from "./motion.config";

// Basic animations
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

export const fadeInDown = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

export const scaleInBounce = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: springs.bouncy,
  },
  exit: { opacity: 0, scale: 0.9 },
};

// Flip animations
export const flipInX = {
  hidden: { opacity: 0, rotateX: 90 },
  visible: { opacity: 1, rotateX: 0 },
  exit: { opacity: 0, rotateX: 90 },
};

export const flipInY = {
  hidden: { opacity: 0, rotateY: 90 },
  visible: { opacity: 1, rotateY: 0 },
  exit: { opacity: 0, rotateY: 90 },
};

// Bounce animations
export const bounceIn = {
  hidden: { opacity: 0, scale: 0.3 },
  visible: {
    opacity: 1,
    scale: [0.3, 1.1, 0.9, 1.03, 0.97, 1],
    transition: {
      times: [0, 0.2, 0.4, 0.6, 0.8, 1],
      ...springs.bouncy,
    },
  },
  exit: { opacity: 0, scale: 0.3 },
};

export const bounceInUp = {
  hidden: { opacity: 0, y: 100 },
  visible: {
    opacity: 1,
    y: [100, -20, 10, -5, 0],
    transition: {
      times: [0, 0.4, 0.6, 0.8, 1],
      ...springs.bouncy,
    },
  },
  exit: { opacity: 0, y: 100 },
};

// Hover effects
export const hoverScale = {
  initial: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

export const hoverBounce = {
  initial: { y: 0 },
  hover: { y: -5 },
  tap: { y: 2 },
};

export const hoverRotate = {
  initial: { rotate: 0 },
  hover: { rotate: 5 },
  tap: { rotate: -5 },
};

export const hoverLift = {
  initial: { y: 0, boxShadow: "0 0 0 rgba(0,0,0,0)" },
  hover: { 
    y: -4,
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    transition: springs.gentle,
  },
  tap: { y: -2 },
};

export const hoverGlow = {
  initial: { opacity: 1 },
  hover: { 
    opacity: 0.8,
    transition: {
      duration: durations.slow,
      ease: easing.smooth,
    },
  },
  tap: { opacity: 1 },
};

export const hoverShine = {
  initial: { backgroundPosition: "200% 50%" },
  hover: {
    backgroundPosition: "0% 50%",
    transition: {
      duration: durations.slow,
      ease: easing.smooth,
    },
  },
};

// Advanced effects
export const shake = {
  initial: { x: 0 },
  animate: {
    x: [-10, 10, -8, 8, -4, 4, 0],
    transition: {
      duration: 0.5,
      ease: easing.anticipate,
    },
  },
};

export const vibrate = {
  initial: { x: 0 },
  animate: {
    x: [-1, 1, -1, 1, 0],
    transition: {
      duration: 0.2,
      repeat: Infinity,
    },
  },
};

export const pulse = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: easing.smooth,
    },
  },
};

export const attention = {
  initial: { scale: 1, rotate: 0 },
  animate: {
    scale: [1, 1.1, 1],
    rotate: [0, -5, 5, -5, 0],
    transition: {
      duration: 0.5,
      ease: easing.anticipate,
    },
  },
};

// Page transitions
export const pageTransitionFade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export const pageTransitionSlide = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

export const pageTransitionZoom = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.05 },
};

// Hero animations
export const heroTitle = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.slow,
      ease: easing.smoothOut,
    },
  },
};

export const heroSubtitle = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.2,
      duration: durations.slow,
      ease: easing.smoothOut,
    },
  },
};

export const heroButton = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.4,
      ...springs.bouncy,
    },
  },
};

export const heroImage = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: 0.2,
      duration: durations.slow,
      ease: easing.smoothOut,
    },
  },
};

// Scroll animations
export const scrollFadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springs.gentle,
  },
};

export const scrollFadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: durations.normal,
      ease: easing.smooth,
    },
  },
};

export const scrollScale = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springs.gentle,
  },
};

// Component-specific
export const accordionContent = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: springs.gentle,
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { ...springs.gentle, duration: durations.fast },
  },
};

export const tooltipContent = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: springs.stiff,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: durations.fast },
  },
};

export const dropdownContent = {
  hidden: { opacity: 0, scale: 0.95, y: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: springs.stiff,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: { duration: durations.fast },
  },
};

export const toastSlide = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: springs.gentle,
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: { duration: durations.fast },
  },
}; 