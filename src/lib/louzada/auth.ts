import { cookies } from "next/headers";
import {
  createSessionValue,
  LOUZADA_SESSION_COOKIE,
  verifySessionValue,
} from "@/lib/louzada/session";

export function validateAdminCredentials(user: string, password: string) {
  const adminUser = process.env.ADMIN_USER ?? "";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "";
  if (!adminUser || !adminPassword) return false;
  return user === adminUser && password === adminPassword;
}

export async function setAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(LOUZADA_SESSION_COOKIE, await createSessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(LOUZADA_SESSION_COOKIE);
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return await verifySessionValue(
    cookieStore.get(LOUZADA_SESSION_COOKIE)?.value ?? null,
  );
}

export async function requireAdminApi() {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Não autorizado" }, { status: 401 });
  }
  return null;
}
