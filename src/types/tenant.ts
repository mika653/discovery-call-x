import { Question } from "@/types";

export interface TenantBrandColors {
  primary: string;
  primaryForeground: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  ring: string;
}

export interface TenantWelcomeScreen {
  headline: string;
  highlightedText: string;
  subtitle: string;
  ctaLabel: string;
  footerNote: string;
}

export interface TenantResultsScreen {
  title: string;
  message: string;
  followUpNote: string;
}

export interface TenantSection {
  id: string;
  label: string;
  icon: string;
}

export interface TenantConfig {
  slug: string;
  businessName: string;
  logoUrl?: string;
  brandColors: TenantBrandColors;
  welcomeScreen: TenantWelcomeScreen;
  resultsScreen: TenantResultsScreen;
  questions: Question[];
  sections: TenantSection[];
  customDomain?: string;
  createdAt: string;
  isDemo: boolean;
}
