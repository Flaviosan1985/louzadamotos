import type { StatusVeiculo, Veiculo } from "@/lib/types/database";

/** Apenas estes status entram no snapshot publicado (reservado fica só no painel). */
const VITRINE_PUBLISH_STATUSES = new Set<StatusVeiculo>(["disponivel", "vendido"]);

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

function sortForVitrine(a: Veiculo, b: Veiculo) {
  if (a.status === b.status) {
    return (b.criado_em ?? "").localeCompare(a.criado_em ?? "");
  }
  if (a.status === "vendido") return 1;
  if (b.status === "vendido") return -1;
  return 0;
}

/** Valida, filtra (sem reservado) e ordena (vendidos por último) antes de gravar no KV. */
export function normalizeVitrinePayload(raw: unknown): Veiculo[] {
  if (!Array.isArray(raw)) {
    throw new Error("Lista de veículos inválida");
  }

  const veiculos: Veiculo[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const row = item as Veiculo;
    if (!row.id || !row.marca?.trim() || !row.modelo?.trim()) continue;
    if (!VITRINE_PUBLISH_STATUSES.has(row.status)) continue;
    veiculos.push(mapVeiculo(row));
  }

  if (veiculos.length === 0) {
    throw new Error("Nenhum veículo disponível ou vendido para publicar na vitrine");
  }

  return veiculos.sort(sortForVitrine);
}
