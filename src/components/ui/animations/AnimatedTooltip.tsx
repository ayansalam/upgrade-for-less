import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";
import * as variants from "./variants";

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & {
    animationVariant?: keyof typeof variants;
  }
>(({ className, sideOffset = 4, animationVariant = "tooltipContent", ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md",
      className
    )}
    {...props}
  >
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={variants[animationVariant]}
    >
      {props.children}
    </motion.div>
  </TooltipPrimitive.Content>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export interface AnimatedTooltipProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  contentVariant?: keyof typeof variants;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  delayDuration?: number;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

export function AnimatedTooltip({
  trigger,
  content,
  contentVariant = "tooltipContent",
  side = "top",
  align = "center",
  delayDuration = 200,
  className,
  triggerClassName,
  contentClassName,
}: AnimatedTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={delayDuration}>
        <TooltipTrigger className={triggerClassName}>
          {trigger}
        </TooltipTrigger>
        <AnimatePresence>
          <TooltipContent
            side={side}
            align={align}
            className={contentClassName}
            animationVariant={contentVariant}
          >
            {content}
          </TooltipContent>
        </AnimatePresence>
      </Tooltip>
    </TooltipProvider>
  );
} 