import type { VehicleListFilters, VehicleWithPhotos } from "@/lib/louzada/types";
import type { Veiculo } from "@/lib/types/database";

export function publicPhotoSrc(filename: string) {
  if (
    filename.startsWith("/") ||
    filename.startsWith("http://") ||
    filename.startsWith("https://") ||
    filename.startsWith("data:")
  ) {
    return filename;
  }
  return `/api/uploads/${encodeURIComponent(filename)}`;
}

export function veiculoToPublic(veiculo: Veiculo): VehicleWithPhotos {
  const photos = (veiculo.fotos ?? []).map((filename, position) => ({
    id: position + 1,
    vehicle_id: veiculo.id,
    filename,
    position,
  }));
  const cover = photos[0];

  return {
    id: veiculo.id,
    type: veiculo.tipo === "moto" ? "moto" : "auto",
    brand: veiculo.marca,
    model: veiculo.modelo,
    year: veiculo.ano_modelo,
    km: veiculo.km,
    color: veiculo.cor ?? "",
    price: veiculo.preco_venda,
    description: veiculo.observacoes ?? "",
    status: veiculo.status === "vendido" ? "vendido" : "disponivel",
    featured: 0,
    created_at: veiculo.criado_em,
    photos,
    coverUrl: cover ? publicPhotoSrc(cover.filename) : null,
  };
}

export function listPublicFromDashboard(
  veiculos: Veiculo[],
  filters: VehicleListFilters = {},
): VehicleWithPhotos[] {
  return veiculos
    .filter((veiculo) => veiculo.status !== "reservado")
    .map(veiculoToPublic)
    .filter((vehicle) => {
      if (filters.type && vehicle.type !== filters.type) return false;
      if (filters.hideSold && vehicle.status === "vendido") return false;
      if (filters.brand && vehicle.brand.toLowerCase() !== filters.brand.toLowerCase()) {
        return false;
      }
      if (filters.q?.trim()) {
        const query = filters.q.trim().toLowerCase();
        const haystack = `${vehicle.brand} ${vehicle.model} ${vehicle.description}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      if (filters.minPrice != null && !Number.isNaN(filters.minPrice) && vehicle.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice != null && !Number.isNaN(filters.maxPrice) && vehicle.price > filters.maxPrice) {
        return false;
      }
      return true;
    });
}
