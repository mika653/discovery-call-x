import { getDb } from "./firebase";
import { Submission, LeadStatus, FormAnswers } from "@/types";

const COLLECTION = "submissions";

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

export async function addSubmission(submission: Submission): Promise<void> {
  const { doc, setDoc } = await import("firebase/firestore");
  const db = await getDb();
  const docRef = doc(db, COLLECTION, submission.id);
  await setDoc(docRef, {
    ...submission,
    answers: sanitizeAnswers(submission.answers),
  });
}

export async function getSubmissions(): Promise<Submission[]> {
  const { collection, getDocs } = await import("firebase/firestore");
  const db = await getDb();
  const snapshot = await getDocs(collection(db, COLLECTION));
  const submissions = snapshot.docs.map((d) => d.data() as Submission);
  // Sort client-side to avoid needing a Firestore index
  return submissions.sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function updateSubmissionStatus(
  id: string,
  status: LeadStatus
): Promise<void> {
  const { doc, updateDoc } = await import("firebase/firestore");
  const db = await getDb();
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, { status });
}

export async function deleteSubmissionDoc(id: string): Promise<void> {
  const { doc, deleteDoc } = await import("firebase/firestore");
  const db = await getDb();
  const docRef = doc(db, COLLECTION, id);
  await deleteDoc(docRef);
}
