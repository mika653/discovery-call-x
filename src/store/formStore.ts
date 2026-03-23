import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FormAnswers, Submission, SubmissionSummary, LeadStatus } from "@/types";
import { questions } from "@/lib/questions";
import { generateSummary } from "@/lib/recommendations";
import { v4 as uuidv4 } from "uuid";

interface FormState {
  currentStep: number;
  answers: FormAnswers;
  visibleQuestions: typeof questions;
  isComplete: boolean;
  submissions: Submission[];
  currentSubmission: Submission | null;
  isLoadingSubmissions: boolean;

  setAnswer: (questionId: string, value: string | string[] | File[] | null) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  getVisibleQuestions: () => typeof questions;
  submitForm: () => void;
  resetForm: () => void;
  loadSubmissions: () => Promise<void>;
  updateLeadStatus: (id: string, status: LeadStatus) => void;
  deleteSubmission: (id: string) => void;
}

function filterVisibleQuestions(answers: FormAnswers) {
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

function sanitizeAnswers(answers: FormAnswers): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(answers)) {
    if (Array.isArray(value) && value.length > 0 && value[0] instanceof File) {
      sanitized[key] = null;
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

export const useFormStore = create<FormState>()(
  persist(
    (set, get) => ({
      currentStep: -1,
      answers: {},
      visibleQuestions: filterVisibleQuestions({}),
      isComplete: false,
      submissions: [],
      currentSubmission: null,
      isLoadingSubmissions: false,

      setAnswer: (questionId, value) => {
        set((state) => {
          const newAnswers = { ...state.answers, [questionId]: value };
          return {
            answers: newAnswers,
            visibleQuestions: filterVisibleQuestions(newAnswers),
          };
        });
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

      getVisibleQuestions: () => filterVisibleQuestions(get().answers),

      submitForm: () => {
        const { answers } = get();
        const summary: SubmissionSummary = generateSummary(answers);
        const submission: Submission = {
          id: uuidv4(),
          answers: { ...answers },
          summary,
          status: "new",
          createdAt: new Date().toISOString(),
          businessName:
            (answers.business_name as string) || "Unnamed Business",
        };

        set({
          currentSubmission: submission,
          isComplete: true,
        });

        // Save via API route (runs on Vercel server, not browser Firebase SDK)
        fetch("/api/submissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: submission.id,
            answers: sanitizeAnswers(submission.answers),
            summary: submission.summary,
            status: submission.status,
            createdAt: submission.createdAt,
            businessName: submission.businessName,
          }),
        })
          .then((res) => res.json())
          .then((result) => {
            if (!result.success) {
              console.error("API error:", result.error);
            }
          })
          .catch((err) => {
            console.error("Fetch failed:", err);
          });
      },

      resetForm: () =>
        set({
          currentStep: -1,
          answers: {},
          visibleQuestions: filterVisibleQuestions({}),
          isComplete: false,
          currentSubmission: null,
        }),

      loadSubmissions: async () => {
        set({ isLoadingSubmissions: true });
        try {
          const res = await fetch("/api/submissions");
          const result = await res.json();
          if (result.success && result.submissions) {
            set({
              submissions: result.submissions as Submission[],
              isLoadingSubmissions: false,
            });
          } else {
            console.error("Failed to fetch:", result.error);
            set({ isLoadingSubmissions: false });
          }
        } catch (err) {
          console.error("Failed to load submissions:", err);
          set({ isLoadingSubmissions: false });
        }
      },

      updateLeadStatus: (id, status) => {
        set((state) => ({
          submissions: state.submissions.map((s) =>
            s.id === id ? { ...s, status } : s
          ),
        }));
        fetch("/api/submissions", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status }),
        }).catch((err) => console.error("Failed to update status:", err));
      },

      deleteSubmission: (id) => {
        set((state) => ({
          submissions: state.submissions.filter((s) => s.id !== id),
        }));
        fetch("/api/submissions", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        }).catch((err) => console.error("Failed to delete submission:", err));
      },
    }),
    {
      name: "discovery-call-x-storage",
      partialize: (state) => ({
        answers: Object.fromEntries(
          Object.entries(state.answers).filter(
            ([, v]) => !(Array.isArray(v) && v[0] instanceof File)
          )
        ),
        currentStep: state.currentStep,
        isComplete: state.isComplete,
      }),
    }
  )
);
