"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { TenantConfig } from "@/types/tenant";
import { TenantProvider } from "@/lib/tenant-context";
import { getTenantConfig, saveTenantConfig } from "@/lib/tenant-firestore";
import { useTenantFormStore } from "@/store/tenantFormStore";
import { demoTenant, sampleTenants } from "@/lib/demo-tenant";
import TenantWelcomeScreen from "@/components/TenantWelcomeScreen";
import TenantResultsPage from "@/components/TenantResultsPage";
import ProgressBar from "@/components/ProgressBar";
import QuestionCard from "@/components/QuestionCard";
import IntroAnimation from "@/components/IntroAnimation";

// Local configs — render instantly, no Firestore wait
const localConfigs: Record<string, TenantConfig> = {
  demo: demoTenant,
  ...Object.fromEntries(sampleTenants.map((t) => [t.slug, t])),
};

export default function TenantFormPage() {
  const params = useParams();
  const slug = params.slug as string;

  // Use local config immediately if available
  const localConfig = localConfigs[slug] || null;
  const [config, setConfig] = useState<TenantConfig | null>(localConfig);
  const [notFound, setNotFound] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  const {
    init,
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
  } = useTenantFormStore();

  // Initialize immediately if we have a local config
  useEffect(() => {
    if (localConfig) {
      init(localConfig);
    }
  }, [localConfig, init]);

  // For unknown slugs, fetch from Firestore
  useEffect(() => {
    if (localConfig) {
      // Sync local config to Firestore in background
      saveTenantConfig(localConfig).catch(() => {});
      return;
    }

    async function load() {
      try {
        const tenantConfig = await getTenantConfig(slug);
        if (tenantConfig) {
          setConfig(tenantConfig);
          init(tenantConfig);
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      }
    }
    load();
  }, [slug, localConfig, init]);

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
  }, []);

  if (notFound) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Not Found</h1>
          <p className="text-muted-foreground">
            No form found for &quot;{slug}&quot;. Check the URL and try again.
          </p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-muted-foreground/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const visibleQuestions = getVisibleQuestions();

  return (
    <TenantProvider config={config}>
      {/* Premium intro animation */}
      {showIntro && (
        <IntroAnimation
          brandName={config.businessName}
          brandColor={config.brandColors.primary}
          logoUrl={config.logoUrl}
          onComplete={handleIntroComplete}
        />
      )}

      {/* Welcome screen */}
      {currentStep === -1 && !isComplete && (
        <AnimatePresence mode="wait">
          <TenantWelcomeScreen config={config} onStart={() => goToStep(0)} />
        </AnimatePresence>
      )}

      {/* Results page */}
      {isComplete && currentSubmission && (
        <TenantResultsPage
          config={config}
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
    </TenantProvider>
  );
}
