import { FormAnswers, SubmissionSummary } from "@/types";
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

export function generateSummary(answers: FormAnswers): SubmissionSummary {
  const businessName = getAnswer(answers, "business_name");
  const description = getAnswer(answers, "business_description");
  const location = getAnswer(answers, "location");
  const vibes = getMulti(answers, "brand_vibe").map((v) =>
    getLabelForValue("brand_vibe", v)
  );

  const businessOverview = `${businessName} is ${description ? `described as "${description}"` : "a business"} based in ${location || "an unspecified location"}. The desired brand feel is ${vibes.length > 0 ? vibes.join(", ") : "not yet defined"}.`;

  // Website Goals
  const goals = getMulti(answers, "primary_goals").map((g) =>
    getLabelForValue("primary_goals", g)
  );
  const visitorAction = getAnswer(answers, "visitor_action");
  const websiteGoals = [
    ...goals,
    visitorAction
      ? `Primary CTA: ${getLabelForValue("visitor_action", visitorAction)}`
      : "",
  ].filter(Boolean);

  // Recommended Pages
  const recommendedPages = ["Home", "About"];
  const goalValues = getMulti(answers, "primary_goals");
  if (
    goalValues.includes("showcase") ||
    getAnswer(answers, "services_list")
  ) {
    recommendedPages.push("Services");
  }
  if (goalValues.includes("ecommerce")) {
    recommendedPages.push("Shop");
  }
  if (goalValues.includes("bookings") || getAnswer(answers, "needs_reservations") === "yes") {
    recommendedPages.push("Book Now");
  }
  if (getAnswer(answers, "needs_events") !== "no") {
    recommendedPages.push("Events");
  }
  if (goalValues.includes("content")) {
    recommendedPages.push("Blog");
  }
  if (getAnswer(answers, "needs_contact_form") !== "no") {
    recommendedPages.push("Contact");
  }
  recommendedPages.push("Footer with Social Links");

  // Suggested Features
  const suggestedFeatures: string[] = [];
  if (getAnswer(answers, "needs_reservations") !== "no") {
    suggestedFeatures.push("Online Booking / Reservation System");
  }
  const orderingType = getAnswer(answers, "needs_ordering");
  if (orderingType && orderingType !== "no") {
    const label = orderingType === "services"
      ? "Service Request / Quote System"
      : orderingType === "both"
        ? "E-Commerce & Service Request System"
        : "Online Ordering / E-Commerce";
    suggestedFeatures.push(label);
  }
  if (getAnswer(answers, "needs_events") !== "no") {
    suggestedFeatures.push("Events Calendar");
  }
  if (getAnswer(answers, "needs_contact_form") !== "no") {
    suggestedFeatures.push("Contact Form");
  }
  if (getAnswer(answers, "wants_seo") !== "no") {
    suggestedFeatures.push("SEO Optimization");
  }
  if (getAnswer(answers, "wants_email_collection") !== "no") {
    suggestedFeatures.push("Email Collection / Newsletter Signup");
  }
  if (getAnswer(answers, "plans_ads") !== "no") {
    suggestedFeatures.push("Ad Landing Pages & Conversion Tracking");
  }
  const socialMedia = getAnswer(answers, "social_media");
  if (socialMedia) {
    suggestedFeatures.push("Social Media Integration");
  }

  // Content Status
  const available: string[] = [];
  const missing: string[] = [];
  if (businessName) available.push("Business name");
  if (description) available.push("Business description");
  const hasPhotos = getAnswer(answers, "has_photos");
  if (hasPhotos === "professional" || hasPhotos === "phone") {
    available.push("Photos/videos");
  } else {
    missing.push("Professional photography");
  }
  const hasLogo = answers["logo_upload"];
  if (hasLogo && Array.isArray(hasLogo) && hasLogo.length > 0) {
    available.push("Logo");
  } else {
    missing.push("Logo design");
  }
  if (getAnswer(answers, "services_list")) {
    available.push("Services/products list");
  } else {
    missing.push("Services/products copywriting");
  }
  missing.push("Website copywriting");
  if (vibes.length === 0) missing.push("Brand style guide");

  // Growth Opportunities
  const growthOpportunities: string[] = [];
  if (getAnswer(answers, "wants_seo") !== "no") {
    growthOpportunities.push(
      "SEO optimization to rank higher on Google and attract organic traffic"
    );
  }
  if (getAnswer(answers, "plans_ads") !== "no") {
    growthOpportunities.push(
      "Paid advertising with optimized landing pages for conversions"
    );
  }
  if (getAnswer(answers, "wants_email_collection") !== "no") {
    growthOpportunities.push(
      "Email marketing to nurture leads and retain customers"
    );
  }
  if (goalValues.includes("content")) {
    growthOpportunities.push(
      "Content marketing through a blog to build authority"
    );
  }
  if (socialMedia) {
    growthOpportunities.push(
      "Social media integration to drive traffic from existing followers"
    );
  }
  const expansion = getAnswer(answers, "expansion_plans");
  if (expansion) {
    growthOpportunities.push(
      `Scalable website architecture to support planned expansion: "${expansion}"`
    );
  }

  // Priority Next Steps
  const priorityNextSteps: string[] = [
    "Finalize brand identity and style direction",
    "Gather all content assets (photos, copy, service lists)",
  ];
  if (missing.includes("Logo design")) {
    priorityNextSteps.push("Design or finalize logo");
  }
  if (missing.includes("Professional photography")) {
    priorityNextSteps.push("Arrange professional photography");
  }
  priorityNextSteps.push("Define sitemap and page structure");
  priorityNextSteps.push("Begin wireframing and design mockups");
  if (suggestedFeatures.length > 0) {
    priorityNextSteps.push(
      "Set up key integrations: " + suggestedFeatures.slice(0, 3).join(", ")
    );
  }

  return {
    businessOverview,
    websiteGoals,
    recommendedPages,
    suggestedFeatures,
    contentStatus: { available, missing },
    growthOpportunities,
    priorityNextSteps,
  };
}
