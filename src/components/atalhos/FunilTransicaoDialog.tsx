"use client";

import { useState } from "react";
import type { Veiculo } from "@/lib/types/database";
import type { ModuleRow } from "@/lib/types/modulos";
import { formatPlaca, todayISO } from "@/lib/format";
import { validarTransicao } from "@/lib/negocio/funil";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormField } from "@/components/shared/FormField";

export const MOTIVOS_PERDA = [
  "Preço",
  "Crédito reprovado",
  "Comprou em outra loja",
  "Desistiu da compra",
  "Sem retorno",
  "Outro",
];

export type DestinoComDados = "Vendido" | "Perdido" | "Agendamento";

const TITULOS: Record<DestinoComDados, string> = {
  Vendido: "Fechar venda",
  Perdido: "Marcar como perdido",
  Agendamento: "Agendar visita",
};

const selectClass = "border-input h-9 w-full rounded-md border bg-transparent px-2.5 text-sm";

export function FunilTransicaoDialog({
  cartao,
  destino,
  veiculos,
  onCancel,
  onConfirm,
}: {
  cartao: ModuleRow;
  destino: DestinoComDados;
  veiculos: Veiculo[];
  onCancel: () => void;
  onConfirm: (patch: Record<string, string>) => Promise<void>;
}) {
  const comPlaca = veiculos.filter((v) => v.placa && v.status !== "vendido");
  const [veiculoId, setVeiculoId] = useState(
    () =>
      (
        comPlaca.find((v) => v.id === cartao.veiculo_id) ??
        comPlaca.find((v) => cartao.veiculo && `${v.marca} ${v.modelo}`.startsWith(cartao.veiculo)) ??
        comPlaca[0]
      )?.id ?? "",
  );
  const [dataEntrega, setDataEntrega] = useState(cartao.data_entrega || todayISO());
  const [motivo, setMotivo] = useState(cartao.motivo_perda || MOTIVOS_PERDA[0]);
  const [agendadoPara, setAgendadoPara] = useState((cartao.agendado_para ?? "").replace(" ", "T"));
  const [erro, setErro] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function confirmar(event: React.FormEvent) {
    event.preventDefault();
    const veiculo = comPlaca.find((v) => v.id === veiculoId);
    const patch: Record<string, string> =
      destino === "Vendido"
        ? {
            veiculo_id: veiculoId,
            veiculo: veiculo ? `${veiculo.marca} ${veiculo.modelo}` : "",
            data_entrega: dataEntrega,
          }
        : destino === "Perdido"
          ? { motivo_perda: motivo }
          : { agendado_para: agendadoPara.replace("T", " ") };
    const falha = validarTransicao({ ...cartao, ...patch }, destino, {
      placaDoVeiculo: veiculo?.placa ?? null,
    });
    setErro(falha);
    if (falha) return;
    setSaving(true);
    try {
      await onConfirm(patch);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <form className="grid gap-4" onSubmit={(event) => void confirmar(event)} noValidate>
          <DialogHeader>
            <DialogTitle>{TITULOS[destino]}</DialogTitle>
            <DialogDescription>{cartao.titulo}</DialogDescription>
          </DialogHeader>
          {destino === "Vendido" ? (
            <>
              <FormField htmlFor="funil-veiculo" label="Veículo vendido">
                <select
                  id="funil-veiculo"
                  className={selectClass}
                  value={veiculoId}
                  onChange={(event) => setVeiculoId(event.target.value)}
                >
                  {comPlaca.length === 0 ? <option value="">Nenhum veículo com placa no estoque</option> : null}
                  {comPlaca.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.marca} {v.modelo} · {formatPlaca(v.placa)}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField htmlFor="funil-entrega" label="Data de entrega">
                <Input
                  id="funil-entrega"
                  type="date"
                  value={dataEntrega}
                  onChange={(event) => setDataEntrega(event.target.value)}
                />
              </FormField>
            </>
          ) : destino === "Agendamento" ? (
            <FormField htmlFor="funil-agendado" label="Data e hora da visita">
              <Input
                id="funil-agendado"
                type="datetime-local"
                value={agendadoPara}
                onChange={(event) => setAgendadoPara(event.target.value)}
              />
            </FormField>
          ) : (
            <FormField htmlFor="funil-motivo" label="Motivo da perda">
              <select
                id="funil-motivo"
                className={selectClass}
                value={motivo}
                onChange={(event) => setMotivo(event.target.value)}
              >
                {MOTIVOS_PERDA.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </FormField>
          )}
          {erro ? (
            <p role="alert" className="text-destructive text-sm">
              {erro}
            </p>
          ) : null}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Salvando…" : "Confirmar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
