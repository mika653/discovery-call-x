"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface IntroAnimationProps {
  brandName: string;
  brandColor: string;
  logoUrl?: string;
  onComplete: () => void;
}

export default function IntroAnimation({
  brandName,
  brandColor,
  logoUrl,
  onComplete,
}: IntroAnimationProps) {
  const [phase, setPhase] = useState<"logo" | "reveal" | "done">("logo");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("reveal"), 600);
    const t2 = setTimeout(() => setPhase("done"), 1000);
    const t3 = setTimeout(onComplete, 1200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background overflow-hidden"
        >
          {/* Radial glow */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 0.15 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute w-[600px] h-[600px] rounded-full blur-3xl"
            style={{ background: brandColor }}
          />

          {/* Horizontal line sweep */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: phase === "reveal" ? 1 : 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 right-0 h-px origin-left"
            style={{ background: `linear-gradient(90deg, transparent, ${brandColor}, transparent)` }}
          />

          {/* Logo / Initial */}
          <div className="relative flex flex-col items-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{
                scale: phase === "logo" ? 1 : 0.8,
                rotate: 0,
                y: phase === "reveal" ? -8 : 0,
              }}
              transition={{
                scale: { duration: 0.6, type: "spring", stiffness: 200, damping: 15 },
                rotate: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
                y: { duration: 0.4 },
              }}
              className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-2xl"
              style={{
                background: brandColor,
                boxShadow: `0 0 60px ${brandColor}40`,
              }}
            >
              {logoUrl ? (
                <img src={logoUrl} alt="" className="w-12 h-12 object-contain" />
              ) : (
                <span className="text-white text-3xl font-bold">
                  {brandName.charAt(0)}
                </span>
              )}
            </motion.div>

            {/* Brand name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: phase === "reveal" ? 1 : 0,
                y: phase === "reveal" ? 0 : 20,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-center"
            >
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                {brandName}
              </h1>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: phase === "reveal" ? 48 : 0 }}
                transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
                className="h-0.5 mx-auto mt-3 rounded-full"
                style={{ background: brandColor }}
              />
            </motion.div>

            {/* Floating particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  opacity: 0,
                  scale: 0,
                  x: 0,
                  y: 0,
                }}
                animate={{
                  opacity: [0, 0.6, 0],
                  scale: [0, 1, 0.5],
                  x: Math.cos((i * Math.PI * 2) / 6) * 120,
                  y: Math.sin((i * Math.PI * 2) / 6) * 120,
                }}
                transition={{
                  duration: 0.9,
                  delay: 0.15 + i * 0.04,
                  ease: "easeOut",
                }}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{ background: brandColor }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
