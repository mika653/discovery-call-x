import { FormAnswers } from "@/types";
import { questions } from "./questions";

function getAnswer(answers: FormAnswers, id: string): string {
  const val = answers[id];
  if (!val) return "";
  if (Array.isArray(val)) {
    if (val.length > 0 && val[0] instanceof File) return "";
    return (val as string[]).join(", ");
  }
  return val as string;
}

function getMulti(answers: FormAnswers, id: string): string[] {
  const val = answers[id];
  if (!val || !Array.isArray(val)) return [];
  return val as string[];
}

function getLabelForValue(questionId: string, value: string): string {
  const q = questions.find((q) => q.id === questionId);
  const opt = q?.options?.find((o) => o.value === value);
  return opt?.label || value;
}

export interface Proposal {
  introduction: string;
  projectOverview: {
    businessSummary: string;
    keyGoals: string[];
    targetOutcome: string;
  };
  websiteStructure: { page: string; description: string }[];
  features: { name: string; description: string }[];
  contentRequirements: { item: string; status: "available" | "missing" }[];
  timeline: { phase: string; duration: string; details: string }[];
  investment: { tier: string; price: string; includes: string[] }[];
  addOns: { name: string; price: string; description: string }[];
  nextSteps: string[];
}

export function generateProposal(answers: FormAnswers): Proposal {
  const businessName = getAnswer(answers, "business_name") || "Your Business";
  const description = getAnswer(answers, "business_description");
  const goals = getMulti(answers, "primary_goals").map((g) =>
    getLabelForValue("primary_goals", g)
  );
  const visitorAction = getAnswer(answers, "visitor_action");
  const visitorActionLabel = visitorAction
    ? getLabelForValue("visitor_action", visitorAction)
    : "";

  // 1. Introduction
  const introduction = `Thank you for taking the time to share your vision for ${businessName}. We've reviewed your inputs and mapped out a website strategy tailored specifically for your business. This proposal outlines our recommended approach to help you ${goals.length > 0 ? goals[0].toLowerCase() : "achieve your goals"} and create a powerful online presence.`;

  // 2. Project Overview
  const projectOverview = {
    businessSummary: `${businessName}${description ? ` — ${description}` : ""} — is looking to establish${getAnswer(answers, "location") ? ` a strong digital presence from ${getAnswer(answers, "location")}` : " a strong digital presence online"}.`,
    keyGoals: goals,
    targetOutcome: visitorActionLabel
      ? `The primary objective is to drive visitors to ${visitorActionLabel.toLowerCase()}, supported by a design and structure optimized for conversions.`
      : "Create a professional website that clearly communicates the brand and drives meaningful visitor engagement.",
  };

  // 3. Website Structure
  const websiteStructure: { page: string; description: string }[] = [
    {
      page: "Home",
      description:
        "A compelling landing page that immediately communicates who you are, what you offer, and how visitors can take action.",
    },
    {
      page: "About",
      description:
        "Tell your story — build trust and connection with potential customers through your background, mission, and values.",
    },
  ];

  const goalValues = getMulti(answers, "primary_goals");
  const servicesList = getAnswer(answers, "services_list");

  if (goalValues.includes("showcase") || servicesList) {
    websiteStructure.push({
      page: "Services / Menu",
      description:
        "A clear, organized presentation of your offerings with descriptions, pricing (if applicable), and calls to action.",
    });
  }

  if (goalValues.includes("ecommerce")) {
    websiteStructure.push({
      page: "Shop",
      description:
        "A fully functional online store with product listings, cart functionality, and secure checkout.",
    });
  }

  if (
    goalValues.includes("bookings") ||
    getAnswer(answers, "needs_reservations") === "yes"
  ) {
    websiteStructure.push({
      page: "Book Now",
      description:
        "An integrated booking system allowing customers to schedule appointments or reserve services directly.",
    });
  }

  if (getAnswer(answers, "needs_events") !== "no") {
    websiteStructure.push({
      page: "Events",
      description:
        "A dynamic events calendar showcasing upcoming happenings, with details and registration options.",
    });
  }

  if (goalValues.includes("content")) {
    websiteStructure.push({
      page: "Blog",
      description:
        "A content hub for sharing news, insights, and updates — great for SEO and building authority.",
    });
  }

  if (getAnswer(answers, "needs_contact_form") !== "no") {
    websiteStructure.push({
      page: "Contact",
      description:
        "A clean contact page with a form, location map, business hours, and all your contact information.",
    });
  }

  // 4. Features
  const features: { name: string; description: string }[] = [];

  if (getAnswer(answers, "needs_reservations") !== "no") {
    const details = getAnswer(answers, "reservation_details");
    features.push({
      name: "Online Booking System",
      description: `Integrated reservation/booking functionality${details ? ` for ${details}` : ""} with automated confirmations and calendar sync.`,
    });
  }

  const orderingType = getAnswer(answers, "needs_ordering");
  if (orderingType && orderingType !== "no") {
    const details = getAnswer(answers, "ordering_details");
    const isServices = orderingType === "services";
    const isBoth = orderingType === "both";
    features.push({
      name: isServices
        ? "Service Request / Quote System"
        : isBoth
          ? "E-Commerce & Service Request System"
          : "Online Ordering / E-Commerce",
      description: isServices
        ? `A structured inquiry and quote request system${details ? ` for ${details}` : ""} so potential clients can easily describe their project needs.`
        : `Secure online ${isBoth ? "store and service request system" : "ordering system"}${details ? ` for ${details}` : ""} with payment processing and order management.`,
    });
  }

  if (getAnswer(answers, "needs_events") !== "no") {
    features.push({
      name: "Events Calendar",
      description:
        "Interactive events calendar with filtering, event details, and optional RSVP/ticketing integration.",
    });
  }

  if (getAnswer(answers, "needs_contact_form") !== "no") {
    features.push({
      name: "Contact Form",
      description:
        "Custom contact form with email notifications, spam protection, and optional CRM integration.",
    });
  }

  const socialMedia = getAnswer(answers, "social_media");
  if (socialMedia) {
    features.push({
      name: "Social Media Integration",
      description:
        "Social media feeds, share buttons, and profile links to strengthen your online ecosystem.",
    });
  }

  if (getAnswer(answers, "wants_seo") !== "no") {
    features.push({
      name: "SEO Optimization",
      description:
        "On-page SEO setup including meta tags, structured data, sitemap, and Google Search Console integration.",
    });
  }

  if (getAnswer(answers, "wants_email_collection") !== "no") {
    features.push({
      name: "Email Collection & Newsletter",
      description:
        "Newsletter signup forms, pop-ups, and integration with your preferred email marketing platform.",
    });
  }

  if (getAnswer(answers, "plans_ads") !== "no") {
    features.push({
      name: "Ad & Conversion Tracking",
      description:
        "Pixel installation, conversion tracking, and optimized landing pages for your advertising campaigns.",
    });
  }

  // Always include these
  features.push({
    name: "Mobile-Responsive Design",
    description:
      "Fully responsive layout that looks and works beautifully on all devices — phones, tablets, and desktops.",
  });

  features.push({
    name: "Analytics Dashboard",
    description:
      "Google Analytics integration to track visitors, behavior, and conversion metrics from day one.",
  });

  // 5. Content Requirements
  const contentRequirements: {
    item: string;
    status: "available" | "missing";
  }[] = [];

  const hasPhotos = getAnswer(answers, "has_photos");
  if (hasPhotos === "professional" || hasPhotos === "phone") {
    contentRequirements.push({
      item: "Photos & Visual Assets",
      status: "available",
    });
  } else {
    contentRequirements.push({
      item: "Professional Photography",
      status: "missing",
    });
  }

  const hasLogo = answers["logo_upload"];
  if (hasLogo && Array.isArray(hasLogo) && hasLogo.length > 0) {
    contentRequirements.push({ item: "Logo", status: "available" });
  } else {
    contentRequirements.push({
      item: "Logo Design / Brand Mark",
      status: "missing",
    });
  }

  if (servicesList) {
    contentRequirements.push({
      item: "Services / Product Listings",
      status: "available",
    });
  } else {
    contentRequirements.push({
      item: "Services / Product Copy",
      status: "missing",
    });
  }

  contentRequirements.push({
    item: "Website Copywriting (Headlines, About, etc.)",
    status: "missing",
  });

  const vibes = getMulti(answers, "brand_vibe");
  if (vibes.length > 0) {
    contentRequirements.push({
      item: "Brand Direction / Style Preferences",
      status: "available",
    });
  } else {
    contentRequirements.push({
      item: "Brand Style Guide",
      status: "missing",
    });
  }

  // 6. Timeline
  const hasEcommerce =
    goalValues.includes("ecommerce") ||
    ["products", "both"].includes(getAnswer(answers, "needs_ordering"));
  const featureCount = features.length;

  const timeline = [
    {
      phase: "Discovery & Strategy",
      duration: "Week 1",
      details:
        "Finalize project scope, content requirements, and design direction based on your responses.",
    },
    {
      phase: "Design & Wireframing",
      duration: hasEcommerce ? "Week 2–3" : "Week 2",
      details:
        "Create wireframes and high-fidelity mockups for all pages. Includes up to 2 rounds of revisions.",
    },
    {
      phase: "Development & Integration",
      duration: hasEcommerce ? "Week 4–6" : featureCount > 5 ? "Week 3–4" : "Week 3",
      details: `Build out all pages and integrate features: ${features
        .slice(0, 3)
        .map((f) => f.name)
        .join(", ")}${features.length > 3 ? ", and more" : ""}.`,
    },
    {
      phase: "Content & Testing",
      duration: hasEcommerce ? "Week 7" : featureCount > 5 ? "Week 5" : "Week 4",
      details:
        "Populate with final content, cross-browser testing, mobile optimization, and performance tuning.",
    },
    {
      phase: "Revisions & Launch",
      duration: hasEcommerce ? "Week 8" : featureCount > 5 ? "Week 6" : "Week 5",
      details:
        "Final review, client revisions, domain setup, and go-live. Includes post-launch monitoring.",
    },
  ];

  // 7. Investment
  const basePages = websiteStructure.length;
  const investment = [
    {
      tier: "Starter",
      price: basePages <= 4 ? "₱25,000" : "₱30,000",
      includes: [
        `Up to ${Math.min(basePages, 5)} pages`,
        "Mobile-responsive design",
        "Contact form",
        "Basic SEO setup",
        "1 round of revisions",
      ],
    },
    {
      tier: "Standard",
      price: hasEcommerce ? "₱65,000" : featureCount > 5 ? "₱55,000" : "₱45,000",
      includes: [
        `Up to ${basePages + 2} pages`,
        "Custom design with animations",
        "All recommended features",
        "SEO optimization",
        "Email collection setup",
        "2 rounds of revisions",
        "30 days post-launch support",
      ],
    },
    {
      tier: "Premium",
      price: hasEcommerce ? "₱95,000" : featureCount > 5 ? "₱85,000" : "₱75,000",
      includes: [
        "Unlimited pages",
        "Premium custom design",
        "All features + advanced integrations",
        "Full SEO + analytics setup",
        "Content writing assistance",
        "Ad landing pages",
        "3 rounds of revisions",
        "60 days post-launch support",
        "Priority turnaround",
      ],
    },
  ];

  // 8. Add-On Services
  const addOns: { name: string; price: string; description: string }[] = [
    {
      name: "Logo & Brand Identity Package",
      price: "₱15,000",
      description:
        "Custom logo design, color palette, typography guide, and brand style sheet.",
    },
    {
      name: "Professional Copywriting",
      price: "₱10,000",
      description:
        "SEO-optimized copy for all pages — headlines, about section, service descriptions, and CTAs.",
    },
    {
      name: "Professional Photography",
      price: "₱12,000",
      description:
        "On-location photo shoot with edited, web-optimized images for your site.",
    },
    {
      name: "Monthly Maintenance & Updates",
      price: "₱5,000/mo",
      description:
        "Ongoing content updates, security patches, performance monitoring, and priority support.",
    },
    {
      name: "Social Media Starter Kit",
      price: "₱8,000",
      description:
        "Branded templates for posts, stories, and covers across Instagram, Facebook, and LinkedIn.",
    },
    {
      name: "Google Ads Setup & Management",
      price: "₱10,000",
      description:
        "Campaign setup, keyword research, ad copy, landing page optimization, and 30 days of management.",
    },
  ];

  // 9. Next Steps
  const nextSteps = [
    "Review this proposal and select your preferred package",
    "Confirm the project scope and finalize requirements",
    "Sign off on the project agreement and timeline",
    "Provide all available content assets (photos, copy, logos)",
    "Kick off the project — we'll start with discovery and design!",
  ];

  return {
    introduction,
    projectOverview,
    websiteStructure,
    features,
    contentRequirements,
    timeline,
    investment,
    addOns,
    nextSteps,
  };
}

export function proposalToText(proposal: Proposal, businessName: string): string {
  let text = "";

  text += `PROPOSAL FOR ${businessName.toUpperCase()}\n`;
  text += "=".repeat(50) + "\n\n";

  text += "1. INTRODUCTION\n";
  text += "-".repeat(30) + "\n";
  text += proposal.introduction + "\n\n";

  text += "2. PROJECT OVERVIEW\n";
  text += "-".repeat(30) + "\n";
  text += proposal.projectOverview.businessSummary + "\n\n";
  text += "Key Goals:\n";
  proposal.projectOverview.keyGoals.forEach((g) => (text += `  • ${g}\n`));
  text += "\n" + proposal.projectOverview.targetOutcome + "\n\n";

  text += "3. RECOMMENDED WEBSITE STRUCTURE\n";
  text += "-".repeat(30) + "\n";
  proposal.websiteStructure.forEach((p) => {
    text += `  ${p.page}\n    ${p.description}\n\n`;
  });

  text += "4. FEATURES & FUNCTIONALITY\n";
  text += "-".repeat(30) + "\n";
  proposal.features.forEach((f) => {
    text += `  ${f.name}\n    ${f.description}\n\n`;
  });

  text += "5. CONTENT REQUIREMENTS\n";
  text += "-".repeat(30) + "\n";
  proposal.contentRequirements.forEach((c) => {
    text += `  ${c.status === "available" ? "✓" : "✗"} ${c.item}\n`;
  });
  text += "\n";

  text += "6. TIMELINE ESTIMATE\n";
  text += "-".repeat(30) + "\n";
  proposal.timeline.forEach((t) => {
    text += `  ${t.duration}: ${t.phase}\n    ${t.details}\n\n`;
  });

  text += "7. INVESTMENT\n";
  text += "-".repeat(30) + "\n";
  proposal.investment.forEach((i) => {
    text += `  ${i.tier} — ${i.price}\n`;
    i.includes.forEach((inc) => (text += `    • ${inc}\n`));
    text += "\n";
  });

  text += "8. ADD-ON SERVICES\n";
  text += "-".repeat(30) + "\n";
  proposal.addOns.forEach((a) => {
    text += `  ${a.name} — ${a.price}\n    ${a.description}\n\n`;
  });

  text += "9. NEXT STEPS\n";
  text += "-".repeat(30) + "\n";
  proposal.nextSteps.forEach((s, i) => (text += `  ${i + 1}. ${s}\n`));

  return text;
}
