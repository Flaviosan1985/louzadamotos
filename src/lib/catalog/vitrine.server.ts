import fs from "node:fs";
import path from "node:path";
import { listPublicFromDashboard } from "@/lib/catalog/from-dashboard";
import { demoVeiculos } from "@/lib/demo/seed";
import type { VehicleListFilters, VehicleWithPhotos } from "@/lib/louzada/types";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/supabase/env";
import type { Veiculo } from "@/lib/types/database";

const SNAPSHOT_PATH = path.join(process.cwd(), "data", "vitrine-snapshot.json");

function mapVeiculo(row: Veiculo): Veiculo {
  return {
    ...row,
    preco_custo: Number(row.preco_custo),
    preco_venda: Number(row.preco_venda),
    km: Number(row.km),
    cilindrada: row.cilindrada == null ? null : Number(row.cilindrada),
    fotos: row.fotos ?? [],
  };
}

export function readVitrineSnapshotFile(): Veiculo[] {
  try {
    if (fs.existsSync(SNAPSHOT_PATH)) {
      const raw = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, "utf8")) as Veiculo[];
      if (Array.isArray(raw) && raw.length > 0) {
        return raw.map(mapVeiculo);
      }
    }
  } catch {
    // fallback abaixo
  }
  return structuredClone(demoVeiculos);
}

export function writeVitrineSnapshotFile(veiculos: Veiculo[]) {
  fs.mkdirSync(path.dirname(SNAPSHOT_PATH), { recursive: true });
  fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(veiculos.map(mapVeiculo), null, 2), "utf8");
}

async function loadFromSupabase(): Promise<Veiculo[] | null> {
  const env = getSupabaseEnv();
  if (!env.isConfigured) return null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("veiculos")
      .select("*")
      .in("status", ["disponivel", "vendido"])
      .order("criado_em", { ascending: false });

    if (error || !data) return null;
    return (data as Veiculo[]).map(mapVeiculo);
  } catch {
    return null;
  }
}

/** Estoque publicado no site — mesma fonte do painel Admycar. */
export async function loadVitrineVeiculos(): Promise<Veiculo[]> {
  if (fs.existsSync(SNAPSHOT_PATH)) {
    try {
      const raw = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, "utf8")) as Veiculo[];
      if (Array.isArray(raw) && raw.length > 0) {
        return raw.map(mapVeiculo);
      }
    } catch {
      // tenta Supabase / seed
    }
  }

  const fromDb = await loadFromSupabase();
  if (fromDb && fromDb.length > 0) return fromDb;
  return structuredClone(demoVeiculos);
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
