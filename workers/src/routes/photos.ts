import { deletePhoto, getPhotoById, insertPhoto, listPhotosByVehicle } from "../db/photos";
import { getVehicle } from "../db/vehicles";
import { requireAuth } from "../middleware/require-auth";
import { photoObjectKey } from "../r2/keys";
import { presignGetUrl } from "../r2/presign";
import { getObjectResponse } from "../r2/proxy";
import type { Env } from "../types/env";
import { badRequest, forbidden, json, notFound } from "../utils/http";

/** Admin: lista metadados das fotos de um veículo (sem expor hash de senha — só fotos). */
export async function handleListVehiclePhotos(request: Request, env: Env, vehicleId: number) {
  const auth = await requireAuth(request, env);
  if (auth instanceof Response) return auth;

  const vehicle = await getVehicle(env, vehicleId);
  if (!vehicle) return notFound("Veículo não encontrado");

  const photos = await listPhotosByVehicle(env, vehicleId);
  return json({
    photos: photos.map((p) => ({
      id: p.id,
      vehicle_id: p.vehicle_id,
      position: p.position,
      caption: p.caption,
      created_at: p.created_at,
    })),
  });
}

export async function handleUploadVehiclePhoto(request: Request, env: Env, vehicleId: number) {
  const auth = await requireAuth(request, env);
  if (auth instanceof Response) return auth;

  const vehicle = await getVehicle(env, vehicleId);
  if (!vehicle) return notFound("Veículo não encontrado");

  const form = await request.formData();
  const file = form.get("file");
  const caption = form.get("caption");
  if (!(file instanceof File)) {
    return badRequest("Campo file é obrigatório");
  }

  const ext = file.name.includes(".") ? file.name.split(".").pop() ?? "jpg" : "jpg";
  const opaqueId = crypto.randomUUID().replace(/-/g, "");
  const key = photoObjectKey(auth.userId, vehicleId, opaqueId, ext);

  await env.PHOTOS_BUCKET.put(key, file.stream(), {
    httpMetadata: { contentType: file.type || "image/jpeg" },
    customMetadata: { userId: auth.userId, vehicleId: String(vehicleId) },
  });

  const photo = await insertPhoto(env, {
    vehicleId,
    r2ObjectKey: key,
    caption: typeof caption === "string" ? caption : null,
  });

  return json(
    {
      id: photo.id,
      vehicle_id: photo.vehicle_id,
      position: photo.position,
      caption: photo.caption,
    },
    { status: 201 },
  );
}

/** Dono autenticado: URL assinada curta para download privado. */
export async function handlePresignedPhotoUrl(request: Request, env: Env, photoId: number) {
  const auth = await requireAuth(request, env);
  if (auth instanceof Response) return auth;

  const photo = await getPhotoById(env, photoId);
  if (!photo) return notFound();

  const metaUserId = await env.PHOTOS_BUCKET.head(photo.r2_object_key);
  const ownerId = metaUserId?.customMetadata?.userId;
  if (ownerId && ownerId !== auth.userId) {
    return forbidden();
  }

  const url = await presignGetUrl(env, photo.r2_object_key, 300);
  return json({ url, expiresIn: 300 });
}

export async function handleDeletePhoto(request: Request, env: Env, photoId: number) {
  const auth = await requireAuth(request, env);
  if (auth instanceof Response) return auth;

  const photo = await getPhotoById(env, photoId);
  if (!photo) return notFound();

  const head = await env.PHOTOS_BUCKET.head(photo.r2_object_key);
  const ownerId = head?.customMetadata?.userId;
  if (ownerId && ownerId !== auth.userId) {
    return forbidden();
  }

  await env.PHOTOS_BUCKET.delete(photo.r2_object_key);
  await deletePhoto(env, photoId);
  return json({ ok: true });
}

/**
 * Vitrine pública: só fotos de veículos disponíveis (substitui /api/uploads público).
 * RLS equivalente: status do veículo + leitura sem auth.
 */
export async function handlePublicPhotoProxy(_request: Request, env: Env, photoId: number) {
  const photo = await getPhotoById(env, photoId);
  if (!photo) return notFound();

  const vehicle = await getVehicle(env, photo.vehicle_id);
  if (!vehicle || vehicle.status !== "disponivel") {
    return notFound();
  }

  const response = await getObjectResponse(env, photo.r2_object_key, "force-cache");
  if (!response) return notFound();
  return response;
}
