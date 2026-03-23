import { NextRequest, NextResponse } from "next/server";
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

// POST — save a submission
export async function POST(req: NextRequest) {
  try {
    const submission = await req.json();
    const db = getDb();
    await setDoc(doc(db, "submissions", submission.id), submission);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API: Failed to save submission:", err);
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}

// GET — fetch all submissions
export async function GET() {
  try {
    const db = getDb();
    const snapshot = await getDocs(collection(db, "submissions"));
    const submissions = snapshot.docs.map((d) => d.data());
    submissions.sort(
      (a, b) =>
        new Date(b.createdAt as string).getTime() -
        new Date(a.createdAt as string).getTime()
    );
    return NextResponse.json({ success: true, submissions });
  } catch (err) {
    console.error("API: Failed to fetch submissions:", err);
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}

// PATCH — update status
export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    const db = getDb();
    await updateDoc(doc(db, "submissions", id), { status });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}

// DELETE — delete a submission
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const db = getDb();
    await deleteDoc(doc(db, "submissions", id));
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}
