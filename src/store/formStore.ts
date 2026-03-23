import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FormAnswers, Submission, SubmissionSummary, LeadStatus } from "@/types";
import { questions } from "@/lib/questions";
import { generateSummary } from "@/lib/recommendations";
const firestoreAdd = (submission: Submission) =>
  import("@/lib/firestore").then((m) => m.addSubmission(submission));
const firestoreGet = () =>
  import("@/lib/firestore").then((m) => m.getSubmissions());
const firestoreUpdateStatus = (id: string, status: LeadStatus) =>
  import("@/lib/firestore").then((m) => m.updateSubmissionStatus(id, status));
const firestoreDelete = (id: string) =>
  import("@/lib/firestore").then((m) => m.deleteSubmissionDoc(id));
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
        // Write to Firestore in the background
        firestoreAdd(submission)
          .then(() => console.log("Submission saved to Firestore:", submission.id))
          .catch((err) => {
            console.error("Failed to save submission:", err);
            alert("Error saving to database: " + (err as Error).message);
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
          const submissions = await firestoreGet();
          set({ submissions, isLoadingSubmissions: false });
        } catch (err) {
          console.error("Failed to load submissions:", err);
          alert("Error loading submissions: " + (err as Error).message);
          set({ isLoadingSubmissions: false });
        }
      },

      updateLeadStatus: (id, status) => {
        // Optimistic local update
        set((state) => ({
          submissions: state.submissions.map((s) =>
            s.id === id ? { ...s, status } : s
          ),
        }));
        // Sync to Firestore
        firestoreUpdateStatus(id, status).catch((err) =>
          console.error("Failed to update status:", err)
        );
      },

      deleteSubmission: (id) => {
        // Optimistic local update
        set((state) => ({
          submissions: state.submissions.filter((s) => s.id !== id),
        }));
        // Sync to Firestore
        firestoreDelete(id).catch((err) =>
          console.error("Failed to delete submission:", err)
        );
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
