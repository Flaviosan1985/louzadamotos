import type { VehicleListFilters, VehicleType } from "@/lib/louzada/types";

export function parseFiltersFromSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
  defaultType?: VehicleType,
): VehicleListFilters {
  const get = (key: string) => {
    const value = searchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const typeParam = get("type");
  const type =
    typeParam === "moto" || typeParam === "auto"
      ? typeParam
      : defaultType ?? "";

  return {
    type,
    brand: get("brand") ?? "",
    q: get("q") ?? "",
    minPrice: get("minPrice") ? Number(get("minPrice")) : undefined,
    maxPrice: get("maxPrice") ? Number(get("maxPrice")) : undefined,
    hideSold: get("hideSold") === "1",
  };
}
