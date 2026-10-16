import { DashboardVehicleDetail } from "@/components/louzada/DashboardVehicleDetail";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return { title: `Veículo ${id} | Louzada Motos` };
}

export default async function VeiculoPage({ params }: PageProps) {
  const { id } = await params;
  return <DashboardVehicleDetail id={id} />;
}
