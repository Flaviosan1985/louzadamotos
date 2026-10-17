"use client";

import { useMemo } from "react";
import { PanelLink } from "@/components/layout/panel/PanelLink";
import { useAppSnapshot } from "@/hooks/use-app-snapshot";
import { QueryState } from "@/components/shared/QueryState";
import { EmptyState } from "@/components/shared/EmptyState";
import { ModuleHeader } from "@/components/shared/ModuleHeader";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function CadastroPendentePage() {
  const { data, error, loading, refetch } = useAppSnapshot();
  const pending = useMemo(
    () =>
      (data?.veiculos ?? []).filter(
        (item) => item.status !== "vendido" && (!item.placa || !item.renavam || item.fotos.length === 0),
      ),
    [data],
  );

  return (
    <QueryState
      loading={loading && !data}
      error={error}
      empty={Boolean(data) && pending.length === 0}
      onRetry={refetch}
    >
      <QueryState.Loading />
      <QueryState.Error />
      <QueryState.Ready>
        <div className="space-y-5">
          <ModuleHeader
            title="Cadastro pendente"
            count={`${pending.length} veículo(s) incompleto(s)`}
          />
          <p className="text-muted-foreground -mt-3 text-sm">
            Falta placa, Renavam ou foto para o veículo ir para a vitrine completa.
          </p>
          <QueryState.Empty>
            <EmptyState
              title="Nenhum cadastro pendente"
              description="Todos os veículos ativos têm placa, Renavam e ao menos uma foto."
            />
          </QueryState.Empty>
          <QueryState.Success>
            <div className="bg-card rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Veículo</TableHead>
                    <TableHead>Placa</TableHead>
                    <TableHead>Renavam</TableHead>
                    <TableHead>Fotos</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pending.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.marca} {item.modelo}
                      </TableCell>
                      <TableCell>{item.placa ?? "Falta"}</TableCell>
                      <TableCell>{item.renavam ?? "Falta"}</TableCell>
                      <TableCell>{item.fotos.length}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" nativeButton={false} render={<PanelLink href={`/veiculos/${item.id}`} />}>
                          Completar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </QueryState.Success>
        </div>
      </QueryState.Ready>
    </QueryState>
  );
}
