"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Proposal } from "@/lib/proposal";

interface ProposalPageProps {
  proposal: Proposal;
  businessName: string;
  plainText: string;
  onBack: () => void;
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

function Section({
  number,
  title,
  children,
  delay = 0,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.section
      {...fadeIn}
      transition={{ delay, duration: 0.5 }}
      className="bg-white border border-border rounded-2xl p-6 sm:p-8 print:border-none print:shadow-none print:p-4"
    >
      <div className="flex items-center gap-3 mb-5">
        <span className="w-8 h-8 rounded-lg bg-accent text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
          {number}
        </span>
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
      </div>
      {children}
    </motion.section>
  );
}

export default function ProposalPage({
  proposal,
  businessName,
  plainText,
  onBack,
}: ProposalPageProps) {
  const [copied, setCopied] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const proposalRef = useRef<HTMLDivElement>(null);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(plainText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = plainText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-surface">
      {/* Header */}
      <div className="bg-white border-b border-border print:hidden">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <button
                onClick={onBack}
                className="text-sm text-muted hover:text-foreground transition-colors mb-2 flex items-center gap-1"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M10 4L6 8l4 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Go Back
              </button>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Client Proposal
              </h1>
              <p className="text-muted text-sm mt-1">
                For {businessName}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-border text-foreground font-medium text-sm hover:border-accent/30 transition-colors"
              >
                {copied ? (
                  <>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M3 8l3 3 7-7"
                        stroke="#059669"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <rect
                        x="5"
                        y="5"
                        width="8"
                        height="8"
                        rx="1.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M3 11V3a1.5 1.5 0 011.5-1.5H11"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    Copy
                  </>
                )}
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white font-medium text-sm hover:bg-accent-light transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M4 6V1h8v5M4 12H2V8h12v4h-2M4 12v3h8v-3H4z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Proposal Content */}
      <div ref={proposalRef} className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Print Header */}
        <div className="hidden print:block mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center text-lg font-bold">
              X
            </div>
            <div>
              <h1 className="text-2xl font-bold">DiscoveryCall X</h1>
              <p className="text-sm text-gray-500">Client Proposal</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold mt-4">Proposal for {businessName}</h2>
          <p className="text-gray-500 text-sm mt-1">
            Generated on{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <hr className="mt-4" />
        </div>

        {/* 1. Introduction */}
        <Section number={1} title="Introduction" delay={0.1}>
          <p className="text-muted leading-relaxed text-[15px]">
            {proposal.introduction}
          </p>
        </Section>

        {/* 2. Project Overview */}
        <Section number={2} title="Project Overview" delay={0.2}>
          <div className="space-y-4">
            <p className="text-muted leading-relaxed text-[15px]">
              {proposal.projectOverview.businessSummary}
            </p>
            {proposal.projectOverview.keyGoals.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  Key Goals
                </h4>
                <div className="flex flex-wrap gap-2">
                  {proposal.projectOverview.keyGoals.map((goal, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-lg bg-accent/5 text-accent text-sm font-medium border border-accent/10"
                    >
                      {goal}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <p className="text-muted leading-relaxed text-[15px]">
              {proposal.projectOverview.targetOutcome}
            </p>
          </div>
        </Section>

        {/* 3. Website Structure */}
        <Section number={3} title="Recommended Website Structure" delay={0.3}>
          <div className="space-y-4">
            {proposal.websiteStructure.map((page, i) => (
              <div
                key={i}
                className="flex gap-4 items-start p-4 bg-surface rounded-xl"
              >
                <span className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {i + 1}
                </span>
                <div>
                  <h4 className="font-semibold text-foreground text-[15px]">
                    {page.page}
                  </h4>
                  <p className="text-sm text-muted mt-0.5 leading-relaxed">
                    {page.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* 4. Features */}
        <Section number={4} title="Features & Functionality" delay={0.4}>
          <div className="grid gap-4 sm:grid-cols-2">
            {proposal.features.map((feature, i) => (
              <div
                key={i}
                className="p-4 bg-surface rounded-xl border border-transparent hover:border-accent/10 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                    >
                      <path
                        d="M2 5l2.5 2.5L8 3"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <h4 className="font-semibold text-foreground text-sm">
                    {feature.name}
                  </h4>
                </div>
                <p className="text-xs text-muted leading-relaxed pl-7">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* 5. Content Requirements */}
        <Section number={5} title="Content Requirements" delay={0.5}>
          <div className="space-y-3">
            {proposal.contentRequirements.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl bg-surface"
              >
                {item.status === "available" ? (
                  <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M2.5 6l2.5 2.5L9.5 4"
                        stroke="#059669"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                ) : (
                  <span className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <circle
                        cx="6"
                        cy="6"
                        r="4"
                        stroke="#d97706"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </span>
                )}
                <span
                  className={`text-sm ${item.status === "available" ? "text-foreground" : "text-muted"}`}
                >
                  {item.item}
                </span>
                <span
                  className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full ${
                    item.status === "available"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {item.status === "available" ? "Ready" : "Needed"}
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* 6. Timeline */}
        <Section number={6} title="Timeline Estimate" delay={0.6}>
          <div className="relative">
            {proposal.timeline.map((phase, i) => (
              <div key={i} className="flex gap-4 mb-6 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {phase.duration.replace("Week ", "W")}
                  </div>
                  {i < proposal.timeline.length - 1 && (
                    <div className="w-0.5 flex-1 bg-border mt-2" />
                  )}
                </div>
                <div className="pb-2">
                  <h4 className="font-semibold text-foreground text-[15px]">
                    {phase.phase}
                  </h4>
                  <p className="text-sm text-muted mt-0.5 leading-relaxed">
                    {phase.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* 7. Investment */}
        <Section number={7} title="Investment" delay={0.7}>
          <p className="text-sm text-muted mb-5">
            Select the package that best fits your needs. All packages can be
            customized.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {proposal.investment.map((tier) => (
              <div
                key={tier.tier}
                onClick={() =>
                  setSelectedTier(
                    selectedTier === tier.tier ? null : tier.tier
                  )
                }
                className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  selectedTier === tier.tier
                    ? "border-accent bg-accent/5 shadow-lg shadow-accent/10"
                    : tier.tier === "Standard"
                      ? "border-accent/20 bg-white"
                      : "border-border bg-white hover:border-accent/20"
                }`}
              >
                {tier.tier === "Standard" && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                    Recommended
                  </span>
                )}
                <h4 className="font-bold text-foreground text-base">
                  {tier.tier}
                </h4>
                <p className="text-2xl font-bold text-accent mt-1">
                  {tier.price}
                </p>
                <div className="mt-4 space-y-2">
                  {tier.includes.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-xs text-muted"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        className="flex-shrink-0 mt-0.5"
                      >
                        <path
                          d="M3 7l3 3 5-5"
                          stroke={
                            selectedTier === tier.tier
                              ? "#1e3a5f"
                              : "#9ca3af"
                          }
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* 8. Next Steps */}
        <Section number={8} title="Next Steps" delay={0.8}>
          <div className="space-y-4">
            {proposal.nextSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-4">
                <span className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {i + 1}
                </span>
                <p className="text-[15px] text-foreground/80 pt-1">{step}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Footer CTA */}
        <motion.div
          {...fadeIn}
          transition={{ delay: 0.9 }}
          className="text-center py-8 print:hidden"
        >
          <p className="text-muted text-sm mb-4">
            Ready to get started? Let&apos;s make it happen.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={copyToClipboard}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-border text-foreground font-medium text-sm hover:border-accent/30 transition-colors"
            >
              {copied ? "Copied!" : "Copy to Clipboard"}
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-medium text-sm hover:bg-accent-light transition-colors"
            >
              Export as PDF
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
