import type { Env } from "../types/env";

export type VeiculoStatus = "Disponível" | "Vendido" | "Reservado";

export type VeiculoRow = {
  id: number;
  marca: string;
  modelo: string;
  ano: number;
  preco: number;
  status: VeiculoStatus;
  criado_em: string;
};

export const STATUS_DISPONIVEL: VeiculoStatus = "Disponível";

export async function getVeiculo(env: Env, id: number): Promise<VeiculoRow | null> {
  return env.DB.prepare(
    `SELECT id, marca, modelo, ano, preco, status, criado_em FROM veiculos WHERE id = ?`,
  )
    .bind(id)
    .first<VeiculoRow>();
}

export async function listVeiculosPublicos(env: Env): Promise<VeiculoRow[]> {
  const { results } = await env.DB.prepare(
    `SELECT id, marca, modelo, ano, preco, status, criado_em
     FROM veiculos WHERE status = ? ORDER BY criado_em DESC`,
  )
    .bind(STATUS_DISPONIVEL)
    .all<VeiculoRow>();
  return results ?? [];
}
