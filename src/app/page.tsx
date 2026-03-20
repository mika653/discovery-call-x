"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { useFormStore } from "@/store/formStore";
import WelcomeScreen from "@/components/WelcomeScreen";
import ProgressBar from "@/components/ProgressBar";
import QuestionCard from "@/components/QuestionCard";
import ResultsPage from "@/components/ResultsPage";
import IntroAnimation from "@/components/IntroAnimation";

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);

  const {
    currentStep,
    answers,
    isComplete,
    currentSubmission,
    setAnswer,
    nextStep,
    prevStep,
    goToStep,
    getVisibleQuestions,
    submitForm,
    resetForm,
  } = useFormStore();

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
  }, []);

  const visibleQuestions = getVisibleQuestions();

  return (
    <>
      {/* Premium intro animation */}
      {showIntro && (
        <IntroAnimation
          brandName="DiscoveryCall X"
          brandColor="oklch(0.592 0.249 0.584)"
          onComplete={handleIntroComplete}
        />
      )}

      {/* Welcome screen */}
      {currentStep === -1 && !isComplete && (
        <AnimatePresence mode="wait">
          <WelcomeScreen onStart={() => goToStep(0)} />
        </AnimatePresence>
      )}

      {/* Results page */}
      {isComplete && currentSubmission && (
        <ResultsPage
          submission={currentSubmission}
          onReset={resetForm}
        />
      )}

      {/* Questionnaire */}
      {currentStep >= 0 && !isComplete && visibleQuestions[currentStep] && (
        <div className="min-h-[100dvh] flex flex-col">
          <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border/50">
            <div className="max-w-xl mx-auto px-6 py-4">
              <ProgressBar
                currentStep={currentStep}
                totalSteps={visibleQuestions.length}
                currentQuestion={visibleQuestions[currentStep]}
              />
            </div>
          </div>

          <div className="flex-1 flex items-center px-6 py-12">
            <AnimatePresence mode="wait">
              <QuestionCard
                key={visibleQuestions[currentStep].id}
                question={visibleQuestions[currentStep]}
                answer={answers[visibleQuestions[currentStep].id] ?? null}
                onAnswer={(value) => setAnswer(visibleQuestions[currentStep].id, value)}
                onNext={nextStep}
                onPrev={prevStep}
                isFirst={currentStep === 0}
                isLast={currentStep === visibleQuestions.length - 1}
                onSubmit={submitForm}
              />
            </AnimatePresence>
          </div>

          <div className="hidden sm:flex justify-center pb-6">
            <p className="text-xs text-muted-foreground/40">
              Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-muted-foreground/60 font-mono text-[10px]">Enter ↵</kbd> to continue
            </p>
          </div>
        </div>
      )}
    </>
  );
}
