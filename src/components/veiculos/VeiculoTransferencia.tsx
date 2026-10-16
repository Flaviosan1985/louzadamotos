"use client";

import { AVISO_JURIDICO } from "@/lib/negocio/avisos";
import {
  STATUS_TRANSFERENCIA,
  normalizarStatusTransferencia,
  prazoTransferencia,
} from "@/lib/negocio/transferencia";
import { formatDate } from "@/lib/format";
import type { ModuleRow } from "@/lib/types/modulos";
import { cn } from "@/lib/utils";
import { FormField } from "@/components/shared/FormField";
import { AvisoLegal } from "@/components/shared/AvisoLegal";

const ROTULOS = { pendente: "Pendente", "em andamento": "Em andamento", concluida: "Concluída" } as const;

export function VeiculoTransferencia({
  vendidoEm,
  registro,
  onChange,
}: {
  vendidoEm: string;
  registro: ModuleRow | undefined;
  onChange: (patch: Record<string, string>) => void;
}) {
  const status = normalizarStatusTransferencia(registro?.status);
  const prazo = prazoTransferencia(vendidoEm, new Date());
  const concluida = status === "concluida";

  return (
    <section aria-labelledby="transferencia-titulo" className="bg-card space-y-3 rounded-xl border p-5">
      <h2 id="transferencia-titulo" className="font-semibold">
        Transferência de propriedade
      </h2>
      <p
        className={cn(
          "text-sm",
          !concluida && prazo.situacao === "alerta" && "font-medium text-amber-700 dark:text-amber-400",
          !concluida && prazo.situacao === "vencido" && "text-destructive font-medium",
        )}
      >
        {concluida
          ? "Transferência concluída."
          : prazo.situacao === "vencido"
            ? `Prazo vencido em ${formatDate(prazo.limite.toISOString())} (${-prazo.diasRestantes} dia(s) atrás).`
            : `Faltam ${prazo.diasRestantes} dia(s) — limite ${formatDate(prazo.limite.toISOString())}.`}
      </p>
      <p className="text-muted-foreground text-xs">
        Venda em {formatDate(vendidoEm)}. O comprador tem 30 dias para transferir.
      </p>
      <FormField htmlFor="transferencia-status" label="Status">
        <select
          id="transferencia-status"
          className="border-input h-9 w-full rounded-md border bg-transparent px-2.5 text-sm"
          value={status}
          onChange={(event) => onChange({ status: event.target.value })}
        >
          {STATUS_TRANSFERENCIA.map((s) => (
            <option key={s} value={s}>
              {ROTULOS[s]}
            </option>
          ))}
        </select>
      </FormField>
      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="accent-primary size-4"
          checked={registro?.comunicacao_venda === "sim"}
          onChange={(event) => onChange({ comunicacao_venda: event.target.checked ? "sim" : "nao" })}
        />
        Comunicação de venda feita ao Detran
      </label>
      {registro?.comunicacao_venda !== "sim" ? (
        <p className="text-muted-foreground text-xs">
          Lembrete: registre a comunicação de venda para tirar a responsabilidade do veículo da loja.
        </p>
      ) : null}
      <AvisoLegal texto={AVISO_JURIDICO} />
    </section>
  );
}
