import { revalidateTag } from "next/cache";
import { persistVitrineSnapshot } from "@/lib/catalog/vitrine-persist";
import { VITRINE_CACHE_TAG } from "@/lib/catalog/vitrine-keys";
import { canManageLouzadaCatalog } from "@/lib/louzada/panel-access";

export const runtime = "edge";

export async function POST(request: Request) {
  if (!(await canManageLouzadaCatalog())) {
    return Response.json({ error: "Não autorizado" }, { status: 401 });
  }

  let body: { veiculos?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "JSON inválido" }, { status: 400 });
  }

  try {
    const result = await persistVitrineSnapshot(body.veiculos);
    revalidateTag(VITRINE_CACHE_TAG, "max");
    return Response.json({ ok: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao publicar vitrine";
    const status = message.includes("inválid") ? 400 : 500;
    return Response.json({ error: message }, { status });
  }
}
