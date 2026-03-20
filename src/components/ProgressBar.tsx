"use client";

import { motion } from "framer-motion";
import { sections } from "@/lib/questions";
import { Question } from "@/types";
import { Progress } from "@/components/ui/progress";

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
        <span className="text-xs font-medium text-muted-foreground">
          {currentSection?.icon} {currentSection?.label}
        </span>
        <span className="text-xs text-muted-foreground/60">
          {currentStep + 1} of {totalSteps}
        </span>
      </div>
      <Progress value={progress} className="h-1" />
    </div>
  );
}
