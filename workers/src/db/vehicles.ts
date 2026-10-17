import type { Env } from "../types/env";

export type VehicleRow = {
  id: number;
  type: "moto" | "auto";
  brand: string;
  model: string;
  year: number;
  km: number;
  color: string;
  price: number;
  description: string;
  status: "disponivel" | "vendido";
  featured: number;
  displacement: number | null;
  created_at: string;
};

export async function getVehicle(env: Env, id: number): Promise<VehicleRow | null> {
  return env.DB.prepare(
    `SELECT id, type, brand, model, year, km, color, price, description, status, featured, displacement, created_at
     FROM vehicles WHERE id = ?`,
  )
    .bind(id)
    .first<VehicleRow>();
}

export async function listPublicVehicles(env: Env): Promise<VehicleRow[]> {
  const { results } = await env.DB.prepare(
    `SELECT id, type, brand, model, year, km, color, price, description, status, featured, displacement, created_at
     FROM vehicles WHERE status = 'disponivel' ORDER BY featured DESC, created_at DESC`,
  ).all<VehicleRow>();
  return results ?? [];
}
