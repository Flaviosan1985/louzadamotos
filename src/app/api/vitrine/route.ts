import { loadVitrineCatalog } from "@/lib/catalog/vitrine.server";
import { parseFiltersFromSearchParams } from "@/lib/louzada/parse-filters";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const record: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    record[key] = value;
  });
  const typeParam = record.type;
  const defaultType = typeParam === "moto" || typeParam === "auto" ? typeParam : undefined;
  const vehicles = await loadVitrineCatalog(parseFiltersFromSearchParams(record, defaultType));
  return Response.json(vehicles);
}
