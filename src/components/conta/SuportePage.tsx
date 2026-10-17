"use client";

import { PanelLink } from "@/components/layout/panel/PanelLink";
import { useAppSnapshot } from "@/hooks/use-app-snapshot";
import { Button } from "@/components/ui/button";
import { QueryState } from "@/components/shared/QueryState";

export function SuportePage() {
  const { data, error, loading, refetch } = useAppSnapshot();
  const telefone = data?.tenant.telefone;

  return (
    <QueryState loading={loading && !data} error={error} empty={false} onRetry={refetch}>
      <QueryState.Loading />
      <QueryState.Error />
      <QueryState.Ready>
        <div className="bg-card mx-auto max-w-xl space-y-4 rounded-xl border p-6">
          <div>
            <h1 className="text-2xl font-semibold">Suporte</h1>
            <p className="text-muted-foreground text-sm">Caminhos para resolver dúvidas da operação.</p>
          </div>
          <p className="text-sm leading-6">
            Comece pelo tutorial da casa. Se o problema for da loja, fale com o administrador usando o telefone
            cadastrado nas propriedades.
          </p>
          {telefone ? (
            <p className="text-sm">
              Contato da revenda: <span className="font-medium">{telefone}</span>
            </p>
          ) : (
            <p className="text-muted-foreground text-sm">Nenhum telefone cadastrado nas propriedades da loja.</p>
          )}
          <Button nativeButton={false} render={<PanelLink href="/configuracoes/tutorial" />}>
            Abrir tutorial
          </Button>
        </div>
      </QueryState.Ready>
    </QueryState>
  );
}
