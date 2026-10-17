import { requireAdminApi } from "@/lib/louzada/auth";
import {
  createVehicle,
  listVehicles,
} from "@/lib/louzada/vehicles-repository";
import type { VehicleListFilters, VehicleType } from "@/lib/louzada/types";

function parseFilters(searchParams: URLSearchParams): VehicleListFilters {
  const type = searchParams.get("type");
  const min = searchParams.get("minPrice");
  const max = searchParams.get("maxPrice");
  return {
    type: type === "moto" || type === "auto" ? type : "",
    brand: searchParams.get("brand") ?? "",
    q: searchParams.get("q") ?? "",
    minPrice: min ? Number(min) : undefined,
    maxPrice: max ? Number(max) : undefined,
    hideSold: searchParams.get("hideSold") === "1",
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const vehicles = listVehicles(parseFilters(searchParams));
  return Response.json(vehicles);
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "JSON inválido" }, { status: 400 });
  }

  const type = body.type === "auto" ? "auto" : body.type === "moto" ? "moto" : null;
  if (!type) {
    return Response.json({ error: "Tipo inválido" }, { status: 400 });
  }

  const brand = String(body.brand ?? "").trim();
  const model = String(body.model ?? "").trim();
  const year = Number(body.year);
  const price = Number(body.price);

  if (!brand || !model || !Number.isFinite(year) || !Number.isFinite(price)) {
    return Response.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
  }

  const vehicle = createVehicle({
    type: type as VehicleType,
    brand,
    model,
    year,
    km: Number(body.km) || 0,
    color: String(body.color ?? "").trim(),
    price,
    description: String(body.description ?? "").trim(),
    featured: Boolean(body.featured),
    displacement:
      body.displacement != null && body.displacement !== ""
        ? Number(body.displacement)
        : null,
  });

  return Response.json(vehicle, { status: 201 });
}
