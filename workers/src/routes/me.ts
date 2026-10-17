import { hashPassword, verifyPassword } from "../crypto/password";
import { findUsuarioByEmail, findUsuarioById, updateSenhaHash } from "../db/usuarios";
import { requireAuth } from "../middleware/require-auth";
import type { Env } from "../types/env";
import { badRequest, forbidden, json } from "../utils/http";

export async function handleGetMe(request: Request, env: Env) {
  const auth = await requireAuth(request, env);
  if (auth instanceof Response) return auth;

  const user = await findUsuarioById(env, auth.userId);
  if (!user) return forbidden();

  return json({ id: user.id, email: user.email, role: auth.role });
}

type ChangePasswordBody = { currentPassword?: string; newPassword?: string };

export async function handleChangePassword(request: Request, env: Env) {
  const auth = await requireAuth(request, env);
  if (auth instanceof Response) return auth;

  let body: ChangePasswordBody;
  try {
    body = await request.json();
  } catch {
    return badRequest("JSON inválido");
  }

  const currentPassword = body.currentPassword ?? "";
  const newPassword = body.newPassword ?? "";
  if (!currentPassword || newPassword.length < 8) {
    return badRequest("Senha atual e nova senha (mín. 8) são obrigatórias");
  }

  const user = await findUsuarioByEmail(env, auth.email);
  if (!user || user.id !== auth.userId) {
    return forbidden();
  }

  if (!(await verifyPassword(currentPassword, user.senha_hash))) {
    return forbidden("Senha atual incorreta");
  }

  const senhaHash = await hashPassword(newPassword);
  await updateSenhaHash(env, auth.userId, senhaHash);

  return json({ ok: true });
}
