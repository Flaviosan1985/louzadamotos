import { serializeFoto } from "../api/serializers";
import { deleteFoto, getFotoById, insertFoto, listFotosByVeiculo } from "../db/fotos";
import { STATUS_DISPONIVEL, getVeiculo } from "../db/veiculos";
import { requireAuth } from "../middleware/require-auth";
import { photoObjectKey } from "../r2/keys";
import { presignGetUrl } from "../r2/presign";
import { getObjectResponse } from "../r2/proxy";
import type { Env } from "../types/env";
import { badRequest, forbidden, json, notFound } from "../utils/http";

export async function handleListVehiclePhotos(request: Request, env: Env, veiculoId: number) {
  const auth = await requireAuth(request, env);
  if (auth instanceof Response) return auth;

  const veiculo = await getVeiculo(env, veiculoId);
  if (!veiculo) return notFound("Veículo não encontrado");

  const fotos = await listFotosByVeiculo(env, veiculoId);
  const photos = fotos.map(serializeFoto);
  return json({ fotos: photos, photos });
}

export async function handleUploadVehiclePhoto(request: Request, env: Env, veiculoId: number) {
  const auth = await requireAuth(request, env);
  if (auth instanceof Response) return auth;

  const veiculo = await getVeiculo(env, veiculoId);
  if (!veiculo) return notFound("Veículo não encontrado");

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return badRequest("Campo file é obrigatório");
  }

  const ext = file.name.includes(".") ? file.name.split(".").pop() ?? "jpg" : "jpg";
  const opaqueId = crypto.randomUUID().replace(/-/g, "");
  const key = photoObjectKey(auth.userId, veiculoId, opaqueId, ext);

  await env.PHOTOS_BUCKET.put(key, file.stream(), {
    httpMetadata: { contentType: file.type || "image/jpeg" },
    customMetadata: { userId: auth.userId, veiculoId: String(veiculoId) },
  });

  const foto = await insertFoto(env, { veiculoId, r2Key: key });
  return json(serializeFoto(foto), { status: 201 });
}

export async function handlePresignedPhotoUrl(request: Request, env: Env, fotoId: number) {
  const auth = await requireAuth(request, env);
  if (auth instanceof Response) return auth;

  const foto = await getFotoById(env, fotoId);
  if (!foto) return notFound();

  const head = await env.PHOTOS_BUCKET.head(foto.r2_key);
  const ownerId = head?.customMetadata?.userId;
  if (ownerId && ownerId !== auth.userId) {
    return forbidden();
  }

  const url = await presignGetUrl(env, foto.r2_key, 300);
  return json({ url, expiresIn: 300 });
}

export async function handleDeletePhoto(request: Request, env: Env, fotoId: number) {
  const auth = await requireAuth(request, env);
  if (auth instanceof Response) return auth;

  const foto = await getFotoById(env, fotoId);
  if (!foto) return notFound();

  const head = await env.PHOTOS_BUCKET.head(foto.r2_key);
  const ownerId = head?.customMetadata?.userId;
  if (ownerId && ownerId !== auth.userId) {
    return forbidden();
  }

  await env.PHOTOS_BUCKET.delete(foto.r2_key);
  await deleteFoto(env, fotoId);
  return json({ ok: true });
}

export async function handlePublicPhotoProxy(_request: Request, env: Env, fotoId: number) {
  const foto = await getFotoById(env, fotoId);
  if (!foto) return notFound();

  const veiculo = await getVeiculo(env, foto.veiculo_id);
  if (!veiculo || veiculo.status !== STATUS_DISPONIVEL) {
    return notFound();
  }

  const response = await getObjectResponse(env, foto.r2_key, "force-cache");
  if (!response) return notFound();
  return response;
}
