"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTenantFormStore } from "@/store/tenantFormStore";
import { Submission, LeadStatus } from "@/types";
import { TenantConfig } from "@/types/tenant";
import { generateProposal, proposalToText } from "@/lib/proposal";
import { playKaching } from "@/lib/sounds";
import ProposalPage from "@/components/ProposalPage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FileText,
  Trash2,
  Loader2,
  ArrowLeft,
  Inbox,
} from "lucide-react";

const statusColors: Record<LeadStatus, string> = {
  new: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  qualified: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  proposal_sent: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  closed: "bg-gray-500/15 text-gray-400 border-gray-500/30",
};

const statusLabels: Record<LeadStatus, string> = {
  new: "New",
  qualified: "Qualified",
  proposal_sent: "Proposal Sent",
  closed: "Closed",
};

function getAnswerDisplay(
  answers: Record<string, unknown>,
  questionId: string,
  config: TenantConfig
): string {
  const val = answers[questionId];
  if (!val) return "\u2014";
  if (Array.isArray(val)) {
    if (val.length === 0) return "\u2014";
    const q = config.questions.find((q) => q.id === questionId);
    if (q?.options) {
      return val
        .map((v) => q.options!.find((o) => o.value === v)?.label || v)
        .join(", ");
    }
    return val.join(", ");
  }
  const q = config.questions.find((q) => q.id === questionId);
  if (q?.options) {
    return q.options.find((o) => o.value === val)?.label || String(val);
  }
  return String(val);
}

interface TenantAdminDashboardProps {
  config: TenantConfig;
}

export default function TenantAdminDashboard({ config }: TenantAdminDashboardProps) {
  const { submissions, updateLeadStatus, deleteSubmission, loadSubmissions, isLoadingSubmissions, init } =
    useTenantFormStore();

  useEffect(() => {
    init(config);
  }, [config, init]);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [proposalSubmission, setProposalSubmission] = useState<Submission | null>(null);
  const [filterStatus, setFilterStatus] = useState<LeadStatus | "all">("all");

  const filtered =
    filterStatus === "all"
      ? submissions
      : submissions.filter((s) => s.status === filterStatus);

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
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                {config.logoUrl ? (
                  <img src={config.logoUrl} alt="" className="w-8 h-8 rounded-lg object-contain" />
                ) : (
                  <span className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    {config.businessName.charAt(0)}
                  </span>
                )}
                {config.businessName} Dashboard
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {submissions.length} total submission
                {submissions.length !== 1 ? "s" : ""}
              </p>
            </div>
            <a href={`/form/${config.slug}`}>
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Form
              </Button>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(["all", "new", "qualified", "proposal_sent", "closed"] as const).map(
            (status) => (
              <Button
                key={status}
                variant={filterStatus === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus(status)}
              >
                {status === "all" ? "All" : statusLabels[status]}
                {" "}
                ({status === "all"
                  ? submissions.length
                  : submissions.filter((s) => s.status === status).length})
              </Button>
            )
          )}
        </div>

        {/* Submissions List */}
        {isLoadingSubmissions ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center gap-3 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading submissions...
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Inbox className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground text-lg">No submissions yet</p>
            <p className="text-muted-foreground/60 text-sm mt-1">
              Share your form link: <span className="font-mono text-primary">/form/{config.slug}</span>
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
                >
                  <Card
                    className="hover:border-primary/20 transition-colors cursor-pointer"
                    onClick={() => setSelectedSubmission(submission)}
                  >
                    <CardContent className="p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-foreground text-lg">
                            {submission.businessName}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {new Date(submission.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <select
                            value={submission.status}
                            onChange={(e) => {
                              e.stopPropagation();
                              updateLeadStatus(submission.id, e.target.value as LeadStatus);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer ${statusColors[submission.status]}`}
                          >
                            {Object.entries(statusLabels).map(([val, label]) => (
                              <option key={val} value={val}>{label}</option>
                            ))}
                          </select>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setProposalSubmission(submission);
                              playKaching();
                            }}
                            className="text-primary"
                          >
                            <FileText className="h-4 w-4 mr-1.5" />
                            Proposal
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm("Delete this submission?")) {
                                deleteSubmission(submission.id);
                              }
                            }}
                            className="text-muted-foreground/40 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {submission.summary.websiteGoals.slice(0, 3).map((goal, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{goal}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Dialog
        open={!!selectedSubmission}
        onOpenChange={(open) => !open && setSelectedSubmission(null)}
      >
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {selectedSubmission?.businessName}
            </DialogTitle>
          </DialogHeader>

          {selectedSubmission && (
            <div className="space-y-8 pt-2">
              <div>
                <h3 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">
                  Generated Summary
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-1">Overview</h4>
                    <p className="text-sm text-foreground/80">{selectedSubmission.summary.businessOverview}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Recommended Pages</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSubmission.summary.recommendedPages.map((page, i) => (
                        <Badge key={i} variant="secondary">{page}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Suggested Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSubmission.summary.suggestedFeatures.map((f, i) => (
                        <Badge key={i} variant="secondary" className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30">{f}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Button
                className="w-full"
                onClick={() => {
                  setSelectedSubmission(null);
                  setProposalSubmission(selectedSubmission);
                  playKaching();
                }}
              >
                <FileText className="h-4 w-4 mr-2" />
                Generate Proposal
              </Button>

              <Separator />

              <div>
                <h3 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">All Answers</h3>
                <div className="space-y-3">
                  {config.questions.map((q) => {
                    const display = getAnswerDisplay(
                      selectedSubmission.answers as Record<string, unknown>,
                      q.id,
                      config
                    );
                    if (display === "\u2014") return null;
                    return (
                      <div key={q.id} className="border-b border-border/50 pb-3">
                        <p className="text-xs text-muted-foreground font-medium">{q.question}</p>
                        <p className="text-sm text-foreground mt-0.5">{display}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
