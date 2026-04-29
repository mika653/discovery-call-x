import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let cached: App | undefined;

function getApp(): App {
  if (cached) return cached;
  const existing = getApps();
  if (existing.length > 0) {
    cached = existing[0];
    return cached;
  }
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT env var is not set");
  const credentials = JSON.parse(raw);
  if (typeof credentials.private_key === "string" && credentials.private_key.includes("\\n")) {
    credentials.private_key = credentials.private_key.replace(/\\n/g, "\n");
  }
  cached = initializeApp({ credential: cert(credentials) });
  return cached;
}

export function adminDb(): Firestore {
  return getFirestore(getApp());
}
