import Image from "next/image";
import Link from "next/link";
import { formatCurrency, formatKm } from "@/lib/format";
import type { VehicleWithPhotos } from "@/lib/louzada/types";
import { InterestDialog } from "@/components/louzada/InterestDialog";
import { SoldRibbon } from "@/components/louzada/SoldRibbon";

type VehicleCardProps = {
  vehicle: VehicleWithPhotos;
};

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const sold = vehicle.status === "vendido";
  const imageSrc = vehicle.coverUrl ?? "/logo.jpg";
  const cc = vehicle.displacement ? ` · ${vehicle.displacement} cc` : "";

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#141414] transition-all duration-200 hover:border-[#c41e3a]/50">
      <Link
        href={`/veiculo/${vehicle.id}`}
        className="relative block aspect-[4/3] overflow-hidden bg-[#1a1a1a]"
      >
        <Image
          src={imageSrc}
          alt={`${vehicle.brand} ${vehicle.model}`}
          fill
          className={`object-cover transition duration-300 group-hover:scale-[1.02] ${sold ? "brightness-75 grayscale" : ""}`}
          sizes="(max-width:768px) 100vw, 33vw"
          unoptimized
        />
        {sold ? <SoldRibbon /> : null}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-[10px] font-bold tracking-widest text-[#c41e3a] uppercase">
          {vehicle.type === "moto" ? "Moto" : "Automóvel"}
        </p>
        <h3 className="font-display text-xl leading-tight font-black text-white uppercase italic">
          <Link href={`/veiculo/${vehicle.id}`} className="hover:text-[#c41e3a]">
            {vehicle.brand} {vehicle.model}
          </Link>
        </h3>
        <p className="text-sm text-[#777]">
          {vehicle.year} · {formatKm(vehicle.km)} · {vehicle.color}
          {cc}
        </p>
        <p className="font-display text-2xl font-black text-[#c41e3a] italic">
          {formatCurrency(vehicle.price)}
        </p>

        <div className="mt-auto flex flex-col gap-2 pt-3 sm:flex-row">
          <Link
            href={`/veiculo/${vehicle.id}`}
            className="inline-flex flex-1 items-center justify-center rounded-full border border-[#2a2a2a] px-4 py-3 text-sm font-semibold text-[#ccc] transition hover:border-[#c41e3a]/40 hover:text-white"
          >
            Ver detalhes
          </Link>
          {sold ? (
            <span className="inline-flex flex-1 cursor-not-allowed items-center justify-center rounded-full bg-[#252525] px-4 py-3 text-sm font-semibold text-[#666]">
              Veículo vendido
            </span>
          ) : (
            <InterestDialog
              vehicleId={vehicle.id}
              brand={vehicle.brand}
              model={vehicle.model}
              year={vehicle.year}
              displacement={vehicle.displacement}
              triggerClassName="flex-1 px-4 py-3 text-sm"
            />
          )}
        </div>
      </div>
    </article>
  );
}
