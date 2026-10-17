const ITERATIONS = 210_000;
const HASH_BITS = 256;
const SALT_BYTES = 16;

function b64(u8: Uint8Array): string {
  return btoa(String.fromCharCode(...u8));
}

function fromB64(s: string): Uint8Array {
  return Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
}

async function derive(password: string, salt: Uint8Array, iterations: number): Promise<ArrayBuffer> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  return crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    keyMaterial,
    HASH_BITS,
  );
}

/** pbkdf2-sha256$iterations$base64(salt)$base64(hash) */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const hash = new Uint8Array(await derive(password, salt, ITERATIONS));
  return `pbkdf2-sha256$${ITERATIONS}$${b64(salt)}$${b64(hash)}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algo, iterStr, saltB64, hashB64] = stored.split("$");
  if (algo !== "pbkdf2-sha256" || !iterStr || !saltB64 || !hashB64) return false;

  const iterations = Number(iterStr);
  if (!Number.isFinite(iterations) || iterations < 1) return false;

  const salt = fromB64(saltB64);
  const expected = fromB64(hashB64);
  const actual = new Uint8Array(await derive(password, salt, iterations));

  return timingSafeEqual(actual, expected);
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}
