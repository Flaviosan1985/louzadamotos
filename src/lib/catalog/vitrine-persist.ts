import { requireCloudflareEnv } from "@/lib/cloudflare/bindings";
import { writeVitrineToKv } from "@/lib/catalog/vitrine-cloudflare";
import { normalizeVitrinePayload } from "@/lib/catalog/vitrine-normalize";

/** Publica vitrine no Cloudflare KV (Edge — sem filesystem). */
export async function persistVitrineSnapshot(rawVeiculos: unknown) {
  const veiculos = normalizeVitrinePayload(rawVeiculos);
  const { VITRINE_KV } = await requireCloudflareEnv();
  const snapshot = await writeVitrineToKv(VITRINE_KV, veiculos);
  return { storage: "kv" as const, count: veiculos.length, version: snapshot.version };
}
