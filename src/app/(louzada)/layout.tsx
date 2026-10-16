import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Louzada Motos",
    template: "%s | Louzada Motos",
  },
  description: "Motos e autos selecionados. Estoque atualizado e atendimento via WhatsApp.",
};
import { StoreFooter } from "@/components/louzada/StoreFooter";
import { StoreHeader } from "@/components/louzada/StoreHeader";
import { WhatsAppFloat } from "@/components/louzada/WhatsAppFloat";

export default function LouzadaLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col bg-zinc-950 text-white">
      <StoreHeader />
      <main className="flex-1">{children}</main>
      <StoreFooter />
      <WhatsAppFloat />
    </div>
  );
}
