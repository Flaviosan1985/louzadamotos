"use client";

import { VeiculoForm } from "@/components/veiculos/VeiculoForm";
import { VeiculoInteressados } from "@/components/veiculos/VeiculoInteressados";
import { VeiculoNegocioPainel } from "@/components/veiculos/VeiculoNegocioPainel";

export function VeiculoEditarPage({ veiculoId }: { veiculoId: string }) {
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Editar veículo</h1>
      <VeiculoInteressados veiculoId={veiculoId} />
      <VeiculoNegocioPainel veiculoId={veiculoId} />
      <VeiculoForm veiculoId={veiculoId} />
    </div>
  );
}
