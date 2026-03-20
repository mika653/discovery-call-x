"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  Palette,
  MessageSquareText,
  LayoutDashboard,
  FileText,
  Globe,
  Smartphone,
  Sparkles,
  Zap,
  Users,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { sampleTenants } from "@/lib/demo-tenant";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const features = [
  {
    icon: Palette,
    title: "White-Label Branding",
    description:
      "Your logo, your colors, your domain. Clients never see our brand — only yours.",
  },
  {
    icon: MessageSquareText,
    title: "Custom Questions",
    description:
      "Add, remove, and reorder questions. Conditional logic adapts the flow to each client.",
  },
  {
    icon: LayoutDashboard,
    title: "Admin Dashboard",
    description:
      "View all submissions, tag leads, and track your pipeline from one clean interface.",
  },
  {
    icon: FileText,
    title: "Proposal Generator",
    description:
      "Auto-generate structured proposals with editable pricing. Copy or export as PDF.",
  },
  {
    icon: Globe,
    title: "Multi-Tenant",
    description:
      "Each client gets their own branded form URL and isolated data. Scale without limits.",
  },
  {
    icon: Smartphone,
    title: "Mobile-First",
    description:
      "Buttery smooth on every device. Typeform-quality UX with zero dependencies.",
  },
];

const steps = [
  {
    number: "01",
    title: "Configure Your Brand",
    description: "Set your business name, colors, logo, and customize the welcome screen and questions.",
  },
  {
    number: "02",
    title: "Share Your Link",
    description: "Send your unique form URL to potential clients. It works on any device, instantly.",
  },
  {
    number: "03",
    title: "Receive & Act",
    description: "View submissions in your dashboard, generate proposals, and close deals faster.",
  },
];

export default function DemoPage() {
  return (
    <div className="min-h-[100dvh] bg-background">
      {/* Nav */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
              X
            </span>
            <span className="font-bold text-foreground">DiscoveryCall X</span>
            <Badge variant="secondary" className="text-xs ml-2">SaaS</Badge>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/form/demo">
              <Button variant="ghost" size="sm">Try Demo</Button>
            </Link>
            <Link href="/dashboard/demo">
              <Button size="sm">
                Dashboard
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-20 pb-16 sm:pt-28 sm:pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeUp} transition={{ duration: 0.6 }}>
            <Badge variant="secondary" className="mb-6 text-sm px-4 py-1">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Replace Discovery Calls Forever
            </Badge>
          </motion.div>

          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1] mb-6"
          >
            Turn Client Intake Into a
            <br />
            <span className="text-primary">Branded Experience</span>
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            A white-label client intake platform that qualifies leads, generates proposals,
            and saves you hours — all under your own brand.
          </motion.p>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/form/demo">
              <Button size="lg" className="text-lg px-8 py-6 rounded-xl shadow-lg shadow-primary/20">
                Try the Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/dashboard/demo">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-xl">
                View Dashboard
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Brand Previews */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} transition={{ duration: 0.6 }}>
            <p className="text-center text-sm font-medium text-muted-foreground uppercase tracking-wide mb-8">
              One Platform, Infinite Brands
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                name: "DiscoveryCall X",
                slug: "demo",
                color: "oklch(0.592 0.249 0.584)",
                headline: "Let's Build Your Website",
                highlight: "the Right Way",
              },
              ...sampleTenants.map((t) => ({
                name: t.businessName,
                slug: t.slug,
                color: t.brandColors.primary,
                headline: t.welcomeScreen.headline,
                highlight: t.welcomeScreen.highlightedText,
              })),
            ].map((brand, i) => (
              <motion.div
                key={brand.slug}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link href={`/form/${brand.slug}`}>
                  <Card className="overflow-hidden hover:border-primary/30 transition-all group cursor-pointer">
                    <div
                      className="h-40 flex items-center justify-center p-6"
                      style={{ background: `linear-gradient(135deg, ${brand.color}, oklch(0.1 0 0))` }}
                    >
                      <div className="text-center">
                        <p className="text-white/80 text-sm font-medium mb-1">{brand.headline}</p>
                        <p className="text-white text-xl font-bold">{brand.highlight}</p>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-foreground text-sm">{brand.name}</p>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Separator className="max-w-5xl mx-auto" />

      {/* Features */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Close Clients Faster
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From branded forms to auto-generated proposals — built for agencies that value their time.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Card className="h-full hover:border-primary/20 transition-colors">
                  <CardContent className="p-6">
                    <feature.icon className="h-8 w-8 text-primary mb-4" />
                    <h3 className="font-semibold text-foreground text-lg mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Separator className="max-w-5xl mx-auto" />

      {/* How It Works */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg">
              Up and running in minutes, not weeks.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="font-semibold text-foreground text-lg mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Separator className="max-w-5xl mx-auto" />

      {/* Social Proof / Stats */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            {[
              { icon: Zap, stat: "5 min", label: "Average form completion" },
              { icon: Users, stat: "100%", label: "White-label — your brand only" },
              { icon: Shield, stat: "Secure", label: "Firebase-backed data isolation" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <item.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <p className="text-3xl font-bold text-foreground mb-1">{item.stat}</p>
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-20">
        <motion.div {...fadeUp} transition={{ duration: 0.6 }}>
          <Card className="max-w-4xl mx-auto border-primary/20">
            <CardContent className="p-8 sm:p-12 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Ready to Replace Your Discovery Calls?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                Try the demo, explore the dashboard, and see how DiscoveryCall X
                can save your agency hours every week.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/form/demo">
                  <Button size="lg" className="text-lg px-8 py-6 rounded-xl shadow-lg shadow-primary/20">
                    Try the Demo Form
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/dashboard/demo">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-xl">
                    Explore Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
              X
            </span>
            <span className="text-sm text-muted-foreground">
              DiscoveryCall X &mdash; White-Label Client Intake
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/form/demo" className="hover:text-foreground transition-colors">
              Demo Form
            </Link>
            <Link href="/dashboard/demo" className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="/" className="hover:text-foreground transition-colors">
              Original
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
