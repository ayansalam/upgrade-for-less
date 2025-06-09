import * as React from "react";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import * as variants from "./variants";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

interface AnimatedModalOverlayProps extends HTMLMotionProps<"div"> {
  animationVariant?: keyof typeof variants;
}

const AnimatedModalOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  AnimatedModalOverlayProps
>(({ className, animationVariant = "fadeIn", ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    asChild
  >
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants[animationVariant]}
      className={cn(
        "fixed inset-0 z-50 bg-black/80",
        className
      )}
      {...props}
    />
  </DialogPrimitive.Overlay>
));
AnimatedModalOverlay.displayName = "AnimatedModalOverlay";

interface AnimatedModalContentProps extends Omit<HTMLMotionProps<"div">, "children"> {
  animationVariant?: keyof typeof variants;
  showCloseButton?: boolean;
  children: React.ReactNode;
}

const AnimatedModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  AnimatedModalContentProps
>(({ 
  className, 
  children, 
  animationVariant = "modalContent",
  showCloseButton = true,
  ...props 
}, ref) => (
  <DialogPrimitive.Content
    ref={ref}
    asChild
  >
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants[animationVariant]}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      )}
    </motion.div>
  </DialogPrimitive.Content>
));
AnimatedModalContent.displayName = "AnimatedModalContent";

export interface AnimatedModalProps {
  trigger?: React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  overlayVariant?: keyof typeof variants;
  contentVariant?: keyof typeof variants;
  showCloseButton?: boolean;
  className?: string;
  overlayClassName?: string;
}

export function AnimatedModal({
  trigger,
  children,
  open,
  onOpenChange,
  overlayVariant = "fadeIn",
  contentVariant = "modalContent",
  showCloseButton = true,
  className,
  overlayClassName,
}: AnimatedModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <AnimatePresence>
        {open && (
          <DialogPortal>
            <AnimatedModalOverlay
              animationVariant={overlayVariant}
              className={overlayClassName}
            />
            <AnimatedModalContent
              animationVariant={contentVariant}
              showCloseButton={showCloseButton}
              className={className}
            >
              {children}
            </AnimatedModalContent>
          </DialogPortal>
        )}
      </AnimatePresence>
    </Dialog>
  );
} 