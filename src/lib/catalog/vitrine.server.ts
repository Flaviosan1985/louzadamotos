import { unstable_cache } from "next/cache";
import { listPublicFromDashboard } from "@/lib/catalog/from-dashboard";
import { getCloudflareEnv, readVitrineFromKv } from "@/lib/catalog/vitrine-cloudflare";
import { VITRINE_CACHE_TAG } from "@/lib/catalog/vitrine-keys";
import { demoVeiculos } from "@/lib/demo/seed";
import type { VehicleListFilters, VehicleWithPhotos } from "@/lib/louzada/types";
import type { Veiculo } from "@/lib/types/database";

function devFallbackVeiculos(): Veiculo[] {
  return structuredClone(demoVeiculos).filter((v) => v.status !== "reservado");
}

/** Leitura direta do KV (sem cache Next). Fora da CF, usa seed demo apenas em development. */
export async function loadVitrineVeiculosUncached(): Promise<Veiculo[]> {
  const cf = await getCloudflareEnv();
  if (cf?.VITRINE_KV) {
    const fromKv = await readVitrineFromKv(cf.VITRINE_KV);
    if (fromKv?.length) return fromKv;
  }

  if (process.env.NODE_ENV === "development") {
    return devFallbackVeiculos();
  }

  return [];
}

const loadVitrineVeiculosCached = unstable_cache(
  async () => loadVitrineVeiculosUncached(),
  ["vitrine-veiculos"],
  { tags: [VITRINE_CACHE_TAG], revalidate: 3600 },
);

export async function loadVitrineVeiculos(): Promise<Veiculo[]> {
  return loadVitrineVeiculosCached();
}

export async function loadVitrineCatalog(filters: VehicleListFilters = {}): Promise<VehicleWithPhotos[]> {
  const veiculos = await loadVitrineVeiculos();
  return listPublicFromDashboard(veiculos, filters);
}

export function listVitrineBrands(
  vehicles: VehicleWithPhotos[],
  type?: "moto" | "auto",
): string[] {
  const pool = type ? vehicles.filter((v) => v.type === type && v.status !== "vendido") : vehicles;
  return [...new Set(pool.map((v) => v.brand))].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export async function getVitrineVehicleById(id: string): Promise<VehicleWithPhotos | null> {
  const veiculos = await loadVitrineVeiculos();
  const found = veiculos.find((v) => v.id === id);
  if (!found || found.status === "reservado") return null;
  return listPublicFromDashboard([found])[0] ?? null;
}
