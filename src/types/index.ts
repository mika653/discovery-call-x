export type QuestionType =
  | "text"
  | "textarea"
  | "select"
  | "multiselect"
  | "file"
  | "url"
  | "email"
  | "phone"
  | "links";

export interface QuestionOption {
  label: string;
  value: string;
}

export interface Question {
  id: string;
  section: string;
  sectionLabel: string;
  question: string;
  subtitle?: string;
  type: QuestionType;
  options?: QuestionOption[];
  placeholder?: string;
  required?: boolean;
  condition?: {
    questionId: string;
    value: string | string[];
  };
}

export interface FormAnswers {
  [questionId: string]: string | string[] | File[] | null;
}

export type LeadStatus = "new" | "qualified" | "proposal_sent" | "closed";

export interface Submission {
  id: string;
  answers: FormAnswers;
  summary: SubmissionSummary;
  status: LeadStatus;
  createdAt: string;
  businessName: string;
}

export interface SubmissionSummary {
  businessOverview: string;
  websiteGoals: string[];
  recommendedPages: string[];
  suggestedFeatures: string[];
  contentStatus: { available: string[]; missing: string[] };
  growthOpportunities: string[];
  priorityNextSteps: string[];
}
