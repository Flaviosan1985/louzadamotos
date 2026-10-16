import type { Cliente } from "@/lib/types/database";

export function filterClientes(clientes: Cliente[], busca: string) {
  const term = busca.trim().toLowerCase();
  if (!term) return clientes;
  return clientes.filter(
    (item) =>
      item.nome.toLowerCase().includes(term) ||
      (item.documento ?? "").toLowerCase().includes(term),
  );
}
