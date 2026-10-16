import type { ModuleRow } from "@/lib/types/modulos";

export function filterRows(rows: ModuleRow[], busca: string) {
  const term = busca.trim().toLowerCase();
  if (!term) return rows;
  return rows.filter((row) =>
    Object.values(row).some((value) => String(value).toLowerCase().includes(term)),
  );
}
