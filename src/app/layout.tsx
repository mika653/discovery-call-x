import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree, Merriweather } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const merriweatherHeading = Merriweather({subsets:['latin'],variable:'--font-heading'});

const figtree = Figtree({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DiscoveryCall X — Build Your Website the Right Way",
  description:
    "An interactive, guided client intake experience for web design and development. Answer a few quick questions and get a personalized project brief.",
  openGraph: {
    title: "DiscoveryCall X",
    description: "Replace discovery calls with a smart, guided intake experience.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", figtree.variable, merriweatherHeading.variable)}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
