"use client";

import { motion } from "framer-motion";

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[100dvh] px-6 text-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="max-w-lg"
      >
        <div className="mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent text-white text-2xl font-bold mb-6"
          >
            X
          </motion.div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight mb-4">
          Let&apos;s Build Your Website
          <br />
          <span className="text-accent">the Right Way</span>
        </h1>

        <p className="text-lg text-muted leading-relaxed mb-10 max-w-md mx-auto">
          Answer a few quick questions so we can understand your business and
          recommend the best approach.
        </p>

        <motion.button
          onClick={onStart}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent-light text-white font-medium text-lg px-8 py-4 rounded-xl transition-colors duration-200 shadow-lg shadow-accent/20"
        >
          Start Discovery
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 4L13 10L7 16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>

        <p className="text-sm text-muted/60 mt-8">
          Takes about 5 minutes &middot; Your answers are saved automatically
        </p>
      </motion.div>
    </motion.div>
  );
}
