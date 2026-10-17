import type { Env } from "../types/env";

export type PhotoRow = {
  id: number;
  vehicle_id: number;
  r2_object_key: string;
  position: number;
  caption: string | null;
  created_at: string;
};

export async function listPhotosByVehicle(env: Env, vehicleId: number): Promise<PhotoRow[]> {
  const { results } = await env.DB.prepare(
    `SELECT id, vehicle_id, r2_object_key, position, caption, created_at
     FROM photos WHERE vehicle_id = ? ORDER BY position ASC, id ASC`,
  )
    .bind(vehicleId)
    .all<PhotoRow>();
  return results ?? [];
}

export async function getPhotoById(env: Env, photoId: number): Promise<PhotoRow | null> {
  return env.DB.prepare(
    `SELECT id, vehicle_id, r2_object_key, position, caption, created_at FROM photos WHERE id = ?`,
  )
    .bind(photoId)
    .first<PhotoRow>();
}

export async function insertPhoto(
  env: Env,
  input: { vehicleId: number; r2ObjectKey: string; caption?: string | null },
): Promise<PhotoRow> {
  const maxPos = await env.DB.prepare(
    `SELECT COALESCE(MAX(position), -1) AS maxPos FROM photos WHERE vehicle_id = ?`,
  )
    .bind(input.vehicleId)
    .first<{ maxPos: number }>();

  const position = (maxPos?.maxPos ?? -1) + 1;
  const result = await env.DB.prepare(
    `INSERT INTO photos (vehicle_id, r2_object_key, position, caption)
     VALUES (?, ?, ?, ?)`,
  )
    .bind(input.vehicleId, input.r2ObjectKey, position, input.caption ?? null)
    .run();

  const photo = await getPhotoById(env, Number(result.meta.last_row_id));
  if (!photo) throw new Error("failed to insert photo");
  return photo;
}

export async function deletePhoto(env: Env, photoId: number): Promise<PhotoRow | null> {
  const photo = await getPhotoById(env, photoId);
  if (!photo) return null;
  await env.DB.prepare(`DELETE FROM photos WHERE id = ?`).bind(photoId).run();
  return photo;
}
