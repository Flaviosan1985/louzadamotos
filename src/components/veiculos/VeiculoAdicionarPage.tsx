"use client";

import { VeiculoForm } from "@/components/veiculos/VeiculoForm";

export function VeiculoAdicionarPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Adicionar veículo</h1>
        <p className="text-muted-foreground text-sm">
          Foto, marca, modelo, cilindrada, cor, preço e descrição entram na vitrine quando o status for Disponível.
        </p>
      </div>
      <VeiculoForm />
    </div>
  );
}
