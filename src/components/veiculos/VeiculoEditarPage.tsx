"use client";

import { VeiculoForm } from "@/components/veiculos/VeiculoForm";
import { VeiculoNegocioPainel } from "@/components/veiculos/VeiculoNegocioPainel";

export function VeiculoEditarPage({ veiculoId }: { veiculoId: string }) {
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Editar veículo</h1>
      <VeiculoNegocioPainel veiculoId={veiculoId} />
      <VeiculoForm veiculoId={veiculoId} />
    </div>
  );
}
