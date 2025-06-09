import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import * as variants from "./variants";

const ToastProvider = ToastPrimitive.Provider;
const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitive.Viewport.displayName;

interface AnimatedToastContentProps extends React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root> {
  variant?: "default" | "success" | "error" | "warning";
  animationVariant?: keyof typeof variants;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

const AnimatedToastContent = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Root>,
  AnimatedToastContentProps
>(({ 
  className, 
  variant = "default", 
  animationVariant = "toastSlide",
  title,
  description,
  action,
  children,
  ...props 
}, ref) => {
  return (
    <ToastPrimitive.Root
      ref={ref}
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
        {
          "bg-background": variant === "default",
          "border-green-500 bg-green-50 dark:bg-green-900/20": variant === "success",
          "border-red-500 bg-red-50 dark:bg-red-900/20": variant === "error",
          "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20": variant === "warning",
        },
        className
      )}
      {...props}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={variants[animationVariant]}
        className="flex flex-col gap-1"
      >
        {title && (
          <ToastPrimitive.Title className="text-sm font-semibold">
            {title}
          </ToastPrimitive.Title>
        )}
        {description && (
          <ToastPrimitive.Description className="text-sm opacity-90">
            {description}
          </ToastPrimitive.Description>
        )}
        {children}
      </motion.div>
      {action}
      <ToastPrimitive.Close className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  );
});
AnimatedToastContent.displayName = "AnimatedToastContent";

export interface AnimatedToastProps extends AnimatedToastContentProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  duration?: number;
}

export function AnimatedToast({
  open,
  onOpenChange,
  duration = 5000,
  ...props
}: AnimatedToastProps) {
  return (
    <AnimatePresence>
      {open && (
        <AnimatedToastContent
          open={open}
          onOpenChange={onOpenChange}
          duration={duration}
          {...props}
        />
      )}
    </AnimatePresence>
  );
}

export {
  ToastProvider,
  ToastViewport,
}; 