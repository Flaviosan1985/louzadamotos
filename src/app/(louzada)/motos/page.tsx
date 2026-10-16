import { Suspense } from "react";
import { DashboardStock } from "@/components/louzada/DashboardStock";

export default function MotosPage() {
  return (
    <Suspense fallback={null}>
      <DashboardStock variant="listing" basePath="/motos" title="Motos" defaultType="moto" />
    </Suspense>
  );
}
