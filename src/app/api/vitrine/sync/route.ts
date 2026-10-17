import { writeVitrineSnapshotFile } from "@/lib/catalog/vitrine.server";
import { canManageLouzadaCatalog } from "@/lib/louzada/panel-access";
import type { Veiculo } from "@/lib/types/database";

export async function POST(request: Request) {
  if (!(await canManageLouzadaCatalog())) {
    return Response.json({ error: "Não autorizado" }, { status: 401 });
  }

  let body: { veiculos?: Veiculo[] };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (!Array.isArray(body.veiculos)) {
    return Response.json({ error: "Lista de veículos inválida" }, { status: 400 });
  }

  writeVitrineSnapshotFile(body.veiculos);
  return Response.json({ ok: true, count: body.veiculos.length });
}
