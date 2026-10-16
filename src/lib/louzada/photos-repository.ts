import fs from "node:fs";
import path from "node:path";
import { getDb } from "@/lib/louzada/db";
import { getUploadDir } from "@/lib/louzada/uploads";
import type { Photo } from "@/lib/louzada/types";

export function addPhoto(vehicleId: number, filename: string) {
  const database = getDb();
  const maxPos = database
    .prepare("SELECT COALESCE(MAX(position), -1) AS maxPos FROM photos WHERE vehicle_id = ?")
    .get(vehicleId) as { maxPos: number };
  const position = maxPos.maxPos + 1;
  const result = database
    .prepare(
      "INSERT INTO photos (vehicle_id, filename, position) VALUES (?, ?, ?)",
    )
    .run(vehicleId, filename, position);
  return database
    .prepare("SELECT id, vehicle_id, filename, position FROM photos WHERE id = ?")
    .get(result.lastInsertRowid) as Photo;
}

export function deletePhoto(id: number) {
  const database = getDb();
  const photo = database
    .prepare("SELECT id, vehicle_id, filename, position FROM photos WHERE id = ?")
    .get(id) as Photo | undefined;
  if (!photo) return false;

  database.prepare("DELETE FROM photos WHERE id = ?").run(id);
  const filePath = path.join(getUploadDir(), photo.filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  const remaining = database
    .prepare(
      "SELECT id FROM photos WHERE vehicle_id = ? ORDER BY position ASC, id ASC",
    )
    .all(photo.vehicle_id) as { id: number }[];
  const update = database.prepare("UPDATE photos SET position = ? WHERE id = ?");
  remaining.forEach((row, index) => update.run(index, row.id));

  return true;
}

export function setCoverPhoto(photoId: number) {
  const database = getDb();
  const photo = database
    .prepare("SELECT id, vehicle_id, filename, position FROM photos WHERE id = ?")
    .get(photoId) as Photo | undefined;
  if (!photo) return null;

  const photos = database
    .prepare(
      "SELECT id, vehicle_id, filename, position FROM photos WHERE vehicle_id = ? ORDER BY position ASC, id ASC",
    )
    .all(photo.vehicle_id) as Photo[];

  const ordered = [photo, ...photos.filter((p) => p.id !== photo.id)];
  const update = database.prepare("UPDATE photos SET position = ? WHERE id = ?");
  ordered.forEach((p, index) => update.run(index, p.id));

  return ordered;
}

export function reorderPhotos(vehicleId: number, photoIds: number[]) {
  const database = getDb();
  const update = database.prepare("UPDATE photos SET position = ? WHERE id = ? AND vehicle_id = ?");
  photoIds.forEach((id, index) => update.run(index, id, vehicleId));
}
