"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useFormStore } from "@/store/formStore";
import WelcomeScreen from "@/components/WelcomeScreen";
import ProgressBar from "@/components/ProgressBar";
import QuestionCard from "@/components/QuestionCard";
import ResultsPage from "@/components/ResultsPage";
import ProposalPage from "@/components/ProposalPage";
import { generateProposal, proposalToText } from "@/lib/proposal";

export default function Home() {
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

  const [showProposal, setShowProposal] = useState(false);

  const visibleQuestions = getVisibleQuestions();

  // Welcome screen
  if (currentStep === -1 && !isComplete) {
    return (
      <AnimatePresence mode="wait">
        <WelcomeScreen onStart={() => goToStep(0)} />
      </AnimatePresence>
    );
  }

  // Proposal view
  if (isComplete && currentSubmission && showProposal) {
    const proposal = generateProposal(currentSubmission.answers);
    const plainText = proposalToText(proposal, currentSubmission.businessName);
    return (
      <ProposalPage
        proposal={proposal}
        businessName={currentSubmission.businessName}
        plainText={plainText}
        onBack={() => setShowProposal(false)}
      />
    );
  }

  // Results page
  if (isComplete && currentSubmission) {
    return (
      <ResultsPage
        submission={currentSubmission}
        onReset={resetForm}
        onViewProposal={() => setShowProposal(true)}
      />
    );
  }

  // Questionnaire
  const currentQuestion = visibleQuestions[currentStep];
  if (!currentQuestion) return null;

  return (
    <div className="min-h-[100dvh] flex flex-col">
      {/* Progress */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-xl mx-auto px-6 py-4">
          <ProgressBar
            currentStep={currentStep}
            totalSteps={visibleQuestions.length}
            currentQuestion={currentQuestion}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex items-center px-6 py-12">
        <AnimatePresence mode="wait">
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            answer={answers[currentQuestion.id] ?? null}
            onAnswer={(value) => setAnswer(currentQuestion.id, value)}
            onNext={nextStep}
            onPrev={prevStep}
            isFirst={currentStep === 0}
            isLast={currentStep === visibleQuestions.length - 1}
            onSubmit={submitForm}
          />
        </AnimatePresence>
      </div>

      {/* Keyboard hint */}
      <div className="hidden sm:flex justify-center pb-6">
        <p className="text-xs text-muted/40">
          Press <kbd className="px-1.5 py-0.5 bg-surface rounded text-muted/60 font-mono text-[10px]">Enter ↵</kbd> to continue
        </p>
      </div>
    </div>
  );
}
