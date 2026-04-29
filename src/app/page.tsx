"use client";

import { useState, useCallback, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useFormStore } from "@/store/formStore";
import WelcomeScreen from "@/components/WelcomeScreen";
import ProgressBar from "@/components/ProgressBar";
import QuestionCard from "@/components/QuestionCard";
import ResultsPage from "@/components/ResultsPage";
import IntroAnimation from "@/components/IntroAnimation";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  const {
    currentStep,
    answers,
    isComplete,
    isSubmitting,
    submissionError,
    currentSubmission,
    setAnswer,
    nextStep,
    prevStep,
    goToStep,
    getVisibleQuestions,
    submitForm,
    resetForm,
  } = useFormStore();

  // Only run client-side after hydration
  useEffect(() => {
    setMounted(true);
    // Fix stale persisted state: if marked complete but no submission data,
    // or if currentStep is out of bounds, reset to welcome screen
    const stored = localStorage.getItem("discovery-call-x-storage");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const state = parsed?.state;
        if (state?.isComplete || (state?.currentStep >= 0 && !state?.answers)) {
          localStorage.removeItem("discovery-call-x-storage");
          resetForm();
        }
      } catch {
        localStorage.removeItem("discovery-call-x-storage");
        resetForm();
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
  }, []);

  const visibleQuestions = getVisibleQuestions();

  // Don't render anything until hydrated to avoid black screen flash
  if (!mounted) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background">
        <div className="w-10 h-10 rounded-2xl bg-primary/20 animate-pulse" />
      </div>
    );
  }

  return (
    <>
      {/* Premium intro animation — only rendered client-side */}
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

      {/* Results page — or reset if submission data was lost */}
      {isComplete && currentSubmission && (
        <ResultsPage
          submission={currentSubmission}
          onReset={resetForm}
        />
      )}
      {isComplete && !currentSubmission && (
        <AnimatePresence mode="wait">
          <WelcomeScreen onStart={() => { resetForm(); goToStep(0); }} />
        </AnimatePresence>
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

          {(submissionError || isSubmitting) && (
            <div className="max-w-xl mx-auto w-full px-6 pt-4">
              {isSubmitting && (
                <div className="rounded-lg border border-border/50 bg-card/60 px-4 py-2 text-sm text-muted-foreground text-center">
                  Submitting your answers…
                </div>
              )}
              {submissionError && !isSubmitting && (
                <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive text-center">
                  {submissionError}
                </div>
              )}
            </div>
          )}

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
