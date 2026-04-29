"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, expectedSessionValue } from "@/lib/admin-auth";

export type LoginState = { error?: string } | null;

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const password = formData.get("password");
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return { error: "Server is missing ADMIN_PASSWORD." };
  if (typeof password !== "string" || password !== expected) {
    return { error: "Wrong password." };
  }
  const store = await cookies();
  store.set(ADMIN_COOKIE, expectedSessionValue(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  redirect("/admin");
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin");
}
