import type { Env } from "../types/env";

export type UserRow = {
  id: string;
  email: string;
  password_hash: string;
  role: string;
};

export async function findUserByEmail(env: Env, email: string): Promise<UserRow | null> {
  return env.DB.prepare(
    `SELECT id, email, password_hash, role FROM users WHERE email = ? COLLATE NOCASE`,
  )
    .bind(email.trim().toLowerCase())
    .first<UserRow>();
}

export async function findUserById(env: Env, userId: string): Promise<Omit<UserRow, "password_hash"> | null> {
  return env.DB.prepare(`SELECT id, email, role FROM users WHERE id = ?`)
    .bind(userId)
    .first<Omit<UserRow, "password_hash">>();
}

export async function createUser(
  env: Env,
  input: { email: string; passwordHash: string; role?: string },
): Promise<Omit<UserRow, "password_hash">> {
  const email = input.email.trim().toLowerCase();
  const role = input.role ?? "admin";
  await env.DB.prepare(
    `INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)`,
  )
    .bind(email, input.passwordHash, role)
    .run();

  const row = await env.DB.prepare(`SELECT id, email, role FROM users WHERE email = ?`)
    .bind(email)
    .first<Omit<UserRow, "password_hash">>();

  if (!row) throw new Error("failed to create user");
  return row;
}

export async function updatePasswordHash(env: Env, userId: string, passwordHash: string) {
  await env.DB.prepare(
    `UPDATE users SET password_hash = ?, updated_at = datetime('now') WHERE id = ?`,
  )
    .bind(passwordHash, userId)
    .run();
}
