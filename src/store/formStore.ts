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

  setAnswer: (questionId: string, value: string | string[] | File[] | null) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  getVisibleQuestions: () => typeof questions;
  submitForm: () => Submission;
  resetForm: () => void;
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

export const useFormStore = create<FormState>()(
  persist(
    (set, get) => ({
      currentStep: -1, // -1 = welcome screen
      answers: {},
      visibleQuestions: filterVisibleQuestions({}),
      isComplete: false,
      submissions: [],
      currentSubmission: null,

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
        const { answers, submissions } = get();
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
          submissions: [...submissions, submission],
          currentSubmission: submission,
          isComplete: true,
        });
        return submission;
      },

      resetForm: () =>
        set({
          currentStep: -1,
          answers: {},
          visibleQuestions: filterVisibleQuestions({}),
          isComplete: false,
          currentSubmission: null,
        }),

      updateLeadStatus: (id, status) =>
        set((state) => ({
          submissions: state.submissions.map((s) =>
            s.id === id ? { ...s, status } : s
          ),
        })),

      deleteSubmission: (id) =>
        set((state) => ({
          submissions: state.submissions.filter((s) => s.id !== id),
        })),
    }),
    {
      name: "discovery-call-x-storage",
      partialize: (state) => ({
        answers: Object.fromEntries(
          Object.entries(state.answers).filter(
            ([, v]) => !(Array.isArray(v) && v[0] instanceof File)
          )
        ),
        submissions: state.submissions,
        currentStep: state.currentStep,
        isComplete: state.isComplete,
      }),
    }
  )
);
