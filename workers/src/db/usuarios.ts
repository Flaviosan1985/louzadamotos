import type { Env } from "../types/env";

export type UsuarioRow = {
  id: string;
  email: string;
  senha_hash: string;
  criado_em: string;
};

export type UsuarioPublico = Pick<UsuarioRow, "id" | "email" | "criado_em">;

export async function findUsuarioByEmail(env: Env, email: string): Promise<UsuarioRow | null> {
  return env.DB.prepare(
    `SELECT id, email, senha_hash, criado_em FROM usuarios WHERE email = ? COLLATE NOCASE`,
  )
    .bind(email.trim().toLowerCase())
    .first<UsuarioRow>();
}

export async function findUsuarioById(env: Env, userId: string): Promise<UsuarioPublico | null> {
  return env.DB.prepare(`SELECT id, email, criado_em FROM usuarios WHERE id = ?`)
    .bind(userId)
    .first<UsuarioPublico>();
}

export async function createUsuario(
  env: Env,
  input: { email: string; senhaHash: string },
): Promise<UsuarioPublico> {
  const email = input.email.trim().toLowerCase();
  await env.DB.prepare(`INSERT INTO usuarios (email, senha_hash) VALUES (?, ?)`)
    .bind(email, input.senhaHash)
    .run();

  const row = await env.DB.prepare(`SELECT id, email, criado_em FROM usuarios WHERE email = ?`)
    .bind(email)
    .first<UsuarioPublico>();

  if (!row) throw new Error("failed to create usuario");
  return row;
}

export async function updateSenhaHash(env: Env, userId: string, senhaHash: string) {
  await env.DB.prepare(`UPDATE usuarios SET senha_hash = ? WHERE id = ?`)
    .bind(senhaHash, userId)
    .run();
}
