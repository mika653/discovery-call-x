"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFormStore } from "@/store/formStore";
import { Submission, LeadStatus } from "@/types";
import { questions } from "@/lib/questions";
import { generateProposal, proposalToText } from "@/lib/proposal";
import { playKaching } from "@/lib/sounds";
import ProposalPage from "@/components/ProposalPage";

const statusColors: Record<LeadStatus, string> = {
  new: "bg-blue-50 text-blue-700 border-blue-200",
  qualified: "bg-emerald-50 text-emerald-700 border-emerald-200",
  proposal_sent: "bg-amber-50 text-amber-700 border-amber-200",
  closed: "bg-gray-50 text-gray-500 border-gray-200",
};

const statusLabels: Record<LeadStatus, string> = {
  new: "New",
  qualified: "Qualified",
  proposal_sent: "Proposal Sent",
  closed: "Closed",
};

function getAnswerDisplay(answers: Record<string, unknown>, questionId: string): string {
  const val = answers[questionId];
  if (!val) return "—";
  if (Array.isArray(val)) {
    if (val.length === 0) return "—";
    const q = questions.find((q) => q.id === questionId);
    if (q?.options) {
      return val
        .map((v) => q.options!.find((o) => o.value === v)?.label || v)
        .join(", ");
    }
    return val.join(", ");
  }
  const q = questions.find((q) => q.id === questionId);
  if (q?.options) {
    return q.options.find((o) => o.value === val)?.label || String(val);
  }
  return String(val);
}

export default function AdminDashboard() {
  const { submissions, updateLeadStatus, deleteSubmission, loadSubmissions, isLoadingSubmissions } = useFormStore();

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const [proposalSubmission, setProposalSubmission] =
    useState<Submission | null>(null);
  const [filterStatus, setFilterStatus] = useState<LeadStatus | "all">("all");

  const filtered =
    filterStatus === "all"
      ? submissions
      : submissions.filter((s) => s.status === filterStatus);

  // Proposal view for a submission
  if (proposalSubmission) {
    const proposal = generateProposal(proposalSubmission.answers);
    const plainText = proposalToText(proposal, proposalSubmission.businessName);
    return (
      <ProposalPage
        proposal={proposal}
        businessName={proposalSubmission.businessName}
        plainText={plainText}
        onBack={() => setProposalSubmission(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-accent text-white flex items-center justify-center text-sm font-bold">
                  X
                </span>
                Admin Dashboard
              </h1>
              <p className="text-sm text-muted mt-1">
                {submissions.length} total submission
                {submissions.length !== 1 ? "s" : ""}
              </p>
            </div>
            <a
              href="/"
              className="text-sm text-accent hover:text-accent-light font-medium transition-colors"
            >
              &larr; Back to Form
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(["all", "new", "qualified", "proposal_sent", "closed"] as const).map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  filterStatus === status
                    ? "bg-accent text-white border-accent"
                    : "bg-white text-muted border-border hover:border-accent/30"
                }`}
              >
                {status === "all" ? "All" : statusLabels[status]}
                {status === "all" && ` (${submissions.length})`}
                {status !== "all" &&
                  ` (${submissions.filter((s) => s.status === status).length})`}
              </button>
            )
          )}
        </div>

        {/* Submissions List */}
        {isLoadingSubmissions ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center gap-3 text-muted">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Loading submissions...
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4 opacity-30">□</div>
            <p className="text-muted text-lg">No submissions yet</p>
            <p className="text-muted/60 text-sm mt-1">
              Submissions will appear here once clients complete the discovery
              form.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered
              .slice()
              .reverse()
              .map((submission) => (
                <motion.div
                  key={submission.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-border rounded-xl p-5 hover:border-accent/20 transition-colors cursor-pointer"
                  onClick={() => setSelectedSubmission(submission)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">
                        {submission.businessName}
                      </h3>
                      <p className="text-sm text-muted mt-0.5">
                        {new Date(submission.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <select
                        value={submission.status}
                        onChange={(e) => {
                          e.stopPropagation();
                          updateLeadStatus(
                            submission.id,
                            e.target.value as LeadStatus
                          );
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer ${
                          statusColors[submission.status]
                        }`}
                      >
                        {Object.entries(statusLabels).map(([val, label]) => (
                          <option key={val} value={val}>
                            {label}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setProposalSubmission(submission);
                          playKaching();
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/5 text-accent text-xs font-medium hover:bg-accent/10 transition-colors"
                      >
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                          <path d="M2 2h8l4 4v8a1 1 0 01-1 1H2a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M5 9h6M5 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        Proposal
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (
                            confirm(
                              "Are you sure you want to delete this submission?"
                            )
                          ) {
                            deleteSubmission(submission.id);
                          }
                        }}
                        className="text-muted/40 hover:text-error transition-colors p-1"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M3 4h10M6 4V3a1 1 0 011-1h2a1 1 0 011 1v1M5 4v9a1 1 0 001 1h4a1 1 0 001-1V4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {submission.summary.websiteGoals.slice(0, 3).map((goal, i) => (
                      <span
                        key={i}
                        className="text-xs bg-surface text-muted px-2 py-1 rounded-md"
                      >
                        {goal}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedSubmission && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center p-4 pt-[5vh] overflow-y-auto"
            onClick={() => setSelectedSubmission(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-border px-6 py-4 rounded-t-2xl flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">
                  {selectedSubmission.businessName}
                </h2>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="text-muted hover:text-foreground transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M6 6l8 8M14 6l-8 8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              <div className="px-6 py-6 space-y-8">
                {/* Summary */}
                <div>
                  <h3 className="text-sm font-semibold text-accent uppercase tracking-wide mb-3">
                    Generated Summary
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-semibold text-muted uppercase mb-1">
                        Overview
                      </h4>
                      <p className="text-sm text-foreground/80">
                        {selectedSubmission.summary.businessOverview}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-muted uppercase mb-2">
                        Recommended Pages
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedSubmission.summary.recommendedPages.map(
                          (page, i) => (
                            <span
                              key={i}
                              className="text-xs bg-accent/5 text-accent px-2 py-1 rounded-md font-medium"
                            >
                              {page}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-muted uppercase mb-2">
                        Suggested Features
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedSubmission.summary.suggestedFeatures.map(
                          (f, i) => (
                            <span
                              key={i}
                              className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md font-medium"
                            >
                              {f}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Generate Proposal Button */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedSubmission(null);
                      setProposalSubmission(selectedSubmission);
                      playKaching();
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-accent text-white font-medium text-sm hover:bg-accent-light transition-colors shadow-lg shadow-accent/20"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 2h8l4 4v8a1 1 0 01-1 1H2a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M5 9h6M5 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    Generate Proposal
                  </button>
                </div>

                {/* All Answers */}
                <div>
                  <h3 className="text-sm font-semibold text-accent uppercase tracking-wide mb-3">
                    All Answers
                  </h3>
                  <div className="space-y-3">
                    {questions.map((q) => {
                      const display = getAnswerDisplay(
                        selectedSubmission.answers as Record<string, unknown>,
                        q.id
                      );
                      if (display === "—") return null;
                      return (
                        <div key={q.id} className="border-b border-border/50 pb-3">
                          <p className="text-xs text-muted font-medium">
                            {q.question}
                          </p>
                          <p className="text-sm text-foreground mt-0.5">
                            {display}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
