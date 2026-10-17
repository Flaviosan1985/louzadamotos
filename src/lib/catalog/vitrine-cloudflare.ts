import { tryGetCloudflareEnv } from "@/lib/cloudflare/bindings";
import {
  VITRINE_KV_SNAPSHOT_KEY,
  VITRINE_KV_VERSION_KEY,
} from "@/lib/catalog/vitrine-keys";
import type { Veiculo } from "@/lib/types/database";

export type VitrineSnapshot = {
  version: number;
  updatedAt: string;
  veiculos: Veiculo[];
};

export async function getCloudflareEnv() {
  return tryGetCloudflareEnv();
}

export async function readVitrineFromKv(kv: KVNamespace): Promise<Veiculo[] | null> {
  const snapshot = await kv.get<VitrineSnapshot>(VITRINE_KV_SNAPSHOT_KEY, "json");
  if (!snapshot?.veiculos?.length) return null;
  return snapshot.veiculos;
}

export async function writeVitrineToKv(kv: KVNamespace, veiculos: Veiculo[]): Promise<VitrineSnapshot> {
  const previous = await kv.get<VitrineSnapshot>(VITRINE_KV_SNAPSHOT_KEY, "json");
  const version = (previous?.version ?? 0) + 1;
  const snapshot: VitrineSnapshot = {
    version,
    updatedAt: new Date().toISOString(),
    veiculos,
  };
  await kv.put(VITRINE_KV_SNAPSHOT_KEY, JSON.stringify(snapshot));
  await kv.put(VITRINE_KV_VERSION_KEY, String(version));
  return snapshot;
}
