"use client";

import { createContext, useContext, ReactNode } from "react";
import { TenantConfig } from "@/types/tenant";

const TenantContext = createContext<TenantConfig | null>(null);

export function TenantProvider({
  config,
  children,
}: {
  config: TenantConfig;
  children: ReactNode;
}) {
  const colorOverrides = {
    "--primary": config.brandColors.primary,
    "--primary-foreground": config.brandColors.primaryForeground,
    "--background": config.brandColors.background,
    "--foreground": config.brandColors.foreground,
    "--card": config.brandColors.card,
    "--card-foreground": config.brandColors.cardForeground,
    "--muted": config.brandColors.muted,
    "--muted-foreground": config.brandColors.mutedForeground,
    "--border": config.brandColors.border,
    "--ring": config.brandColors.ring,
    "--popover": config.brandColors.card,
    "--popover-foreground": config.brandColors.cardForeground,
    "--accent": config.brandColors.muted,
    "--accent-foreground": config.brandColors.foreground,
    "--secondary": config.brandColors.muted,
    "--secondary-foreground": config.brandColors.foreground,
    "--input": config.brandColors.border,
  } as React.CSSProperties;

  return (
    <TenantContext.Provider value={config}>
      <div style={colorOverrides} className="min-h-[100dvh] bg-background text-foreground">
        {children}
      </div>
    </TenantContext.Provider>
  );
}

export function useTenant(): TenantConfig | null {
  return useContext(TenantContext);
}
