"use server";

import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function getDb() {
  const app =
    getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  return getFirestore(app);
}

export async function saveSubmission(submission: {
  id: string;
  answers: Record<string, unknown>;
  summary: Record<string, unknown>;
  status: string;
  createdAt: string;
  businessName: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const db = getDb();
    await setDoc(doc(db, "submissions", submission.id), submission);
    return { success: true };
  } catch (err) {
    console.error("Server: Failed to save submission:", err);
    return { success: false, error: String(err) };
  }
}

export async function fetchSubmissions(): Promise<{
  success: boolean;
  submissions?: Record<string, unknown>[];
  error?: string;
}> {
  try {
    const db = getDb();
    const snapshot = await getDocs(collection(db, "submissions"));
    const submissions = snapshot.docs.map((d) => d.data());
    submissions.sort(
      (a, b) =>
        new Date(b.createdAt as string).getTime() -
        new Date(a.createdAt as string).getTime()
    );
    return { success: true, submissions };
  } catch (err) {
    console.error("Server: Failed to fetch submissions:", err);
    return { success: false, error: String(err) };
  }
}

export async function updateStatus(
  id: string,
  status: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const db = getDb();
    await updateDoc(doc(db, "submissions", id), { status });
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

export async function deleteSubmission(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const db = getDb();
    await deleteDoc(doc(db, "submissions", id));
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
