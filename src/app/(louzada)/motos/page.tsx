import { VehicleCatalogSection } from "@/components/louzada/VehicleCatalogSection";
import { parseFiltersFromSearchParams } from "@/lib/louzada/parse-filters";
import { listBrands, listVehicles } from "@/lib/louzada/vehicles-repository";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function MotosPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = parseFiltersFromSearchParams(params, "moto");
  const vehicles = listVehicles(filters);
  const brands = listBrands("moto");

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
