import { ReactNode } from "react";
import { motion, Variants } from "framer-motion";
import { Card } from "../card";
import { Button, ButtonProps } from "../button";
import { Input } from "../input";
import { Dialog, DialogContent } from "../dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as variants from "./variants";

// Common animation props interface
interface AnimationProps {
  delay?: number;
  animationVariant?: keyof typeof variants;
  className?: string;
}

// Helper to combine variants with delay
const withDelay = (variant: Variants, delay: number = 0): Variants => ({
  ...variant,
  visible: {
    ...variant.visible,
    transition: {
      ...variant.visible?.transition,
      delay,
    },
  },
});

// AnimatedCard Component
interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number;
  animationVariant?: keyof typeof variants;
}

export const AnimatedCard = ({ 
  children, 
  delay = 0, 
  animationVariant = "fadeInUp",
  className = "", 
  ...props 
}: AnimatedCardProps) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      whileHover="hover"
      variants={withDelay(variants[animationVariant], delay)}
      className={className}
    >
      <Card {...props}>{children}</Card>
    </motion.div>
  );
};

// AnimatedButton Component
interface AnimatedButtonProps extends Omit<ButtonProps, "variant"> {
  delay?: number;
  animationVariant?: keyof typeof variants;
  buttonVariant?: ButtonProps["variant"];
}

export const AnimatedButton = ({ 
  children, 
  delay = 0, 
  animationVariant = "scaleInBounce",
  buttonVariant = "default",
  className = "", 
  ...props 
}: AnimatedButtonProps) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      variants={withDelay({ ...variants[animationVariant], ...variants.tapScale }, delay)}
      className={className}
    >
      <Button variant={buttonVariant} {...props}>{children}</Button>
    </motion.div>
  );
};

// AnimatedInput Component
interface AnimatedInputProps extends React.ComponentProps<"input"> {
  delay?: number;
  animationVariant?: keyof typeof variants;
}

export const AnimatedInput = ({ 
  delay = 0, 
  animationVariant = "fadeInDown",
  className = "", 
  ...props 
}: AnimatedInputProps) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={withDelay(variants[animationVariant], delay)}
      className={className}
    >
      <Input {...props} />
    </motion.div>
  );
};

// AnimatedDialog Component
interface AnimatedDialogProps extends DialogPrimitive.DialogProps {
  contentClassName?: string;
  animationVariant?: keyof typeof variants;
  children: ReactNode;
}

export const AnimatedDialog = ({ 
  children, 
  animationVariant = "scaleIn",
  contentClassName = "", 
  ...props 
}: AnimatedDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className={contentClassName}>
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants[animationVariant]}
        >
          {children}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

// AnimatedList Component
interface AnimatedListProps {
  items: ReactNode[];
  delay?: number;
  animationVariant?: keyof typeof variants;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

export const AnimatedList = ({ 
  items, 
  delay = 0,
  animationVariant = "fadeInUp",
  as: Component = "div",
  className = "" 
}: AnimatedListProps) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={withDelay(variants.pageTransition, delay)}
      className={className}
    >
      {items.map((item, index) => (
        <motion.div key={index} variants={variants.listItem}>
          {item}
        </motion.div>
      ))}
    </motion.div>
  );
}; 