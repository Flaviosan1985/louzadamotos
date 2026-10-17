import type { Env } from "../types/env";

export type FotoRow = {
  id: number;
  veiculo_id: number;
  r2_key: string;
  ordem: number;
  criado_em: string;
};

export async function listFotosByVeiculo(env: Env, veiculoId: number): Promise<FotoRow[]> {
  const { results } = await env.DB.prepare(
    `SELECT id, veiculo_id, r2_key, ordem, criado_em
     FROM fotos WHERE veiculo_id = ? ORDER BY ordem ASC, id ASC`,
  )
    .bind(veiculoId)
    .all<FotoRow>();
  return results ?? [];
}

export async function getFotoById(env: Env, fotoId: number): Promise<FotoRow | null> {
  return env.DB.prepare(
    `SELECT id, veiculo_id, r2_key, ordem, criado_em FROM fotos WHERE id = ?`,
  )
    .bind(fotoId)
    .first<FotoRow>();
}

export async function insertFoto(
  env: Env,
  input: { veiculoId: number; r2Key: string },
): Promise<FotoRow> {
  const maxOrdem = await env.DB.prepare(
    `SELECT COALESCE(MAX(ordem), -1) AS maxOrdem FROM fotos WHERE veiculo_id = ?`,
  )
    .bind(input.veiculoId)
    .first<{ maxOrdem: number }>();

  const ordem = (maxOrdem?.maxOrdem ?? -1) + 1;
  const result = await env.DB.prepare(
    `INSERT INTO fotos (veiculo_id, r2_key, ordem) VALUES (?, ?, ?)`,
  )
    .bind(input.veiculoId, input.r2Key, ordem)
    .run();

  const foto = await getFotoById(env, Number(result.meta.last_row_id));
  if (!foto) throw new Error("failed to insert foto");
  return foto;
}

export async function deleteFoto(env: Env, fotoId: number): Promise<FotoRow | null> {
  const foto = await getFotoById(env, fotoId);
  if (!foto) return null;
  await env.DB.prepare(`DELETE FROM fotos WHERE id = ?`).bind(fotoId).run();
  return foto;
}
