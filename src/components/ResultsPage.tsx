"use client";

import { motion } from "framer-motion";
import { Submission } from "@/types";

interface ResultsPageProps {
  submission: Submission;
  onReset: () => void;
  onViewProposal: () => void;
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

function SummarySection({
  title,
  icon,
  children,
  delay = 0,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      {...fadeIn}
      transition={{ delay, duration: 0.5 }}
      className="bg-white border border-border rounded-2xl p-6 sm:p-8"
    >
      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
        <span className="text-accent">{icon}</span>
        {title}
      </h3>
      {children}
    </motion.div>
  );
}

function Tag({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "success" | "warning" }) {
  const colors = {
    default: "bg-accent/5 text-accent border-accent/10",
    success: "bg-emerald-50 text-emerald-700 border-emerald-100",
    warning: "bg-amber-50 text-amber-700 border-amber-100",
  };
  return (
    <span className={`inline-block px-3 py-1.5 rounded-lg text-sm font-medium border ${colors[variant]}`}>
      {children}
    </span>
  );
}

export default function ResultsPage({ submission, onReset, onViewProposal }: ResultsPageProps) {
  const { summary } = submission;

  return (
    <div className="min-h-[100dvh] bg-surface">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white border-b border-border"
      >
        <div className="max-w-3xl mx-auto px-6 py-8 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium mb-4">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Discovery Complete
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Your Project Brief
            </h1>
            <p className="text-lg text-muted">
              Here&apos;s a summary of everything we learned about{" "}
              <span className="font-semibold text-foreground">
                {submission.businessName}
              </span>.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Business Overview */}
        <SummarySection title="Business Overview" icon="◆" delay={0.3}>
          <p className="text-muted leading-relaxed">
            {summary.businessOverview}
          </p>
        </SummarySection>

        {/* Website Goals */}
        <SummarySection title="Website Goals" icon="◎" delay={0.4}>
          <div className="flex flex-wrap gap-2">
            {summary.websiteGoals.map((goal, i) => (
              <Tag key={i}>{goal}</Tag>
            ))}
          </div>
        </SummarySection>

        {/* Recommended Pages */}
        <SummarySection title="Recommended Pages" icon="□" delay={0.5}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {summary.recommendedPages.map((page, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-4 py-3 bg-surface rounded-xl text-sm font-medium text-foreground"
              >
                <span className="w-6 h-6 rounded-md bg-accent/10 text-accent flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </span>
                {page}
              </div>
            ))}
          </div>
        </SummarySection>

        {/* Suggested Features */}
        <SummarySection title="Suggested Features" icon="⚙" delay={0.6}>
          <div className="space-y-3">
            {summary.suggestedFeatures.map((feature, i) => (
              <div
                key={i}
                className="flex items-start gap-3 text-sm text-foreground/80"
              >
                <span className="w-5 h-5 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="white">
                    <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </span>
                {feature}
              </div>
            ))}
          </div>
        </SummarySection>

        {/* Content Status */}
        <SummarySection title="Content Status" icon="★" delay={0.7}>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-success mb-3">
                Available
              </h4>
              <div className="space-y-2">
                {summary.contentStatus.available.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm text-muted"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7l3 3 5-5" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-amber-600 mb-3">
                Still Needed
              </h4>
              <div className="space-y-2">
                {summary.contentStatus.missing.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm text-muted"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="5" stroke="#d97706" strokeWidth="1.5"/>
                    </svg>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SummarySection>

        {/* Growth Opportunities */}
        <SummarySection title="Growth Opportunities" icon="↗" delay={0.8}>
          <div className="space-y-3">
            {summary.growthOpportunities.map((opp, i) => (
              <div
                key={i}
                className="flex items-start gap-3 text-sm text-foreground/80"
              >
                <span className="text-accent font-bold mt-0.5">→</span>
                {opp}
              </div>
            ))}
          </div>
        </SummarySection>

        {/* Priority Next Steps */}
        <SummarySection title="Priority Next Steps" icon="✦" delay={0.9}>
          <div className="space-y-3">
            {summary.priorityNextSteps.map((step, i) => (
              <div
                key={i}
                className="flex items-start gap-3"
              >
                <span className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-foreground/80">{step}</span>
              </div>
            ))}
          </div>
        </SummarySection>

        {/* Actions */}
        <motion.div
          {...fadeIn}
          transition={{ delay: 1.0 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 pb-12"
        >
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                window.print();
              }
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-border text-foreground font-medium text-sm hover:border-accent/30 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6V1h8v5M4 12H2V8h12v4h-2M4 12v3h8v-3H4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Print / Save PDF
          </button>
          <button
            onClick={onViewProposal}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-medium text-sm hover:bg-accent-light transition-colors shadow-lg shadow-accent/20"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2h8l4 4v8a1 1 0 01-1 1H2a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 9h6M5 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            View Client Proposal
          </button>
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-border text-foreground font-medium text-sm hover:border-accent/30 transition-colors"
          >
            Start New Discovery
          </button>
        </motion.div>
      </div>
    </div>
  );
}
