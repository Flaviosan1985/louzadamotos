import { PanelLink } from "@/components/layout/panel/PanelLink";
import { BarChart3, Car, Contact, Settings, Wallet } from "lucide-react";

const tiles = [
  { href: "/cadastros/clientes", label: "Cadastros", icon: Contact },
  { href: "/veiculos/a-venda", label: "Veículos", icon: Car },
  { href: "/financeiro/resumo", label: "Financeiro", icon: Wallet },
  { href: "/relatorios/estatisticas", label: "Relatórios", icon: BarChart3 },
  { href: "/configuracoes/propriedades", label: "Configurações", icon: Settings },
];

export function DashboardTiles() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {tiles.map((tile) => {
        const Icon = tile.icon;
        return (
          <PanelLink
            key={tile.href}
            href={tile.href}
            className="bg-card hover:border-primary/40 flex flex-col items-center gap-3 rounded-xl border px-6 py-8 text-center shadow-sm transition"
          >
            <Icon className="text-muted-foreground size-8" />
            <span className="text-sm font-medium">{tile.label}</span>
          </PanelLink>
        );
      })}
    </section>
  );
}
