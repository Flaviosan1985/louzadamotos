import type { VehicleWithPhotos } from "@/lib/louzada/types";
import { VehicleCard } from "@/components/louzada/VehicleCard";

type VehicleGridProps = {
  vehicles: VehicleWithPhotos[];
  emptyMessage?: string;
};

export function VehicleGrid({ vehicles, emptyMessage }: VehicleGridProps) {
  if (!vehicles.length) {
    return (
      <p className="py-8 text-center text-sm text-zinc-500">
        {emptyMessage ?? "Nenhum veículo encontrado com os filtros atuais."}
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  );
}
