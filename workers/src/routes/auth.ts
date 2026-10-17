import { signAccessToken } from "../auth/jwt";
import { hashPassword, verifyPassword } from "../crypto/password";
import { createUsuario, findUsuarioByEmail } from "../db/usuarios";
import type { Env } from "../types/env";
import { badRequest, json, unauthorized } from "../utils/http";

type RegisterBody = { email?: string; password?: string };
type LoginBody = { email?: string; password?: string };

function authUserFromDb(user: { id: string; email: string }) {
  return { userId: user.id, email: user.email, role: "admin" as const };
}

export async function handleRegister(request: Request, env: Env) {
  let body: RegisterBody;
  try {
    body = await request.json();
  } catch {
    return badRequest("JSON inválido");
  }

  const email = body.email?.trim() ?? "";
  const password = body.password ?? "";
  if (!email || password.length < 8) {
    return badRequest("Informe email e senha (mín. 8 caracteres)");
  }

  const existing = await findUsuarioByEmail(env, email);
  if (existing) {
    return badRequest("Email já cadastrado");
  }

  const senhaHash = await hashPassword(password);
  const user = await createUsuario(env, { email, senhaHash });
  const authUser = authUserFromDb(user);
  const token = await signAccessToken(env, authUser);

  return json(
    { token, user: { id: user.id, email: user.email, role: authUser.role } },
    { status: 201 },
  );
}

export async function handleLogin(request: Request, env: Env) {
  let body: LoginBody;
  try {
    body = await request.json();
  } catch {
    return badRequest("JSON inválido");
  }

  const email = body.email?.trim() ?? "";
  const password = body.password ?? "";
  if (!email || !password) {
    return badRequest("Informe email e senha");
  }

  const user = await findUsuarioByEmail(env, email);
  if (!user || !(await verifyPassword(password, user.senha_hash))) {
    return unauthorized("Email ou senha inválidos");
  }

  const authUser = authUserFromDb(user);
  const token = await signAccessToken(env, authUser);

  return json({
    token,
    user: { id: user.id, email: user.email, role: authUser.role },
  });
}
