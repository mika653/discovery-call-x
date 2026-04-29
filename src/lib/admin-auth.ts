import { cookies } from "next/headers";
import crypto from "crypto";

export const ADMIN_COOKIE = "admin_session";

export function expectedSessionValue(): string {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) throw new Error("ADMIN_PASSWORD env var is not set");
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function isAdmin(): Promise<boolean> {
  if (!process.env.ADMIN_PASSWORD) return false;
  const store = await cookies();
  const session = store.get(ADMIN_COOKIE)?.value;
  if (!session) return false;
  const expected = expectedSessionValue();
  if (session.length !== expected.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(session), Buffer.from(expected));
  } catch {
    return false;
  }
}
