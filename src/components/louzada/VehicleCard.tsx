import Image from "next/image";
import Link from "next/link";
import { formatCurrency, formatKm } from "@/lib/format";
import type { VehicleWithPhotos } from "@/lib/louzada/types";
import {
  buildWhatsAppUrl,
  vehicleInterestMessage,
} from "@/lib/louzada/whatsapp";
import { SoldRibbon } from "@/components/louzada/SoldRibbon";
import { WhatsAppLink } from "@/components/louzada/WhatsAppLink";

type VehicleCardProps = {
  vehicle: VehicleWithPhotos;
};

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const sold = vehicle.status === "vendido";
  const wa = buildWhatsAppUrl(
    vehicleInterestMessage(vehicle.brand, vehicle.model, vehicle.year),
  );
  const imageSrc = vehicle.coverUrl ?? "/logo.jpg";

  return (
    <article className="flex flex-col overflow-hidden rounded-lg bg-white text-zinc-900 shadow-md">
      <Link
        href={`/veiculo/${vehicle.id}`}
        className="relative block aspect-[4/3] overflow-hidden bg-zinc-100"
      >
        <Image
          src={imageSrc}
          alt={`${vehicle.brand} ${vehicle.model}`}
          fill
          className={`object-cover transition ${sold ? "brightness-75 grayscale" : ""}`}
          sizes="(max-width:768px) 100vw, 33vw"
          unoptimized
        />
        {sold ? <SoldRibbon /> : null}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-semibold tracking-wider text-[#c41e3a] uppercase">
          {vehicle.type === "moto" ? "Moto" : "Auto"}
        </p>
        <h3 className="text-lg font-bold">
          <Link href={`/veiculo/${vehicle.id}`} className="hover:text-[#c41e3a]">
            {vehicle.brand} {vehicle.model}
          </Link>
        </h3>
        <p className="text-sm text-zinc-600">
          {vehicle.year} · {formatKm(vehicle.km)} · {vehicle.color}
        </p>
        <p className="text-xl font-black text-[#c41e3a]">{formatCurrency(vehicle.price)}</p>
        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          <Link
            href={`/veiculo/${vehicle.id}`}
            className="inline-flex flex-1 items-center justify-center rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold hover:border-[#c41e3a] hover:text-[#c41e3a]"
          >
            Detalhes
          </Link>
          <WhatsAppLink
            href={wa}
            label="Tenho interesse"
            className="flex-1 text-xs"
            disabled={sold}
          />
        </div>
      </div>
    </article>
  );
}
