import type { CloudflareEnv } from "@/types/cloudflare-env";

/** Bindings KV / D1 / R2 via OpenNext (`@opennextjs/cloudflare`). */
export async function tryGetCloudflareEnv(): Promise<CloudflareEnv | null> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { env } = await getCloudflareContext({ async: true });
    const cf = env as Partial<CloudflareEnv>;
    return cf.VITRINE_KV ? (cf as CloudflareEnv) : null;
  } catch {
    return null;
  }
}

export async function requireCloudflareEnv(): Promise<CloudflareEnv> {
  const env = await tryGetCloudflareEnv();
  if (!env?.VITRINE_KV) {
    throw new Error(
      "Binding VITRINE_KV indisponível. Use `npm run cf:preview` ou deploy na Cloudflare com wrangler.toml.",
    );
  }
  return env;
}
