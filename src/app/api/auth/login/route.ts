import { cookies } from "next/headers";
import { cloudflareLogin } from "@/lib/cloudflare/client";
import {
  isCloudflareLouzadaBackend,
  LOUZADA_TOKEN_COOKIE,
} from "@/lib/cloudflare/config";
import {
  setAdminSession,
  validateAdminCredentials,
} from "@/lib/louzada/auth";

export async function POST(request: Request) {
  let body: { user?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "JSON inválido" }, { status: 400 });
  }

  const user = body.user?.trim() ?? "";
  const password = body.password ?? "";

  if (isCloudflareLouzadaBackend()) {
    try {
      const { token } = await cloudflareLogin(user, password);
      const cookieStore = await cookies();
      cookieStore.set(LOUZADA_TOKEN_COOKIE, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      await setAdminSession();
      return Response.json({ ok: true });
    } catch {
      return Response.json({ error: "Usuário ou senha inválidos" }, { status: 401 });
    }
  }

  if (!validateAdminCredentials(user, password)) {
    return Response.json({ error: "Usuário ou senha inválidos" }, { status: 401 });
  }

  await setAdminSession();
  return Response.json({ ok: true });
}
