import { SignJWT, jwtVerify } from "jose";
import type { AuthUser, Env } from "../types/env";

const TTL = "7d";

function secretKey(env: Env) {
  return new TextEncoder().encode(env.JWT_SECRET);
}

export async function signAccessToken(env: Env, user: AuthUser): Promise<string> {
  return new SignJWT({
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.userId)
    .setIssuer(env.JWT_ISSUER)
    .setIssuedAt()
    .setExpirationTime(TTL)
    .sign(secretKey(env));
}

export async function verifyAccessToken(env: Env, token: string): Promise<AuthUser> {
  const { payload } = await jwtVerify(token, secretKey(env), {
    issuer: env.JWT_ISSUER,
  });

  const userId = payload.sub;
  if (typeof userId !== "string") {
    throw new Error("invalid token subject");
  }

  return {
    userId,
    email: typeof payload.email === "string" ? payload.email : "",
    role: typeof payload.role === "string" ? payload.role : "admin",
  };
}
