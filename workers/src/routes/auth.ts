import { signAccessToken } from "../auth/jwt";
import { hashPassword, verifyPassword } from "../crypto/password";
import { createUser, findUserByEmail } from "../db/users";
import type { Env } from "../types/env";
import { badRequest, json, unauthorized } from "../utils/http";

type RegisterBody = { email?: string; password?: string };
type LoginBody = { email?: string; password?: string };

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

  const existing = await findUserByEmail(env, email);
  if (existing) {
    return badRequest("Email já cadastrado");
  }

  const passwordHash = await hashPassword(password);
  const user = await createUser(env, { email, passwordHash });
  const token = await signAccessToken(env, {
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return json({ token, user: { id: user.id, email: user.email, role: user.role } }, { status: 201 });
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

  const user = await findUserByEmail(env, email);
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return unauthorized("Email ou senha inválidos");
  }

  const token = await signAccessToken(env, {
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return json({
    token,
    user: { id: user.id, email: user.email, role: user.role },
  });
}
