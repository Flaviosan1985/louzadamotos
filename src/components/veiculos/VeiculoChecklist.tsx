"use client";

import { DOCUMENTOS_VEICULO, progressoChecklist } from "@/lib/negocio/checklist";
import type { ModuleRow } from "@/lib/types/modulos";

export function VeiculoChecklist({
  registro,
  onToggle,
}: {
  registro: ModuleRow | undefined;
  onToggle: (chave: string, marcado: boolean) => void;
}) {
  const { feitos, total } = progressoChecklist(registro);

  return (
    <section aria-labelledby="checklist-titulo" className="bg-card space-y-3 rounded-xl border p-5">
      <header className="flex items-center justify-between gap-2">
        <h2 id="checklist-titulo" className="font-semibold">
          Documentos do veículo
        </h2>
        <span className="text-muted-foreground text-xs tabular-nums">
          {feitos}/{total}
        </span>
      </header>
      <div
        className="bg-muted h-1.5 overflow-hidden rounded-full"
        role="progressbar"
        aria-label="Documentos entregues"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={feitos}
      >
        <div className="bg-primary h-full transition-[width]" style={{ width: `${(feitos / total) * 100}%` }} />
      </div>
      <ul className="space-y-1.5">
        {DOCUMENTOS_VEICULO.map((doc) => (
          <li key={doc.chave}>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="accent-primary size-4"
                checked={registro?.[doc.chave] === "sim"}
                onChange={(event) => onToggle(doc.chave, event.target.checked)}
              />
              {doc.label}
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}
