"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { TenantConfig } from "@/types/tenant";

interface TenantWelcomeScreenProps {
  config: TenantConfig;
  onStart: () => void;
}

export default function TenantWelcomeScreen({ config, onStart }: TenantWelcomeScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[100dvh] px-6 text-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="max-w-lg"
      >
        <div className="mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground text-2xl font-bold mb-6"
          >
            {config.logoUrl ? (
              <img src={config.logoUrl} alt={config.businessName} className="w-10 h-10 object-contain" />
            ) : (
              config.businessName.charAt(0).toUpperCase()
            )}
          </motion.div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight mb-4">
          {config.welcomeScreen.headline}
          <br />
          <span className="text-primary">{config.welcomeScreen.highlightedText}</span>
        </h1>

        <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-md mx-auto">
          {config.welcomeScreen.subtitle}
        </p>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={onStart}
            size="lg"
            className="text-lg px-8 py-6 rounded-xl shadow-lg shadow-primary/20"
          >
            {config.welcomeScreen.ctaLabel}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>

        <Card className="mt-10 border-dashed">
          <CardContent className="py-3 px-4">
            <p className="text-sm text-muted-foreground">
              {config.welcomeScreen.footerNote}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
