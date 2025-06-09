import { ReactNode } from "react";
import { motion, Variants } from "framer-motion";
import { Card } from "./card";
import { Button, ButtonProps } from "./button";

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export const AnimatedCard = ({ children, delay = 0, className = "", ...props }: AnimatedCardProps) => {
  const variants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay, duration: 0.4, ease: "easeOut" },
    },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      whileHover="hover"
      variants={variants}
      className={className}
    >
      <Card {...props}>{children}</Card>
    </motion.div>
  );
};

interface AnimatedButtonProps extends ButtonProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export const AnimatedButton = ({ children, delay = 0, className = "", ...props }: AnimatedButtonProps) => {
  const variants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { delay, duration: 0.4, ease: "easeOut" },
    },
    hover: { scale: 1.1, transition: { duration: 0.15 } },
    tap: { scale: 0.95 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      variants={variants}
      className={className}
    >
      <Button {...props}>{children}</Button>
    </motion.div>
  );
}; 