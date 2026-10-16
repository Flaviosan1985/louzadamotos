import { VeiculoForm } from "@/components/veiculos/VeiculoForm";
import { VeiculoNegocioPainel } from "@/components/veiculos/VeiculoNegocioPainel";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Editar veículo</h1>
      <VeiculoNegocioPainel veiculoId={id} />
      <VeiculoForm veiculoId={id} />
    </div>
  );
}
