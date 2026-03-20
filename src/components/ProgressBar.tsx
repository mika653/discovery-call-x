"use client";

import { motion } from "framer-motion";
import { sections } from "@/lib/questions";
import { Question } from "@/types";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  currentQuestion: Question;
}

export default function ProgressBar({
  currentStep,
  totalSteps,
  currentQuestion,
}: ProgressBarProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const currentSection = sections.find(
    (s) => s.id === currentQuestion.section
  );

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-xs font-medium text-muted">
          {currentSection?.icon} {currentSection?.label}
        </span>
        <span className="text-xs text-muted/60">
          {currentStep + 1} of {totalSteps}
        </span>
      </div>
      <div className="w-full h-1 bg-border rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-accent rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
