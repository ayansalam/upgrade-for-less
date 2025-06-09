import { motion } from "framer-motion";
import { Button, ButtonProps } from "./button";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps extends ButtonProps {
  delay?: number;
}

export function AnimatedButton({ 
  children, 
  className, 
  delay = 0,
  ...props 
}: AnimatedButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.3,
        delay,
        ease: "easeOut"
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        className={cn(
          "transition-colors duration-200",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
} 