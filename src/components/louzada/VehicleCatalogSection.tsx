import type { ReactNode } from "react";
import { Suspense } from "react";
import { SectionHeading } from "@/components/louzada/SectionHeading";
import { VehicleFilters } from "@/components/louzada/VehicleFilters";
import { VehicleGrid } from "@/components/louzada/VehicleGrid";
import type { VehicleWithPhotos } from "@/lib/louzada/types";

type VehicleCatalogSectionProps = {
  id?: string;
  eyebrow: string;
  title: ReactNode;
  description?: string;
  vehicles: VehicleWithPhotos[];
  brands: string[];
  basePath: string;
  showFilters?: boolean;
};

export function VehicleCatalogSection({
  id,
  eyebrow,
  title,
  description,
  vehicles,
  brands,
  basePath,
  showFilters = true,
}: VehicleCatalogSectionProps) {
  return (
    <section id={id} className="bg-[#0d0d0d] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        {showFilters ? (
          <Suspense fallback={<p className="mb-6 text-sm text-[#666]">Carregando filtros…</p>}>
            <VehicleFilters brands={brands} basePath={basePath} />
          </Suspense>
        ) : null}
        <VehicleGrid vehicles={vehicles} />
      </div>
    </section>
  );
}
