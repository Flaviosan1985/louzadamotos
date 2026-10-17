import { HeroSection } from "@/components/louzada/HeroSection";
import { StoreDepoimentos } from "@/components/louzada/StoreDepoimentos";
import { StoreDiferenciais } from "@/components/louzada/StoreDiferenciais";
import { StoreLocalizacao } from "@/components/louzada/StoreLocalizacao";
import { StoreSobreSection } from "@/components/louzada/StoreSobreSection";
import { VehicleCatalogSection } from "@/components/louzada/VehicleCatalogSection";
import { loadVitrineCatalog, listVitrineBrands } from "@/lib/catalog/vitrine.server";
import { parseFiltersFromSearchParams } from "@/lib/louzada/parse-filters";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LouzadaHomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = parseFiltersFromSearchParams(params);
  const allAvailable = await loadVitrineCatalog({ hideSold: true });
  const featured = allAvailable.slice(0, 6);
  const stock = await loadVitrineCatalog(filters);
  const brands = listVitrineBrands(stock);

  return (
    <>
      <HeroSection />

      <VehicleCatalogSection
        id="destaques"
        eyebrow="Seleção especial"
        title={
          <>
            Destaques <span className="text-[#c41e3a]">da loja</span>
          </>
        }
        description="Os veículos em evidência no momento — confira fotos e fale direto no WhatsApp."
        vehicles={featured}
        brands={brands}
        basePath="/"
        showFilters={false}
      />

      <VehicleCatalogSection
        id="estoque"
        eyebrow="Estoque completo"
        title={
          <>
            <span className="text-[#c41e3a]">Louzada</span> motos
          </>
        }
        description="Filtre por marca, preço ou busca. Veículos vendidos aparecem ao final da lista."
        vehicles={stock}
        brands={brands}
        basePath="/"
      />

      <StoreDiferenciais />
      <StoreSobreSection />
      <StoreDepoimentos />
      <StoreLocalizacao />
    </>
  );
}
