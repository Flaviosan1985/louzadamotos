import Image from "next/image";
import Link from "next/link";
import { formatCurrency, formatKm } from "@/lib/format";
import type { VehicleWithPhotos } from "@/lib/louzada/types";
import {
  buildWhatsAppUrl,
  vehicleInterestMessage,
} from "@/lib/louzada/whatsapp";
import { SoldRibbon } from "@/components/louzada/SoldRibbon";
import { WaIcon } from "@/components/louzada/WaIcon";

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
      ? vehicle.photos.map((p) => `/api/uploads/${encodeURIComponent(p.filename)}`)
      : ["/logo.jpg"];

  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-28">
      <Link href="/#estoque" className="mb-6 inline-block text-sm text-[#888] hover:text-[#c41e3a]">
        ← Voltar ao estoque
      </Link>

      <div className="grid gap-8 rounded-2xl border border-[#2a2a2a] bg-[#141414] p-6 lg:grid-cols-2 lg:p-8">
        <div>
          <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-xl bg-[#1a1a1a]">
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
                <div key={src} className="relative aspect-square overflow-hidden rounded-lg bg-[#1a1a1a]">
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
          <h1 className="font-display mt-2 text-3xl font-black text-white uppercase italic sm:text-4xl">
            {vehicle.brand} {vehicle.model}
          </h1>
          <p className="mt-2 text-[#888]">
            {vehicle.year} · {formatKm(vehicle.km)} · Cor {vehicle.color}
          </p>
          <p className="font-display mt-4 text-3xl font-black text-[#c41e3a] italic">
            {formatCurrency(vehicle.price)}
          </p>

          <p className="mt-4 text-sm text-[#aaa]">
            Status:{" "}
            <span className="font-semibold text-white">{sold ? "Vendido" : "Disponível"}</span>
          </p>

          <div className="mt-8">
            {sold || !wa ? (
              <span className="inline-flex rounded-full bg-[#252525] px-6 py-4 text-sm font-semibold text-[#666]">
                Veículo vendido
              </span>
            ) : (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#c41e3a] px-8 py-4 text-base font-black text-white hover:bg-[#e52222]"
              >
                <WaIcon />
                Chamar no WhatsApp
              </a>
            )}
          </div>

          <div className="mt-8 border-t border-[#2a2a2a] pt-6">
            <h2 className="text-sm font-bold tracking-wider text-[#666] uppercase">Descrição</h2>
            <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-[#aaa]">
              {vehicle.description || "Entre em contato para mais detalhes."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
