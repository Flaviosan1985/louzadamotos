import { requireAdminApi } from "@/lib/louzada/auth";
import { createLead, listLeads } from "@/lib/louzada/leads-repository";
import { getVehicleById } from "@/lib/louzada/vehicles-repository";

export async function GET(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const vehicleId = Number(new URL(request.url).searchParams.get("vehicleId"));
  const leads = listLeads(Number.isFinite(vehicleId) ? vehicleId : undefined);
  return Response.json(leads);
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "JSON inválido" }, { status: 400 });
  }

  const vehicleId = Number(body.vehicleId);
  const phone = String(body.phone ?? "").replace(/\D/g, "");
  const customerName = String(body.customerName ?? body.name ?? "").trim();
  const message = String(body.message ?? body.proposal ?? "").trim();

  if (!Number.isFinite(vehicleId) || !phone || phone.length < 10) {
    return Response.json({ error: "Veículo e telefone válidos são obrigatórios" }, { status: 400 });
  }

  const vehicle = getVehicleById(vehicleId);
  if (!vehicle || vehicle.status === "vendido") {
    return Response.json({ error: "Veículo não disponível" }, { status: 404 });
  }

  const lead = createLead({
    vehicleId,
    customerName: customerName || "Cliente",
    phone,
    message,
  });

  return Response.json(lead, { status: 201 });
}
