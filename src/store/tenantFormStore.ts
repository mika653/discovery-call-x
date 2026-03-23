import { create } from "zustand";
import { FormAnswers, Submission, SubmissionSummary, LeadStatus, Question } from "@/types";
import { TenantConfig } from "@/types/tenant";
import { generateSummary } from "@/lib/recommendations";
const addTenantSubmission = (slug: string, submission: Submission) =>
  import("@/lib/tenant-firestore").then((m) => m.addTenantSubmission(slug, submission));
const getTenantSubmissions = (slug: string) =>
  import("@/lib/tenant-firestore").then((m) => m.getTenantSubmissions(slug));
const updateTenantSubmissionStatus = (slug: string, id: string, status: LeadStatus) =>
  import("@/lib/tenant-firestore").then((m) => m.updateTenantSubmissionStatus(slug, id, status));
const deleteTenantSubmissionDoc = (slug: string, id: string) =>
  import("@/lib/tenant-firestore").then((m) => m.deleteTenantSubmissionDoc(slug, id));
import { demoSubmissions } from "@/lib/demo-submissions";
import { v4 as uuidv4 } from "uuid";

interface TenantFormState {
  tenantSlug: string;
  tenantQuestions: Question[];
  currentStep: number;
  answers: FormAnswers;
  isComplete: boolean;
  submissions: Submission[];
  currentSubmission: Submission | null;
  isLoadingSubmissions: boolean;

  init: (config: TenantConfig) => void;
  setAnswer: (questionId: string, value: string | string[] | File[] | null) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  getVisibleQuestions: () => Question[];
  submitForm: () => void;
  resetForm: () => void;
  loadSubmissions: () => Promise<void>;
  updateLeadStatus: (id: string, status: LeadStatus) => void;
  deleteSubmission: (id: string) => void;
}

function filterVisibleQuestions(questions: Question[], answers: FormAnswers) {
  return questions.filter((q) => {
    if (!q.condition) return true;
    const depAnswer = answers[q.condition.questionId];
    if (!depAnswer) return false;
    const condValues = Array.isArray(q.condition.value)
      ? q.condition.value
      : [q.condition.value];
    if (Array.isArray(depAnswer)) {
      return depAnswer.some((a) => condValues.includes(a as string));
    }
    return condValues.includes(depAnswer as string);
  });
}

export const useTenantFormStore = create<TenantFormState>()((set, get) => ({
  tenantSlug: "",
  tenantQuestions: [],
  currentStep: -1,
  answers: {},
  isComplete: false,
  submissions: [],
  currentSubmission: null,
  isLoadingSubmissions: false,

  init: (config) => {
    // Only reinitialize if slug changed
    if (get().tenantSlug === config.slug && get().tenantQuestions.length > 0) return;
    set({
      tenantSlug: config.slug,
      tenantQuestions: config.questions,
      currentStep: -1,
      answers: {},
      isComplete: false,
      currentSubmission: null,
    });
  },

  setAnswer: (questionId, value) => {
    set((state) => ({
      answers: { ...state.answers, [questionId]: value },
    }));
  },

  nextStep: () => {
    const { currentStep } = get();
    const visible = get().getVisibleQuestions();
    if (currentStep < visible.length - 1) {
      set({ currentStep: currentStep + 1 });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1 });
    } else if (currentStep === 0) {
      set({ currentStep: -1 });
    }
  },

  goToStep: (step) => set({ currentStep: step }),

  getVisibleQuestions: () => filterVisibleQuestions(get().tenantQuestions, get().answers),

  submitForm: () => {
    const { answers, tenantSlug } = get();
    const summary: SubmissionSummary = generateSummary(answers);
    const submission: Submission = {
      id: uuidv4(),
      answers: { ...answers },
      summary,
      status: "new",
      createdAt: new Date().toISOString(),
      businessName: (answers.business_name as string) || "Unnamed Business",
    };
    set({
      currentSubmission: submission,
      isComplete: true,
    });
    addTenantSubmission(tenantSlug, submission)
      .then(() => console.log("Tenant submission saved:", submission.id))
      .catch((err) => {
        console.error("Failed to save tenant submission:", err);
      });
  },

  resetForm: () =>
    set({
      currentStep: -1,
      answers: {},
      isComplete: false,
      currentSubmission: null,
    }),

  loadSubmissions: async () => {
    const { tenantSlug } = get();
    set({ isLoadingSubmissions: true });
    try {
      let submissions = await getTenantSubmissions(tenantSlug);
      // Seed demo data if the demo tenant has no real submissions
      if (submissions.length === 0 && tenantSlug === "demo") {
        submissions = demoSubmissions;
        // Persist seed data to Firestore in background
        for (const sub of demoSubmissions) {
          addTenantSubmission("demo", sub).catch(() => {});
        }
      }
      set({ submissions, isLoadingSubmissions: false });
    } catch (err) {
      console.error("Failed to load tenant submissions:", err);
      // Offline fallback for demo
      if (tenantSlug === "demo") {
        set({ submissions: demoSubmissions, isLoadingSubmissions: false });
      } else {
        set({ isLoadingSubmissions: false });
      }
    }
  },

  updateLeadStatus: (id, status) => {
    const { tenantSlug } = get();
    set((state) => ({
      submissions: state.submissions.map((s) =>
        s.id === id ? { ...s, status } : s
      ),
    }));
    updateTenantSubmissionStatus(tenantSlug, id, status).catch((err) =>
      console.error("Failed to update tenant status:", err)
    );
  },

  deleteSubmission: (id) => {
    const { tenantSlug } = get();
    set((state) => ({
      submissions: state.submissions.filter((s) => s.id !== id),
    }));
    deleteTenantSubmissionDoc(tenantSlug, id).catch((err) =>
      console.error("Failed to delete tenant submission:", err)
    );
  },
}));
