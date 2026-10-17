import { verifyAccessToken } from "../auth/jwt";
import type { AuthUser, Env } from "../types/env";
import { unauthorized } from "../utils/http";

function extractBearer(request: Request): string | null {
  const header = request.headers.get("Authorization");
  if (header?.startsWith("Bearer ")) {
    return header.slice(7).trim();
  }
  const cookie = request.headers.get("Cookie")?.match(/(?:^|;\s*)louzada_token=([^;]+)/)?.[1];
  return cookie ? decodeURIComponent(cookie) : null;
}

export async function requireAuth(request: Request, env: Env): Promise<AuthUser | Response> {
  const token = extractBearer(request);
  if (!token) return unauthorized();

  try {
    return await verifyAccessToken(env, token);
  } catch {
    return unauthorized("Sessão inválida ou expirada");
  }
}
