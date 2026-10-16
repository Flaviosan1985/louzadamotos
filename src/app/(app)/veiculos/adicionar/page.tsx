import { VeiculoForm } from "@/components/veiculos/VeiculoForm";

export default function Page() {
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Adicionar veículo</h1>
      <VeiculoForm />
    </div>
  );
}
