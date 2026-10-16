import fs from "node:fs";
import path from "node:path";
import { requireAdminApi } from "@/lib/louzada/auth";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_UPLOAD_BYTES,
} from "@/lib/louzada/constants";
import { addPhoto } from "@/lib/louzada/photos-repository";
import { getVehicleById } from "@/lib/louzada/vehicles-repository";
import { getUploadDir, safeUploadFilename } from "@/lib/louzada/uploads";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const { id: idParam } = await context.params;
  const vehicleId = Number(idParam);
  if (!Number.isFinite(vehicleId)) {
    return Response.json({ error: "ID inválido" }, { status: 400 });
  }

  const vehicle = getVehicleById(vehicleId);
  if (!vehicle) {
    return Response.json({ error: "Veículo não encontrado" }, { status: 404 });
  }

  const formData = await request.formData();
  const files = formData.getAll("files").filter((f): f is File => f instanceof File);
  if (!files.length) {
    return Response.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
  }

  const uploadDir = getUploadDir();
  const saved = [];

  for (const file of files) {
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return Response.json({ error: `Tipo não permitido: ${file.type}` }, { status: 400 });
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      return Response.json({ error: "Arquivo excede 5 MB" }, { status: 400 });
    }

    const filename = safeUploadFilename(file.name);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(path.join(uploadDir, filename), buffer);
    saved.push(addPhoto(vehicleId, filename));
  }

  return Response.json({ photos: saved }, { status: 201 });
}
