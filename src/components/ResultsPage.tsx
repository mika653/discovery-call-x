"use client";

import { motion } from "framer-motion";
import { Submission } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Clock } from "lucide-react";

interface ResultsPageProps {
  submission: Submission;
  onReset: () => void;
}

export default function ResultsPage({ submission, onReset }: ResultsPageProps) {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/15 mb-8"
        >
          <CheckCircle2 className="h-9 w-9 text-success" />
        </motion.div>

        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
          You&apos;re all set!
        </h1>

        <p className="text-lg text-muted-foreground leading-relaxed mb-2">
          Thank you,{" "}
          <span className="font-semibold text-foreground">
            {submission.businessName}
          </span>
          .
        </p>

        <p className="text-base text-muted-foreground leading-relaxed mb-10">
          We&apos;ve received your answers and are putting together a personalized
          proposal for you. Our team will be in touch shortly with next steps.
        </p>

        <Card className="mb-10 border-dashed">
          <CardContent className="py-4">
            <div className="flex items-center gap-3 justify-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Expect to hear from us within 24-48 hours
            </div>
          </CardContent>
        </Card>

        <Button
          variant="ghost"
          onClick={onReset}
          className="text-muted-foreground hover:text-foreground"
        >
          Submit another response
        </Button>

        <p className="text-[11px] text-muted-foreground/30 mt-12">
          Powered by{" "}
          <a
            href="https://dcx.heymika.me"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-muted-foreground/50 transition-colors"
          >
            DiscoveryCall X
          </a>
          {" · "}
          <a
            href="https://heymika.me"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-muted-foreground/50 transition-colors"
          >
            Want your own branded intake form?
          </a>
        </p>
      </motion.div>
    </div>
  );
}
