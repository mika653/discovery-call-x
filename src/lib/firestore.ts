import {
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";
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
  const docRef = doc(db, COLLECTION, submission.id);
  await setDoc(docRef, {
    ...submission,
    answers: sanitizeAnswers(submission.answers),
  });
}

export async function getSubmissions(): Promise<Submission[]> {
  const q = query(
    collection(db, COLLECTION),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as Submission);
}

export async function updateSubmissionStatus(
  id: string,
  status: LeadStatus
): Promise<void> {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, { status });
}

export async function deleteSubmissionDoc(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION, id);
  await deleteDoc(docRef);
}
