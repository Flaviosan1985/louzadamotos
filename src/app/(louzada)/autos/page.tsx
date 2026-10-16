import { Suspense } from "react";
import { DashboardStock } from "@/components/louzada/DashboardStock";

export default function AutosPage() {
  return (
    <Suspense fallback={null}>
      <DashboardStock variant="listing" basePath="/autos" title="Autos" defaultType="auto" />
    </Suspense>
  );
}
