import * as React from "react";
import { motion } from "framer-motion";
import { AnimatedButton } from "@/components/ui/animated/AnimatedButton";
import { AnimatedCard } from "@/components/ui/animated/AnimatedCard";
import { PageTransitionWrapper } from "@/components/ui/animations/PageTransitionWrapper";
import { springs, durations } from "@/components/ui/animated/motion.config";
import * as variants from "@/components/ui/animated/variants";
import { AnimatedModal } from "@/components/ui/animated/AnimatedModal";
import { AnimatedToast } from "@/components/ui/animated/AnimatedToast";
import { createOrder, verifyPayment } from "@/services/razorpay";
import { useState } from "react";

export default function AnimationDemo() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handlePayment = async () => {
    try {
      const order = await createOrder({
        amount: 5000, // Amount in paise
        currency: "INR",
        receipt: "receipt#1",
      });

      // Open Razorpay modal here
      setModalOpen(true);

      // Simulate payment success
      const paymentSuccess = true;

      if (paymentSuccess) {
        setToastMessage("Payment successful!");
      } else {
        setToastMessage("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setToastMessage("An error occurred during payment.");
    }
  };

  return (
    <PageTransitionWrapper
      variant="pageTransitionFade"
      withOverlay
      overlayStyle="blur"
      showLoadingIndicator="spinner"
    >
      <div className="container mx-auto py-12">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <motion.h1
            className="mb-4 text-4xl font-bold"
            variants={variants.heroTitle}
            initial="hidden"
            animate="visible"
          >
            Animation System Demo
          </motion.h1>
          <motion.p
            className="mb-8 text-lg text-muted-foreground"
            variants={variants.heroSubtitle}
            initial="hidden"
            animate="visible"
          >
            A showcase of beautiful animations and transitions
          </motion.p>
          <motion.div
            variants={variants.heroButton}
            initial="hidden"
            animate="visible"
          >
            <AnimatedButton
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              animation="bounce"
            >
              Get Started
            </AnimatedButton>
          </motion.div>
        </section>

        {/* Button Animations */}
        <section className="mb-16">
          <h2 className="mb-8 text-2xl font-semibold">Button Animations</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <AnimatedButton animation="scale">Scale</AnimatedButton>
            <AnimatedButton animation="bounce">Bounce</AnimatedButton>
            <AnimatedButton animation="rotate">Rotate</AnimatedButton>
            <AnimatedButton animation="lift">Lift</AnimatedButton>
            <AnimatedButton animation="glow">Glow</AnimatedButton>
            <AnimatedButton animation="shine">Shine</AnimatedButton>
            <AnimatedButton isLoading>Loading</AnimatedButton>
            <AnimatedButton variant="secondary" animation="scale">
              Secondary
            </AnimatedButton>
            <AnimatedButton variant="outline" animation="lift">
              Outline
            </AnimatedButton>
          </div>
        </section>

        {/* Card Animations */}
        <section className="mb-16">
          <h2 className="mb-8 text-2xl font-semibold">Card Animations</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatedCard animation="scale" isClickable>
              <div className="p-6">
                <h3 className="mb-2 text-lg font-medium">Scale Card</h3>
                <p className="text-sm text-muted-foreground">
                  This card scales up on hover and has a click effect
                </p>
              </div>
            </AnimatedCard>
            <AnimatedCard animation="lift">
              <div className="p-6">
                <h3 className="mb-2 text-lg font-medium">Lift Card</h3>
                <p className="text-sm text-muted-foreground">
                  This card lifts up on hover with a shadow
                </p>
              </div>
            </AnimatedCard>
            <AnimatedCard animation="glow">
              <div className="p-6">
                <h3 className="mb-2 text-lg font-medium">Glow Card</h3>
                <p className="text-sm text-muted-foreground">
                  This card has a subtle glow effect on hover
                </p>
              </div>
            </AnimatedCard>
            <AnimatedCard animation="shine" isClickable>
              <div className="p-6">
                <h3 className="mb-2 text-lg font-medium">Shine Card</h3>
                <p className="text-sm text-muted-foreground">
                  This card has a shine effect on hover
                </p>
              </div>
            </AnimatedCard>
            <AnimatedCard animation="fade">
              <div className="p-6">
                <h3 className="mb-2 text-lg font-medium">Fade Card</h3>
                <p className="text-sm text-muted-foreground">
                  This card fades in when mounted
                </p>
              </div>
            </AnimatedCard>
            <AnimatedCard animation="slide">
              <div className="p-6">
                <h3 className="mb-2 text-lg font-medium">Slide Card</h3>
                <p className="text-sm text-muted-foreground">
                  This card slides up when mounted
                </p>
              </div>
            </AnimatedCard>
          </div>
        </section>

        {/* Advanced Effects */}
        <section className="mb-16">
          <h2 className="mb-8 text-2xl font-semibold">Advanced Effects</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            <motion.div
              className="flex h-24 items-center justify-center rounded-lg border"
              variants={variants.shake}
              whileHover="animate"
            >
              Shake
            </motion.div>
            <motion.div
              className="flex h-24 items-center justify-center rounded-lg border"
              variants={variants.vibrate}
              animate="animate"
            >
              Vibrate
            </motion.div>
            <motion.div
              className="flex h-24 items-center justify-center rounded-lg border"
              variants={variants.pulse}
              animate="animate"
            >
              Pulse
            </motion.div>
            <motion.div
              className="flex h-24 items-center justify-center rounded-lg border"
              variants={variants.attention}
              whileHover="animate"
            >
              Attention
            </motion.div>
          </div>
        </section>

        {/* Scroll Animations */}
        <section>
          <h2 className="mb-8 text-2xl font-semibold">Scroll Animations</h2>
          <div className="space-y-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <AnimatedCard
                key={i}
                animation="slide"
                className="p-6"
                isHoverable={false}
              >
                <h3 className="mb-2 text-lg font-medium">
                  Scroll Animation {i + 1}
                </h3>
                <p className="text-muted-foreground">
                  This content animates when it enters the viewport. Try scrolling
                  down to see the effect.
                </p>
              </AnimatedCard>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="mb-8 text-2xl font-semibold">Razorpay Payment</h2>
          <button onClick={handlePayment} className="btn btn-primary">
            Buy Pro Plan
          </button>
        </section>
      </div>

      <AnimatedModal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-xl font-semibold">Razorpay Payment</h2>
        <p>Complete your payment to access the Pro plan.</p>
      </AnimatedModal>

      {toastMessage && <AnimatedToast message={toastMessage} onClose={() => setToastMessage("")} />}
    </PageTransitionWrapper>
  );
} 