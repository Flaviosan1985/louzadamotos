import { PanelLink } from "@/components/layout/panel/PanelLink";

export function DashboardHighlight({ estoque }: { estoque: number }) {
  return (
    <section className="overflow-hidden rounded-2xl bg-[#E10600] p-5 text-white shadow-[0_8px_24px_rgba(225,6,0,0.25)]">
      <p className="text-sm text-white/80">Estoque à venda</p>
      <p className="mt-6 text-3xl font-semibold">{estoque}</p>
      <p className="text-sm text-white/80">veículos no pátio</p>
      <PanelLink
        href="/veiculos/adicionar"
        className="mt-6 flex h-11 items-center justify-center rounded-xl bg-white text-sm font-semibold text-[#E10600]"
      >
        Adicionar veículo
      </PanelLink>
    </section>
  );
}
