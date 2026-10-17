"use client";

import { useAppSnapshot } from "@/hooks/use-app-snapshot";
import { PanelLink } from "@/components/layout/panel/PanelLink";

function initialsFrom(nome: string) {
  return nome
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function SidebarAccount() {
  const { data } = useAppSnapshot();
  const nome = data?.profile.nome ?? "Conta";
  const loja = data?.tenant.nome ?? "Louzada Motos";

  return (
    <PanelLink
      href="/conta"
      className="hover:bg-[#F5F4F8] flex items-center gap-3 rounded-xl px-2 py-2 transition"
    >
      <span className="flex size-9 items-center justify-center rounded-full bg-[#E10600] text-xs font-semibold text-white">
        {data ? initialsFrom(data.profile.nome) : "LM"}
      </span>
      <span className="min-w-0 group-data-[collapsible=icon]:hidden">
        <span className="block truncate text-sm font-medium">{nome}</span>
        <span className="text-muted-foreground block truncate text-xs">{loja}</span>
      </span>
    </PanelLink>
  );
}
