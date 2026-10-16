import { LOUZADA_SESSION_COOKIE } from "@/lib/louzada/constants";

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET não configurado");
  }
  return secret;
}

async function sign(encoded: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(encoded),
  );
  return Buffer.from(signature).toString("hex");
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i += 1) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function createSessionValue() {
  const payload = JSON.stringify({
    role: "admin",
    exp: Date.now() + SESSION_TTL_MS,
  });
  const encoded = Buffer.from(payload, "utf8").toString("base64url");
  return `${encoded}.${await sign(encoded)}`;
}

export async function verifySessionValue(value: string | undefined | null): Promise<boolean> {
  if (!value) return false;
  const [encoded, signature] = value.split(".");
  if (!encoded || !signature) return false;

  let expected: string;
  try {
    expected = await sign(encoded);
  } catch {
    return false;
  }

  if (!safeEqual(signature, expected)) return false;

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8"),
    ) as { exp?: number };
    if (!payload.exp || Date.now() > payload.exp) return false;
    return true;
  } catch {
    return false;
  }
}

export { LOUZADA_SESSION_COOKIE };
