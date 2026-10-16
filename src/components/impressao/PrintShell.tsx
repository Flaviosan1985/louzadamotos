"use client";

import type { ReactNode } from "react";
import { Printer } from "lucide-react";
import type { Tenant } from "@/lib/types/database";
import { formatDate, todayISO } from "@/lib/format";
import { Button } from "@/components/ui/button";

export function PrintShell({
  tenant,
  titulo,
  children,
}: {
  tenant: Tenant;
  titulo: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-muted/40 min-h-screen py-8 print:bg-white print:py-0">
      <div className="mx-auto mb-4 flex max-w-[210mm] justify-end gap-2 px-4 print:hidden">
        <Button variant="outline" onClick={() => window.close()}>
          Fechar
        </Button>
        <Button onClick={() => window.print()}>
          <Printer aria-hidden />
          Imprimir
        </Button>
      </div>
      <article className="mx-auto min-h-[297mm] max-w-[210mm] space-y-6 bg-white p-[15mm] text-sm leading-relaxed text-black shadow-sm print:min-h-0 print:max-w-none print:p-0 print:shadow-none">
        <header className="flex items-start justify-between gap-4 border-b border-black/20 pb-4">
          <div className="flex items-center gap-3">
            {tenant.logo_url ? <img src={tenant.logo_url} alt="" className="size-14 object-contain" /> : null}
            <div>
              <p className="text-lg font-semibold">{tenant.nome}</p>
              <p className="text-xs">
                {[tenant.cnpj && `CNPJ ${tenant.cnpj}`, tenant.telefone].filter(Boolean).join(" · ")}
              </p>
            </div>
          </div>
          <p className="text-xs">Emitido em {formatDate(todayISO())}</p>
        </header>
        <h1 className="text-center text-base font-semibold tracking-wide uppercase">{titulo}</h1>
        {children}
      </article>
    </div>
  );
}
