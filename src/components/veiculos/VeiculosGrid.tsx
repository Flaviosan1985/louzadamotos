"use client";

import { PanelLink } from "@/components/layout/panel/PanelLink";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { publicPhotoSrc } from "@/lib/catalog/from-dashboard";
import { formatCurrency } from "@/lib/format";
import type { StatusVeiculo, Veiculo } from "@/lib/types/database";

const statusLabel: Record<StatusVeiculo, string> = {
  disponivel: "Disponível",
  reservado: "Reservado",
  vendido: "Vendido",
};

export function VeiculosGrid({
  veiculos,
  onDelete,
}: {
  veiculos: Veiculo[];
  onDelete?: (id: string) => void;
}) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {veiculos.map((veiculo) => {
        const cover = veiculo.fotos[0];
        return (
          <li key={veiculo.id} className="bg-card overflow-hidden rounded-xl border">
            <div className="bg-muted relative aspect-[4/3]">
              {cover ? (
                <img
                  src={publicPhotoSrc(cover)}
                  alt={`${veiculo.marca} ${veiculo.modelo}`}
                  className="size-full object-cover"
                />
              ) : (
                <div className="text-muted-foreground flex size-full items-center justify-center text-sm">
                  Sem foto
                </div>
              )}
            </div>
            <div className="space-y-2 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">
                    {veiculo.marca} {veiculo.modelo}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {veiculo.ano_modelo}
                    {veiculo.cilindrada ? ` · ${veiculo.cilindrada} cc` : ""}
                    {veiculo.cor ? ` · ${veiculo.cor}` : ""}
                  </p>
                </div>
                <Badge variant={veiculo.status === "disponivel" ? "default" : "secondary"}>
                  {statusLabel[veiculo.status]}
                </Badge>
              </div>
              <p className="text-sm font-semibold">{formatCurrency(veiculo.preco_venda)}</p>
              <div className="flex justify-end gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  nativeButton={false}
                  render={<PanelLink href={`/veiculos/${veiculo.id}`} />}
                >
                  Editar
                </Button>
                {onDelete ? (
                  <Button variant="ghost" size="sm" onClick={() => onDelete(veiculo.id)}>
                    Excluir
                  </Button>
                ) : null}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
