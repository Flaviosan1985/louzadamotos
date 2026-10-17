import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Barlow_Condensed } from "next/font/google";
import { StoreFooter } from "@/components/louzada/StoreFooter";
import { StoreHeader } from "@/components/louzada/StoreHeader";
import { WhatsAppFloat } from "@/components/louzada/WhatsAppFloat";
import "./louzada.css";

const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "Louzada Motos",
    template: "%s | Louzada Motos",
  },
  description:
    "Motos e automóveis selecionados. Estoque online, fotos reais e atendimento rápido via WhatsApp.",
};

export default function LouzadaLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`louzada-store flex min-h-full flex-col ${barlow.variable}`}>
      <StoreHeader />
      <main className="flex-1 pt-0">{children}</main>
      <StoreFooter />
      <WhatsAppFloat />
    </div>
  );
}
