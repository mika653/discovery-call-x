import { getDb } from "./firebase";
import { Submission, LeadStatus, FormAnswers } from "@/types";
import { TenantConfig } from "@/types/tenant";

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

// Tenant config operations
export async function getTenantConfig(slug: string): Promise<TenantConfig | null> {
  const { doc, getDoc } = await import("firebase/firestore");
  const db = await getDb();
  const docRef = doc(db, "tenants", slug);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return snap.data() as TenantConfig;
}

export async function saveTenantConfig(config: TenantConfig): Promise<void> {
  const { doc, setDoc } = await import("firebase/firestore");
  const db = await getDb();
  const docRef = doc(db, "tenants", config.slug);
  await setDoc(docRef, config);
}

export async function getAllTenants(): Promise<TenantConfig[]> {
  const { collection, getDocs } = await import("firebase/firestore");
  const db = await getDb();
  const snapshot = await getDocs(collection(db, "tenants"));
  return snapshot.docs.map((d) => d.data() as TenantConfig);
}

// Tenant-scoped submission operations
export async function addTenantSubmission(
  slug: string,
  submission: Submission
): Promise<void> {
  const { doc, setDoc } = await import("firebase/firestore");
  const db = await getDb();
  const docRef = doc(db, "tenants", slug, "submissions", submission.id);
  await setDoc(docRef, {
    ...submission,
    answers: sanitizeAnswers(submission.answers),
    tenantSlug: slug,
  });
}

export async function getTenantSubmissions(slug: string): Promise<Submission[]> {
  const { collection, query, orderBy, getDocs } = await import("firebase/firestore");
  const db = await getDb();
  const q = query(
    collection(db, "tenants", slug, "submissions"),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data() as Submission);
}

export async function updateTenantSubmissionStatus(
  slug: string,
  id: string,
  status: LeadStatus
): Promise<void> {
  const { doc, updateDoc } = await import("firebase/firestore");
  const db = await getDb();
  const docRef = doc(db, "tenants", slug, "submissions", id);
  await updateDoc(docRef, { status });
}

export async function deleteTenantSubmissionDoc(
  slug: string,
  id: string
): Promise<void> {
  const { doc, deleteDoc } = await import("firebase/firestore");
  const db = await getDb();
  const docRef = doc(db, "tenants", slug, "submissions", id);
  await deleteDoc(docRef);
}
