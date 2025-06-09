import * as React from "react";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";
import { useLocation, useNavigation } from "react-router-dom";
import { cn } from "@/lib/utils";
import * as variants from "./variants";
import { LoadingSpinner } from "./LoadingSpinner";
import { AnimatedToast, ToastProvider, ToastViewport } from "./AnimatedToast";

export interface PageTransitionWrapperProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  variant?: keyof Pick<typeof variants, "pageTransitionFade" | "pageTransitionSlide" | "pageTransitionZoom">;
  withOverlay?: boolean;
  overlayStyle?: "blur" | "glow" | "gradient";
  showLoadingIndicator?: "spinner" | "toast" | false;
  loadingMessage?: string;
}

export function PageTransitionWrapper({
  children,
  variant = "pageTransitionFade",
  withOverlay = false,
  overlayStyle = "blur",
  showLoadingIndicator = "spinner",
  loadingMessage = "Loading...",
  className,
  ...props
}: PageTransitionWrapperProps) {
  const location = useLocation();
  const navigation = useNavigation();
  const [isToastOpen, setIsToastOpen] = React.useState(false);

  const isLoading = navigation.state === "loading";

  React.useEffect(() => {
    if (showLoadingIndicator === "toast") {
      setIsToastOpen(isLoading);
    }
  }, [isLoading, showLoadingIndicator]);

  const overlayVariants = {
    blur: "backdrop-blur-sm bg-background/50",
    glow: "bg-gradient-to-r from-primary/20 via-background to-primary/20 animate-glow",
    gradient: "bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 animate-gradient",
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {withOverlay && isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "fixed inset-0 z-50",
              overlayVariants[overlayStyle]
            )}
          >
            {showLoadingIndicator === "spinner" && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <LoadingSpinner size="lg" variant="primary" />
              </div>
            )}
          </motion.div>
        )}

        <motion.div
          key={location.pathname}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants[variant]}
          className={className}
          {...props}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {showLoadingIndicator === "toast" && (
        <ToastProvider>
          <AnimatedToast
            open={isToastOpen}
            onOpenChange={setIsToastOpen}
            title="Loading"
            description={loadingMessage}
            variant="default"
          />
          <ToastViewport />
        </ToastProvider>
      )}
    </>
  );
} 