import { Variants } from "framer-motion";

// Basic fade animations
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.4 }
  }
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }
  }
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }
  }
};

// Scale animations
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4 }
  }
};

export const scaleInBounce: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1,
    scale: 1,
    transition: { 
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

// Slide animations
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1,
    x: 0,
    transition: { duration: 0.4 }
  }
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1,
    x: 0,
    transition: { duration: 0.4 }
  }
};

// Flip animations
export const flipInX: Variants = {
  hidden: { 
    opacity: 0,
    rotateX: 90,
    transformPerspective: 1000
  },
  visible: { 
    opacity: 1,
    rotateX: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export const flipInY: Variants = {
  hidden: { 
    opacity: 0,
    rotateY: 90,
    transformPerspective: 1000
  },
  visible: { 
    opacity: 1,
    rotateY: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// Bounce animations
export const bounceIn: Variants = {
  hidden: { 
    opacity: 0,
    scale: 0.3
  },
  visible: { 
    opacity: 1,
    scale: [0.3, 1.1, 0.9, 1.03, 0.97, 1],
    transition: {
      times: [0, 0.2, 0.4, 0.6, 0.8, 1],
      duration: 0.8
    }
  }
};

export const bounceInUp: Variants = {
  hidden: { 
    opacity: 0,
    y: 100
  },
  visible: { 
    opacity: 1,
    y: [100, -20, 10, -5, 0],
    transition: {
      times: [0, 0.4, 0.6, 0.8, 1],
      duration: 0.8
    }
  }
};

// Shake and vibrate animations
export const shake: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    x: [0, -10, 10, -10, 10, -5, 5, -2, 2, 0],
    transition: {
      times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1],
      duration: 0.8
    }
  }
};

export const vibrate: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    x: [0, -1, 1, -1, 1, -0.5, 0.5, -0.25, 0.25, 0],
    transition: {
      times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1],
      duration: 0.5,
      repeat: Infinity,
      repeatType: "loop"
    }
  }
};

// Pulse and attention animations
export const pulse: Variants = {
  hidden: { opacity: 0, scale: 1 },
  visible: { 
    opacity: 1,
    scale: [1, 1.05, 1],
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatType: "reverse"
    }
  }
};

export const attention: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    scale: [1, 1.1, 1],
    transition: {
      duration: 0.5,
      times: [0, 0.5, 1],
      repeat: 3
    }
  }
};

// Swing and rotate animations
export const swing: Variants = {
  hidden: { 
    opacity: 0,
    rotate: -45,
    transformOrigin: "top center"
  },
  visible: { 
    opacity: 1,
    rotate: [0, 15, -10, 5, -5, 0],
    transition: {
      times: [0, 0.2, 0.4, 0.6, 0.8, 1],
      duration: 0.8
    }
  }
};

export const rotateIn: Variants = {
  hidden: { 
    opacity: 0,
    rotate: -180,
    scale: 0.3
  },
  visible: { 
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: { duration: 0.5 }
  }
};

// Hover animations
export const hoverScale: Variants = {
  hover: { 
    scale: 1.05,
    transition: { duration: 0.2 }
  }
};

export const hoverBounce: Variants = {
  hover: { 
    scale: 1.05,
    transition: { 
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
};

export const hoverRotate: Variants = {
  hover: { 
    rotate: 5,
    transition: { duration: 0.2 }
  }
};

export const hoverLift: Variants = {
  hover: { 
    y: -5,
    transition: { duration: 0.2 }
  }
};

export const hoverGlow: Variants = {
  hover: { 
    scale: 1.02,
    boxShadow: "0 0 20px rgba(0,0,0,0.1)",
    transition: { duration: 0.2 }
  }
};

export const hoverShine: Variants = {
  hover: {
    backgroundPosition: ["200% 50%", "-100% 50%"],
    transition: {
      duration: 1,
      ease: "linear",
      repeat: Infinity
    }
  }
};

// Tap animations
export const tapScale: Variants = {
  tap: { scale: 0.95 }
};

export const tapSpring: Variants = {
  tap: { 
    scale: 0.95,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
};

// Page transitions
export const pageTransitionFade: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.4,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

export const pageTransitionSlide: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1,
    x: 0,
    transition: { 
      duration: 0.4,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: { duration: 0.3 }
  }
};

export const pageTransitionZoom: Variants = {
  hidden: { 
    opacity: 0,
    scale: 0.95,
    y: 10
  },
  visible: { 
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: {
      duration: 0.2
    }
  }
};

// List and stagger animations
export const listItem: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1,
    x: 0
  }
};

export const staggerChildren: Variants = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const staggerFade: Variants = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: {
      delay: i * 0.1
    }
  })
};

// Component-specific animations
export const accordionContent: Variants = {
  hidden: { 
    opacity: 0,
    height: 0,
    transition: { duration: 0.2 }
  },
  visible: { 
    opacity: 1,
    height: "auto",
    transition: { duration: 0.3 }
  }
};

export const tooltipContent: Variants = {
  hidden: { 
    opacity: 0,
    scale: 0.95,
    y: 10
  },
  visible: { 
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  }
};

export const modalContent: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: -20
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: 0.2
    }
  }
};

// Hero Section Animations
export const heroTitle: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export const heroSubtitle: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.2,
      ease: "easeOut"
    }
  }
};

export const heroButton: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      delay: 0.4,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  },
  tap: {
    scale: 0.95
  }
};

export const heroImage: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.2,
      ease: "easeOut"
    }
  }
};

// Scroll Animations
export const scrollFadeUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export const scrollFadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export const scrollScale: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// Toast Animations
export const toastSlide: Variants = {
  hidden: { opacity: 0, x: 50, y: 0 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30
    }
  },
  exit: {
    opacity: 0,
    x: 50,
    transition: {
      duration: 0.2
    }
  }
};

// Dropdown Animations
export const dropdownContent: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transformOrigin: "top"
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: {
      duration: 0.2
    }
  }
}; 