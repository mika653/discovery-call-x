import { TenantConfig } from "@/types/tenant";
import { questions, sections } from "./questions";

export const demoTenant: TenantConfig = {
  slug: "demo",
  businessName: "DiscoveryCall X",
  isDemo: true,
  createdAt: new Date().toISOString(),
  brandColors: {
    primary: "oklch(0.592 0.249 0.584)",
    primaryForeground: "oklch(0.98 0.01 343.198)",
    background: "oklch(0.1 0 0)",
    foreground: "oklch(0.95 0.005 106.5)",
    card: "oklch(0.15 0.003 107.1)",
    cardForeground: "oklch(0.95 0.005 106.5)",
    muted: "oklch(0.18 0.005 107.1)",
    mutedForeground: "oklch(0.65 0.02 106.9)",
    border: "oklch(1 0 0 / 12%)",
    ring: "oklch(0.592 0.249 0.584)",
  },
  welcomeScreen: {
    headline: "Let's Build Your Website",
    highlightedText: "the Right Way",
    subtitle:
      "Answer a few quick questions so we can understand your business and recommend the best approach.",
    ctaLabel: "Start Discovery",
    footerNote: "Takes about 5 minutes \u00b7 Your answers are saved automatically",
  },
  resultsScreen: {
    title: "You're all set!",
    message:
      "We've received your answers and are putting together a personalized proposal for you. Our team will be in touch shortly with next steps.",
    followUpNote: "Expect to hear from us within 24\u201348 hours",
  },
  questions,
  sections,
};

// Example alternate tenant to showcase white-labeling
export const sampleTenants: TenantConfig[] = [
  {
    slug: "blue-ocean-studio",
    businessName: "Blue Ocean Studio",
    isDemo: false,
    createdAt: new Date().toISOString(),
    brandColors: {
      primary: "oklch(0.55 0.2 250)",
      primaryForeground: "oklch(0.98 0 0)",
      background: "oklch(0.12 0.01 250)",
      foreground: "oklch(0.93 0 0)",
      card: "oklch(0.17 0.015 250)",
      cardForeground: "oklch(0.93 0 0)",
      muted: "oklch(0.2 0.01 250)",
      mutedForeground: "oklch(0.6 0.02 250)",
      border: "oklch(1 0 0 / 10%)",
      ring: "oklch(0.55 0.2 250)",
    },
    welcomeScreen: {
      headline: "Let's Create Something",
      highlightedText: "Beautiful Together",
      subtitle:
        "Tell us about your vision and we'll craft a website that brings it to life.",
      ctaLabel: "Get Started",
      footerNote: "Quick 5-minute questionnaire \u00b7 Auto-saved",
    },
    resultsScreen: {
      title: "Thank you!",
      message:
        "Your project brief is on its way to our design team. We'll review everything and reach out with a tailored proposal.",
      followUpNote: "We'll be in touch within 1\u20132 business days",
    },
    questions,
    sections,
  },
  {
    slug: "ember-creative",
    businessName: "Ember Creative",
    isDemo: false,
    createdAt: new Date().toISOString(),
    brandColors: {
      primary: "oklch(0.65 0.22 40)",
      primaryForeground: "oklch(0.98 0 0)",
      background: "oklch(0.08 0.005 40)",
      foreground: "oklch(0.92 0.01 40)",
      card: "oklch(0.14 0.01 40)",
      cardForeground: "oklch(0.92 0.01 40)",
      muted: "oklch(0.18 0.01 40)",
      mutedForeground: "oklch(0.6 0.02 40)",
      border: "oklch(1 0 0 / 10%)",
      ring: "oklch(0.65 0.22 40)",
    },
    welcomeScreen: {
      headline: "Your Brand Deserves",
      highlightedText: "a Website That Ignites",
      subtitle:
        "Share your story with us and we'll build a digital presence that sets you apart.",
      ctaLabel: "Light the Spark",
      footerNote: "5 minutes \u00b7 Your progress is saved",
    },
    resultsScreen: {
      title: "We're on it!",
      message:
        "Your responses have been captured. Our creative team is already brainstorming ideas for your project.",
      followUpNote: "Expect a proposal within 48 hours",
    },
    questions,
    sections,
  },
];
