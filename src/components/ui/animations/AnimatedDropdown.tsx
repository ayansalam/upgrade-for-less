import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";
import * as variants from "./variants";

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

interface AnimatedDropdownContentProps extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> {
  animationVariant?: keyof typeof variants;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
}

const AnimatedDropdownContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  AnimatedDropdownContentProps
>(({ 
  className, 
  children, 
  animationVariant = "dropdownContent",
  side = "bottom",
  align = "center",
  sideOffset = 4,
  ...props 
}, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      side={side}
      align={align}
      sideOffset={sideOffset}
      asChild
      {...props}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={variants[animationVariant]}
        className={cn(
          "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
          className
        )}
      >
        {children}
      </motion.div>
    </DropdownMenuPrimitive.Content>
  </DropdownMenuPrimitive.Portal>
));
AnimatedDropdownContent.displayName = "AnimatedDropdownContent";

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

export interface AnimatedDropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  animationVariant?: keyof typeof variants;
  className?: string;
}

export function AnimatedDropdown({
  trigger,
  children,
  side = "bottom",
  align = "center",
  sideOffset = 4,
  animationVariant = "dropdownContent",
  className,
}: AnimatedDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger}
      </DropdownMenuTrigger>
      <AnimatePresence>
        <AnimatedDropdownContent
          side={side}
          align={align}
          sideOffset={sideOffset}
          animationVariant={animationVariant}
          className={className}
        >
          {children}
        </AnimatedDropdownContent>
      </AnimatePresence>
    </DropdownMenu>
  );
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
}; 