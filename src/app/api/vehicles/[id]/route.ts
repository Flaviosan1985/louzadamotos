import { requireAdminApi } from "@/lib/louzada/auth";
import {
  deleteVehicle,
  getVehicleById,
  updateVehicle,
} from "@/lib/louzada/vehicles-repository";
import type { VehicleStatus, VehicleType } from "@/lib/louzada/types";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id: idParam } = await context.params;
  const id = Number(idParam);
  if (!Number.isFinite(id)) {
    return Response.json({ error: "ID inválido" }, { status: 400 });
  }

  const vehicle = getVehicleById(id);
  if (!vehicle) {
    return Response.json({ error: "Veículo não encontrado" }, { status: 404 });
  }
  return Response.json(vehicle);
}

export async function PUT(request: Request, context: RouteContext) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const { id: idParam } = await context.params;
  const id = Number(idParam);
  if (!Number.isFinite(id)) {
    return Response.json({ error: "ID inválido" }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "JSON inválido" }, { status: 400 });
  }

  const patch: Parameters<typeof updateVehicle>[1] = {};

  if (body.type === "moto" || body.type === "auto") patch.type = body.type as VehicleType;
  if (body.brand != null) patch.brand = String(body.brand).trim();
  if (body.model != null) patch.model = String(body.model).trim();
  if (body.year != null) patch.year = Number(body.year);
  if (body.km != null) patch.km = Number(body.km);
  if (body.color != null) patch.color = String(body.color).trim();
  if (body.price != null) patch.price = Number(body.price);
  if (body.description != null) patch.description = String(body.description).trim();
  if (body.status === "disponivel" || body.status === "vendido") {
    patch.status = body.status as VehicleStatus;
  }
  if (body.featured != null) patch.featured = Boolean(body.featured);

  const vehicle = updateVehicle(id, patch);
  if (!vehicle) {
    return Response.json({ error: "Veículo não encontrado" }, { status: 404 });
  }
  return Response.json(vehicle);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const { id: idParam } = await context.params;
  const id = Number(idParam);
  if (!Number.isFinite(id)) {
    return Response.json({ error: "ID inválido" }, { status: 400 });
  }

  const ok = deleteVehicle(id);
  if (!ok) {
    return Response.json({ error: "Veículo não encontrado" }, { status: 404 });
  }
  return Response.json({ ok: true });
}
