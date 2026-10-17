export function isCloudflareLouzadaBackend() {
  return process.env.LOUZADA_BACKEND === "cloudflare";
}

export function getCloudflareApiUrl() {
  const base = process.env.CLOUDFLARE_API_URL?.replace(/\/$/, "");
  if (!base && isCloudflareLouzadaBackend()) {
    throw new Error("CLOUDFLARE_API_URL não configurado");
  }
  return base ?? "";
}

export const LOUZADA_TOKEN_COOKIE = "louzada_token";
