"use server";

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function getDb() {
  if (getApps().length === 0) {
    initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  }
  return getFirestore();
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
    await db.collection("submissions").doc(submission.id).set(submission);
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
    const snapshot = await db.collection("submissions").get();
    const submissions = snapshot.docs.map((doc) => doc.data());
    submissions.sort((a, b) =>
      new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime()
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
    await db.collection("submissions").doc(id).update({ status });
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
    await db.collection("submissions").doc(id).delete();
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
