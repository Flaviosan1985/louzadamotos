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

  if (!validateAdminCredentials(user, password)) {
    return Response.json({ error: "Usuário ou senha inválidos" }, { status: 401 });
  }

  await setAdminSession();
  return Response.json({ ok: true });
}
