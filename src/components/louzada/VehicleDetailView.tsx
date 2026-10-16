import Image from "next/image";
import { formatCurrency, formatKm } from "@/lib/format";
import type { VehicleWithPhotos } from "@/lib/louzada/types";
import {
  buildWhatsAppUrl,
  vehicleInterestMessage,
} from "@/lib/louzada/whatsapp";
import { SoldRibbon } from "@/components/louzada/SoldRibbon";
import { WhatsAppLink } from "@/components/louzada/WhatsAppLink";
import { publicPhotoSrc } from "@/lib/catalog/from-dashboard";

type VehicleDetailViewProps = {
  vehicle: VehicleWithPhotos;
};

export function VehicleDetailView({ vehicle }: VehicleDetailViewProps) {
  const sold = vehicle.status === "vendido";
  const wa = buildWhatsAppUrl(
    vehicleInterestMessage(vehicle.brand, vehicle.model, vehicle.year),
  );
  const photos =
    vehicle.photos.length > 0
      ? vehicle.photos.map((p) => publicPhotoSrc(p.filename))
      : ["/logo.jpg"];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-8 rounded-xl bg-white p-6 text-zinc-900 shadow-xl lg:grid-cols-2 lg:p-8">
        <div>
          <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-lg bg-zinc-100">
            <Image
              src={photos[0]}
              alt={`${vehicle.brand} ${vehicle.model}`}
              fill
              className={`object-cover ${sold ? "brightness-75 grayscale" : ""}`}
              priority
              sizes="(max-width:1024px) 100vw, 50vw"
              unoptimized
            />
            {sold ? <SoldRibbon /> : null}
          </div>
          {photos.length > 1 ? (
            <div className="grid grid-cols-4 gap-2">
              {photos.slice(1, 5).map((src) => (
                <div key={src} className="relative aspect-square overflow-hidden rounded-md bg-zinc-100">
                  <Image
                    src={src}
                    alt=""
                    fill
                    className={`object-cover ${sold ? "grayscale" : ""}`}
                    sizes="120px"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <p className="text-xs font-bold tracking-[0.25em] text-[#c41e3a] uppercase">
            {vehicle.type === "moto" ? "Moto" : "Automóvel"}
          </p>
          <h1 className="mt-2 text-3xl font-black uppercase">
            {vehicle.brand} {vehicle.model}
          </h1>
          <p className="mt-2 text-zinc-600">
            {vehicle.year} · {formatKm(vehicle.km)} · Cor {vehicle.color}
          </p>
          <p className="mt-4 text-3xl font-black text-[#c41e3a]">
            {formatCurrency(vehicle.price)}
          </p>

          <div className="mt-6 space-y-2 text-sm">
            <p>
              <span className="font-semibold">Status:</span>{" "}
              {sold ? "Vendido" : "Disponível"}
            </p>
          </div>

          <div className="mt-8">
            <WhatsAppLink
              href={wa}
              label="Chamar no WhatsApp"
              className="w-full md:w-auto"
              disabled={sold}
            />
          </div>

          <div className="mt-8 border-t border-zinc-200 pt-6">
            <h2 className="text-sm font-bold tracking-wider text-zinc-500 uppercase">
              Descrição
            </h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-zinc-700">
              {vehicle.description || "Entre em contato para mais detalhes."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
