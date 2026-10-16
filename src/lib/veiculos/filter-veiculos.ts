import type { VeiculoFiltros } from "@/components/veiculos/types";
import type { StatusVeiculo, Veiculo } from "@/lib/types/database";

export function filterVeiculos(
  veiculos: Veiculo[],
  filters: VeiculoFiltros,
  lockedStatus?: StatusVeiculo,
) {
  const term = filters.busca.trim().toLowerCase();

  return veiculos.filter((item) => {
    if (lockedStatus && item.status !== lockedStatus) return false;
    if (!lockedStatus && filters.status !== "todos" && item.status !== filters.status) {
      return false;
    }
    if (filters.marca && item.marca !== filters.marca) return false;
    if (filters.tipo !== "todos" && item.tipo !== filters.tipo) return false;
    if (!term) return true;
    return (
      item.modelo.toLowerCase().includes(term) ||
      item.marca.toLowerCase().includes(term) ||
      (item.placa ?? "").toLowerCase().includes(term)
    );
  });
}

export function uniqueMarcas(veiculos: Veiculo[]) {
  return Array.from(new Set(veiculos.map((item) => item.marca))).sort();
}
