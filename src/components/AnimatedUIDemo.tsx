import React, { useState } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AnimatedTabs } from "./ui/animations/AnimatedTabs";
import { AnimatedAccordion } from "./ui/animations/AnimatedAccordion";
import { AnimatedTooltip } from "./ui/animations/AnimatedTooltip";
import { AnimatedModal } from "./ui/animations/AnimatedModal";
import { AnimatedDropdown, DropdownMenuItem, DropdownMenuSeparator } from "./ui/animations/AnimatedDropdown";
import { AnimatedToast, ToastProvider, ToastViewport } from "./ui/animations/AnimatedToast";
import * as variants from "./ui/animations/variants";

export function AnimatedUIDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const heroRef = React.useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });

  const tabs = [
    {
      value: "basic",
      label: "Basic Animations",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries({
            fadeIn: "Fade In",
            fadeInUp: "Fade In Up",
            fadeInDown: "Fade In Down",
            scaleIn: "Scale In",
            scaleInBounce: "Scale In Bounce",
            flipInX: "Flip In X",
            flipInY: "Flip In Y",
            bounceIn: "Bounce In",
            bounceInUp: "Bounce In Up",
          }).map(([variant, title]) => (
            <motion.div
              key={variant}
              initial="hidden"
              animate="visible"
              variants={variants[variant as keyof typeof variants]}
              className="col-span-1"
            >
              <Card>
                <CardHeader>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>Animation: {variant}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      ),
    },
    {
      value: "hover",
      label: "Hover Effects",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries({
            hoverScale: "Scale",
            hoverBounce: "Bounce",
            hoverRotate: "Rotate",
            hoverLift: "Lift",
            hoverGlow: "Glow",
            hoverShine: "Shine",
          }).map(([variant, title]) => (
            <motion.div
              key={variant}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 },
                hover: variants[variant as keyof typeof variants].hover,
              }}
              className="col-span-1"
            >
              <Card className="cursor-pointer">
                <CardHeader>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>Hover Effect: {variant}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      ),
    },
    {
      value: "components",
      label: "Animated Components",
      content: (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Animated Accordion</CardTitle>
              <CardDescription>Smooth expand/collapse transitions</CardDescription>
            </CardHeader>
            <CardContent>
              <AnimatedAccordion
                items={[
                  {
                    value: "item-1",
                    trigger: "First Section",
                    content: "This content smoothly animates in and out.",
                  },
                  {
                    value: "item-2",
                    trigger: "Second Section",
                    content: "Another section with smooth animations.",
                  },
                ]}
                type="single"
                collapsible
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Animated Tooltip</CardTitle>
              <CardDescription>Spring-animated tooltips</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4">
              <AnimatedTooltip
                trigger={
                  <Button variant="outline">Hover Me</Button>
                }
                content="This tooltip has spring animations!"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Animated Modal</CardTitle>
              <CardDescription>Modal with entrance and exit animations</CardDescription>
            </CardHeader>
            <CardContent>
              <AnimatedModal
                trigger={<Button>Open Modal</Button>}
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                overlayVariant="fadeIn"
                contentVariant="modalContent"
              >
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Animated Modal</h2>
                  <p>This modal has smooth entrance and exit animations.</p>
                  <div className="flex justify-end">
                    <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                      Close
                    </Button>
                  </div>
                </div>
              </AnimatedModal>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Animated Dropdown</CardTitle>
              <CardDescription>Dropdown menu with spring animations</CardDescription>
            </CardHeader>
            <CardContent>
              <AnimatedDropdown
                trigger={<Button variant="outline">Open Menu</Button>}
              >
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </AnimatedDropdown>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Animated Toast</CardTitle>
              <CardDescription>Toast notifications with spring animations</CardDescription>
            </CardHeader>
            <CardContent>
              <ToastProvider>
                <Button 
                  onClick={() => setIsToastOpen(true)}
                  variant="outline"
                >
                  Show Toast
                </Button>
                <AnimatedToast
                  open={isToastOpen}
                  onOpenChange={setIsToastOpen}
                  title="Success!"
                  description="This is an animated toast notification."
                  variant="success"
                />
                <ToastViewport />
              </ToastProvider>
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      value: "scroll",
      label: "Scroll & Hero",
      content: (
        <div className="space-y-16">
          {/* Hero Section */}
          <div ref={heroRef} className="text-center space-y-6">
            <motion.h2
              initial="hidden"
              animate={isHeroInView ? "visible" : "hidden"}
              variants={variants.heroTitle}
              className="text-4xl font-bold"
            >
              Beautiful Animations
            </motion.h2>
            <motion.p
              initial="hidden"
              animate={isHeroInView ? "visible" : "hidden"}
              variants={variants.heroSubtitle}
              className="text-xl text-muted-foreground"
            >
              Create stunning user experiences with smooth animations
            </motion.p>
            <motion.div
              initial="hidden"
              animate={isHeroInView ? "visible" : "hidden"}
              variants={variants.heroButton}
              whileHover="hover"
              whileTap="tap"
            >
              <Button size="lg">Get Started</Button>
            </motion.div>
            <motion.div
              initial="hidden"
              animate={isHeroInView ? "visible" : "hidden"}
              variants={variants.heroImage}
              className="relative h-64 bg-gradient-to-b from-primary/20 to-background rounded-lg"
            />
          </div>

          {/* Scroll Animations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Fade Up",
                description: "Elements fade in and slide up as you scroll",
                variant: variants.scrollFadeUp,
              },
              {
                title: "Fade In",
                description: "Simple fade in animation on scroll",
                variant: variants.scrollFadeIn,
              },
              {
                title: "Scale",
                description: "Elements scale up as they enter the viewport",
                variant: variants.scrollScale,
              },
            ].map((item, index) => {
              const ref = React.useRef(null);
              const isInView = useInView(ref, { once: true });

              return (
                <motion.div
                  key={index}
                  ref={ref}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  variants={item.variant}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>{item.title}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-8 space-y-8">
      <motion.h1
        initial="hidden"
        animate="visible"
        variants={variants.fadeInDown}
        className="text-4xl font-bold text-center mb-8"
      >
        Animation Showcase
      </motion.h1>

      <AnimatedTabs
        tabs={tabs}
        defaultValue="basic"
        listVariant="fadeInDown"
        contentVariant="fadeIn"
      />
    </div>
  );
} 