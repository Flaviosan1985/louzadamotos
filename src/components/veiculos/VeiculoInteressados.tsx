"use client";

import { useAppSnapshot } from "@/hooks/use-app-snapshot";
import { formatDate } from "@/lib/format";

export function VeiculoInteressados({ veiculoId }: { veiculoId: string }) {
  const { data } = useAppSnapshot();
  const leads = (data?.extras.leads ?? []).filter(
    (row) => row.veiculo_site_id === veiculoId,
  );

  return (
    <section className="bg-card space-y-3 rounded-xl border p-5">
      <div>
        <h2 className="text-lg font-semibold">Clientes interessados</h2>
        <p className="text-muted-foreground text-sm">
          Quem pediu contato por esta moto no site.
        </p>
      </div>
      {leads.length === 0 ? (
        <p className="text-muted-foreground text-sm">Ninguém registrou interesse ainda.</p>
      ) : (
        <ul className="divide-y">
          {leads.map((lead) => (
            <li key={lead.id} className="py-3">
              <p className="font-medium">{lead.nome}</p>
              <p className="text-muted-foreground text-sm">{lead.telefone || "Sem telefone"}</p>
              {lead.proposta ? <p className="mt-1 text-sm">{lead.proposta}</p> : null}
              <p className="text-muted-foreground mt-1 text-xs">
                {lead.status} · {lead.origem}
                {lead.criado_em ? ` · ${formatDate(lead.criado_em)}` : ""}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
