import { VehicleCatalogSection } from "@/components/louzada/VehicleCatalogSection";
import { parseFiltersFromSearchParams } from "@/lib/louzada/parse-filters";
import { listBrands, listVehicles } from "@/lib/louzada/vehicles-repository";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AutosPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = parseFiltersFromSearchParams(params, "auto");
  const vehicles = listVehicles(filters);
  const brands = listBrands("auto");

  return (
    <div className="pt-20">
      <VehicleCatalogSection
        eyebrow="Quatro rodas"
        title={
          <>
            Estoque de <span className="text-[#c41e3a]">Autos</span>
          </>
        }
        vehicles={vehicles}
        brands={brands}
        basePath="/autos"
      />
    </div>
  );
}
