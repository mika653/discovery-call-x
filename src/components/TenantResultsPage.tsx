"use client";

import { motion } from "framer-motion";
import { Submission } from "@/types";
import { TenantConfig } from "@/types/tenant";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Clock } from "lucide-react";

interface TenantResultsPageProps {
  config: TenantConfig;
  submission: Submission;
  onReset: () => void;
}

export default function TenantResultsPage({
  config,
  submission,
  onReset,
}: TenantResultsPageProps) {
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
          {config.resultsScreen.title}
        </h1>

        <p className="text-lg text-muted-foreground leading-relaxed mb-2">
          Thank you,{" "}
          <span className="font-semibold text-foreground">
            {submission.businessName}
          </span>
          .
        </p>

        <p className="text-base text-muted-foreground leading-relaxed mb-10">
          {config.resultsScreen.message}
        </p>

        <Card className="mb-10 border-dashed">
          <CardContent className="py-4">
            <div className="flex items-center gap-3 justify-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {config.resultsScreen.followUpNote}
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
      </motion.div>
    </div>
  );
}
