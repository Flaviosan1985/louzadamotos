import { Suspense } from "react";
import { HeroSection } from "@/components/louzada/HeroSection";
import { DashboardStock } from "@/components/louzada/DashboardStock";

export default function LouzadaHomePage() {
  return (
    <>
      <HeroSection />
      <Suspense fallback={<p className="px-4 py-10 text-sm text-zinc-500">Carregando estoque…</p>}>
        <DashboardStock variant="home" basePath="/" title="Estoque" />
      </Suspense>
    </>
  );
}
