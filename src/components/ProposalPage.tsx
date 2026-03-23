"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Proposal } from "@/lib/proposal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  Copy,
  Check,
  Printer,
  CheckCircle2,
  Circle,
} from "lucide-react";

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
    <motion.div {...fadeIn} transition={{ delay, duration: 0.5 }}>
      <Card className="print:border-none print:shadow-none">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
              {number}
            </span>
            <CardTitle className="text-xl">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </motion.div>
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
  const [editedPrices, setEditedPrices] = useState<Record<string, string>>(
    () => Object.fromEntries(proposal.investment.map((t) => [t.tier, t.price]))
  );
  const [editedIncludes, setEditedIncludes] = useState<Record<string, string[]>>(
    () => Object.fromEntries(proposal.investment.map((t) => [t.tier, [...t.includes]]))
  );
  const [editedAddOns, setEditedAddOns] = useState(
    () => proposal.addOns.map((a) => ({ ...a }))
  );
  const proposalRef = useRef<HTMLDivElement>(null);

  const getTextWithEdits = () => {
    let text = "";
    text += `PROPOSAL FOR ${businessName.toUpperCase()}\n`;
    text += "=".repeat(50) + "\n\n";

    text += "1. INTRODUCTION\n" + "-".repeat(30) + "\n";
    text += proposal.introduction + "\n\n";

    text += "2. PROJECT OVERVIEW\n" + "-".repeat(30) + "\n";
    text += proposal.projectOverview.businessSummary + "\n\n";
    text += "Key Goals:\n";
    proposal.projectOverview.keyGoals.forEach((g) => (text += `  • ${g}\n`));
    text += "\n" + proposal.projectOverview.targetOutcome + "\n\n";

    text += "3. RECOMMENDED WEBSITE STRUCTURE\n" + "-".repeat(30) + "\n";
    proposal.websiteStructure.forEach((p) => {
      text += `  ${p.page}\n    ${p.description}\n\n`;
    });

    text += "4. FEATURES & FUNCTIONALITY\n" + "-".repeat(30) + "\n";
    proposal.features.forEach((f) => {
      text += `  ${f.name}\n    ${f.description}\n\n`;
    });

    text += "5. CONTENT REQUIREMENTS\n" + "-".repeat(30) + "\n";
    proposal.contentRequirements.forEach((c) => {
      text += `  ${c.status === "available" ? "✓" : "✗"} ${c.item}\n`;
    });
    text += "\n";

    text += "6. TIMELINE ESTIMATE\n" + "-".repeat(30) + "\n";
    proposal.timeline.forEach((t) => {
      text += `  ${t.duration}: ${t.phase}\n    ${t.details}\n\n`;
    });

    text += "7. INVESTMENT\n" + "-".repeat(30) + "\n";
    proposal.investment.forEach((tier) => {
      const price = editedPrices[tier.tier] || tier.price;
      const includes = editedIncludes[tier.tier] || tier.includes;
      text += `  ${tier.tier} — ${price}\n`;
      includes.forEach((inc) => (text += `    • ${inc}\n`));
      text += "\n";
    });

    text += "8. ADD-ON SERVICES\n" + "-".repeat(30) + "\n";
    editedAddOns.forEach((a) => {
      text += `  ${a.name} — ${a.price}\n    ${a.description}\n\n`;
    });

    text += "9. NEXT STEPS\n" + "-".repeat(30) + "\n";
    proposal.nextSteps.forEach((s, i) => (text += `  ${i + 1}. ${s}\n`));

    return text;
  };

  const copyToClipboard = async () => {
    const textToCopy = getTextWithEdits();
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = textToCopy;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-muted/50">
      {/* Header */}
      <div className="bg-card border-b print:hidden">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="text-muted-foreground hover:text-foreground mb-2 -ml-2"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Go Back
              </Button>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Client Proposal
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                For {businessName}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={copyToClipboard}>
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2 text-success" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
              <Button onClick={() => window.print()}>
                <Printer className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
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
          <Separator className="mt-4" />
        </div>

        {/* 1. Introduction */}
        <Section number={1} title="Introduction" delay={0.1}>
          <p className="text-muted-foreground leading-relaxed text-[15px]">
            {proposal.introduction}
          </p>
        </Section>

        {/* 2. Project Overview */}
        <Section number={2} title="Project Overview" delay={0.2}>
          <div className="space-y-4">
            <p className="text-muted-foreground leading-relaxed text-[15px]">
              {proposal.projectOverview.businessSummary}
            </p>
            {proposal.projectOverview.keyGoals.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  Key Goals
                </h4>
                <div className="flex flex-wrap gap-2">
                  {proposal.projectOverview.keyGoals.map((goal, i) => (
                    <Badge key={i} variant="secondary">
                      {goal}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <p className="text-muted-foreground leading-relaxed text-[15px]">
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
                className="flex gap-4 items-start p-4 bg-muted/50 rounded-xl"
              >
                <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {i + 1}
                </span>
                <div>
                  <h4 className="font-semibold text-foreground text-[15px]">
                    {page.page}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
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
                className="p-4 bg-muted/50 rounded-xl border border-transparent hover:border-primary/10 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  <h4 className="font-semibold text-foreground text-sm">
                    {feature.name}
                  </h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed pl-6">
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
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/50"
              >
                {item.status === "available" ? (
                  <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-warning flex-shrink-0" />
                )}
                <span
                  className={`text-sm ${item.status === "available" ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {item.item}
                </span>
                <Badge
                  variant={item.status === "available" ? "secondary" : "outline"}
                  className={`ml-auto text-xs ${
                    item.status === "available"
                      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                      : "bg-amber-500/15 text-amber-400 border-amber-500/30"
                  }`}
                >
                  {item.status === "available" ? "Ready" : "Needed"}
                </Badge>
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
                  <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">
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
                  <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
                    {phase.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* 7. Investment */}
        <Section number={7} title="Investment" delay={0.7}>
          <p className="text-sm text-muted-foreground mb-5">
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
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                    : tier.tier === "Standard"
                      ? "border-primary/20 bg-card"
                      : "border-border bg-card hover:border-primary/20"
                }`}
              >
                {tier.tier === "Standard" && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Recommended
                  </Badge>
                )}
                <h4 className="font-bold text-foreground text-base">
                  {tier.tier}
                </h4>
                <Input
                  type="text"
                  value={editedPrices[tier.tier] || tier.price}
                  onChange={(e) =>
                    setEditedPrices((prev) => ({
                      ...prev,
                      [tier.tier]: e.target.value,
                    }))
                  }
                  onClick={(e) => e.stopPropagation()}
                  className="text-2xl font-bold text-primary mt-1 bg-transparent border-0 border-b-2 border-dashed border-primary/20 focus-visible:border-primary focus-visible:ring-0 rounded-none h-auto p-0"
                />
                <div className="mt-4 space-y-2">
                  {(editedIncludes[tier.tier] || tier.includes).map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-xs text-muted-foreground group/item"
                    >
                      <Check className="h-3.5 w-3.5 flex-shrink-0 mt-1 text-primary/50" />
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          e.stopPropagation();
                          setEditedIncludes((prev) => {
                            const updated = [...(prev[tier.tier] || tier.includes)];
                            updated[i] = e.target.value;
                            return { ...prev, [tier.tier]: updated };
                          });
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-transparent border-0 border-b border-transparent focus:border-primary/30 outline-none w-full text-xs text-muted-foreground py-0 px-0 transition-colors hover:border-primary/20"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditedIncludes((prev) => {
                            const updated = [...(prev[tier.tier] || tier.includes)];
                            updated.splice(i, 1);
                            return { ...prev, [tier.tier]: updated };
                          });
                        }}
                        className="opacity-0 group-hover/item:opacity-100 text-muted-foreground/40 hover:text-destructive transition-opacity flex-shrink-0"
                        title="Remove item"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditedIncludes((prev) => {
                        const updated = [...(prev[tier.tier] || tier.includes), ""];
                        return { ...prev, [tier.tier]: updated };
                      });
                    }}
                    className="text-xs text-primary/50 hover:text-primary transition-colors mt-1 pl-5"
                  >
                    + Add item
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* 8. Add-On Services */}
        <Section number={8} title="Add-On Services" delay={0.8}>
          <p className="text-sm text-muted-foreground mb-5">
            Enhance your project with these optional services. Prices are editable.
          </p>
          <div className="space-y-4">
            {editedAddOns.map((addOn, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/50 rounded-xl group/addon"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={addOn.name}
                      onChange={(e) =>
                        setEditedAddOns((prev) => {
                          const updated = [...prev];
                          updated[i] = { ...updated[i], name: e.target.value };
                          return updated;
                        })
                      }
                      className="bg-transparent border-0 border-b border-transparent focus:border-primary/30 outline-none font-semibold text-foreground text-[15px] w-full transition-colors hover:border-primary/20"
                    />
                    <button
                      onClick={() =>
                        setEditedAddOns((prev) => prev.filter((_, idx) => idx !== i))
                      }
                      className="opacity-0 group-hover/addon:opacity-100 text-muted-foreground/40 hover:text-destructive transition-opacity flex-shrink-0 text-lg"
                      title="Remove add-on"
                    >
                      ×
                    </button>
                  </div>
                  <input
                    type="text"
                    value={addOn.description}
                    onChange={(e) =>
                      setEditedAddOns((prev) => {
                        const updated = [...prev];
                        updated[i] = { ...updated[i], description: e.target.value };
                        return updated;
                      })
                    }
                    className="bg-transparent border-0 border-b border-transparent focus:border-primary/30 outline-none text-sm text-muted-foreground w-full transition-colors hover:border-primary/20"
                  />
                </div>
                <div className="flex-shrink-0 sm:w-32 sm:text-right">
                  <input
                    type="text"
                    value={addOn.price}
                    onChange={(e) =>
                      setEditedAddOns((prev) => {
                        const updated = [...prev];
                        updated[i] = { ...updated[i], price: e.target.value };
                        return updated;
                      })
                    }
                    className="bg-transparent border-0 border-b-2 border-dashed border-primary/20 focus:border-primary outline-none font-bold text-primary text-lg w-full sm:text-right transition-colors"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={() =>
                setEditedAddOns((prev) => [
                  ...prev,
                  { name: "New Service", price: "₱0", description: "Description of the add-on service." },
                ])
              }
              className="text-sm text-primary/60 hover:text-primary transition-colors flex items-center gap-1"
            >
              + Add service
            </button>
          </div>
        </Section>

        {/* 9. Next Steps */}
        <Section number={9} title="Next Steps" delay={0.9}>
          <div className="space-y-4">
            {proposal.nextSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-4">
                <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
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
          <p className="text-muted-foreground text-sm mb-4">
            Ready to get started? Let&apos;s make it happen.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="outline" onClick={copyToClipboard}>
              {copied ? "Copied!" : "Copy to Clipboard"}
            </Button>
            <Button onClick={() => window.print()}>
              Export as PDF
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
