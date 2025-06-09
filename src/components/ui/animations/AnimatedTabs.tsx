import * as React from "react";
import { motion } from "framer-motion";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";
import * as variants from "./variants";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
    animationVariant?: keyof typeof variants;
    delay?: number;
  }
>(({ className, animationVariant = "fadeIn", delay = 0, ...props }, ref) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={variants[animationVariant]}
    transition={{ delay }}
  >
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
        className
      )}
      {...props}
    />
  </motion.div>
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> & {
    animationVariant?: keyof typeof variants;
  }
>(({ className, animationVariant = "fadeIn", ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
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
  </TabsPrimitive.Content>
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export interface AnimatedTabsProps extends React.ComponentProps<typeof Tabs> {
  tabs: {
    value: string;
    label: string;
    content: React.ReactNode;
  }[];
  defaultValue?: string;
  listVariant?: keyof typeof variants;
  contentVariant?: keyof typeof variants;
  className?: string;
  listClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

export function AnimatedTabs({
  tabs,
  defaultValue = tabs[0]?.value,
  listVariant = "fadeIn",
  contentVariant = "fadeIn",
  className,
  listClassName,
  triggerClassName,
  contentClassName,
  ...props
}: AnimatedTabsProps) {
  return (
    <Tabs defaultValue={defaultValue} className={className} {...props}>
      <TabsList className={listClassName} animationVariant={listVariant}>
        {tabs.map((tab, index) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={triggerClassName}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className={contentClassName}
          animationVariant={contentVariant}
        >
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
} 