import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Painel | Louzada Motos",
  robots: { index: false, follow: false },
};

export default function LouzadaAdminLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-zinc-100 text-zinc-900">{children}</div>;
}
