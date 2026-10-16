import { requireAdminApi } from "@/lib/louzada/auth";
import {
  deletePhoto,
  setCoverPhoto,
  reorderPhotos,
} from "@/lib/louzada/photos-repository";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const { id: idParam } = await context.params;
  const id = Number(idParam);
  if (!Number.isFinite(id)) {
    return Response.json({ error: "ID inválido" }, { status: 400 });
  }

  let body: { action?: string; photoIds?: number[]; vehicleId?: number };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (body.action === "cover") {
    const photos = setCoverPhoto(id);
    if (!photos) {
      return Response.json({ error: "Foto não encontrada" }, { status: 404 });
    }
    return Response.json({ photos });
  }

  if (body.action === "reorder" && body.vehicleId && Array.isArray(body.photoIds)) {
    reorderPhotos(body.vehicleId, body.photoIds);
    return Response.json({ ok: true });
  }

  return Response.json({ error: "Ação inválida" }, { status: 400 });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const { id: idParam } = await context.params;
  const id = Number(idParam);
  if (!Number.isFinite(id)) {
    return Response.json({ error: "ID inválido" }, { status: 400 });
  }

  const ok = deletePhoto(id);
  if (!ok) {
    return Response.json({ error: "Foto não encontrada" }, { status: 404 });
  }
  return Response.json({ ok: true });
}
