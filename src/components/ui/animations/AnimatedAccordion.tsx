import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import * as variants from "./variants";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <motion.div
        initial={{ rotate: 0 }}
        animate={props["data-state"] === "open" ? { rotate: 180 } : { rotate: 0 }}
        transition={{ duration: 0.2 }}
      >
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
      </motion.div>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> & {
    animationVariant?: keyof typeof variants;
  }
>(({ className, children, animationVariant = "accordionContent", ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all"
    {...props}
  >
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={variants[animationVariant]}
      className={cn("pb-4 pt-0", className)}
    >
      {children}
    </motion.div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export interface AnimatedAccordionProps {
  items: {
    value: string;
    trigger: React.ReactNode;
    content: React.ReactNode;
  }[];
  type?: "single" | "multiple";
  collapsible?: boolean;
  contentVariant?: keyof typeof variants;
  className?: string;
  itemClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

export function AnimatedAccordion({
  items,
  type = "single",
  collapsible = true,
  contentVariant = "accordionContent",
  className,
  itemClassName,
  triggerClassName,
  contentClassName,
  ...props
}: AnimatedAccordionProps) {
  return (
    <Accordion
      type={type}
      collapsible={collapsible}
      className={cn("w-full", className)}
      {...props}
    >
      {items.map((item) => (
        <AccordionItem key={item.value} value={item.value} className={itemClassName}>
          <AccordionTrigger className={triggerClassName}>
            {item.trigger}
          </AccordionTrigger>
          <AccordionContent
            className={contentClassName}
            animationVariant={contentVariant}
          >
            {item.content}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
} 