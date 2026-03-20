"use client";

import { motion } from "framer-motion";
import { Submission } from "@/types";

interface ResultsPageProps {
  submission: Submission;
  onReset: () => void;
}

export default function ResultsPage({ submission, onReset }: ResultsPageProps) {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 mb-8"
        >
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path
              d="M10 18l6 6 10-10"
              stroke="#059669"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>

        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
          You&apos;re all set!
        </h1>

        <p className="text-lg text-muted leading-relaxed mb-2">
          Thank you,{" "}
          <span className="font-semibold text-foreground">
            {submission.businessName}
          </span>
          .
        </p>

        <p className="text-base text-muted leading-relaxed mb-10">
          We&apos;ve received your answers and are putting together a personalized
          proposal for you. Our team will be in touch shortly with next steps.
        </p>

        <div className="bg-surface border border-border rounded-xl p-5 mb-10">
          <div className="flex items-center gap-3 justify-center text-sm text-muted">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M9 5.5V9l2.5 2.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Expect to hear from us within 24–48 hours
          </div>
        </div>

        <button
          onClick={onReset}
          className="text-sm text-muted hover:text-foreground transition-colors font-medium"
        >
          Submit another response
        </button>
      </motion.div>
    </div>
  );
}
