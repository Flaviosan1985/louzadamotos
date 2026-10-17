import Link from "next/link";
import { VehicleDetailView } from "@/components/louzada/VehicleDetailView";
import { getVitrineVehicleById } from "@/lib/catalog/vitrine.server";

export const revalidate = 3600;

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const vehicle = await getVitrineVehicleById(id);
  if (!vehicle) return { title: "Veículo | Louzada Motos" };
  return { title: `${vehicle.brand} ${vehicle.model} | Louzada Motos` };
}

export default async function VeiculoPage({ params }: PageProps) {
  const { id } = await params;
  const vehicle = await getVitrineVehicleById(id);

  if (!vehicle) {
    return (
      <div className="px-4 py-16 text-center text-zinc-300">
        <p>Este veículo não está na vitrine.</p>
        <Link href="/#estoque" className="mt-4 inline-block text-sm text-[#c41e3a]">
          Voltar ao estoque
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/40">
      <VehicleDetailView vehicle={vehicle} />
    </div>
  );
}
