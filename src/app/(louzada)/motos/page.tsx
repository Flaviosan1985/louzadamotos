import { VehicleCatalogSection } from "@/components/louzada/VehicleCatalogSection";
import { loadVitrineCatalog, listVitrineBrands } from "@/lib/catalog/vitrine.server";
import { parseFiltersFromSearchParams } from "@/lib/louzada/parse-filters";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function MotosPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = parseFiltersFromSearchParams(params, "moto");
  const vehicles = await loadVitrineCatalog(filters);
  const brands = listVitrineBrands(vehicles, "moto");

  return (
    <div className="pt-20">
      <VehicleCatalogSection
        eyebrow="Duas rodas"
        title={
          <>
            Estoque de <span className="text-[#c41e3a]">Motos</span>
          </>
        }
        vehicles={vehicles}
        brands={brands}
        basePath="/motos"
      />
    </div>
  );
}
