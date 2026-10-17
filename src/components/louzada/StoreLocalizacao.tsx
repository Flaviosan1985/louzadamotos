import { AtSign, Mail, Navigation, Phone } from "lucide-react";
import { buildWhatsAppUrl, storeContactMessage } from "@/lib/louzada/whatsapp";
import { WaIcon } from "@/components/louzada/WaIcon";

export function StoreLocalizacao() {
  const wa = buildWhatsAppUrl(storeContactMessage());

  return (
    <section id="contato" className="bg-[#0a0a0a]">
      <div className="h-px bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent" />

      <div className="mx-auto max-w-7xl px-4 pt-10 pb-6 sm:px-6 sm:pt-14">
        <p className="text-xs font-medium tracking-[0.2em] text-[#555] uppercase">/ Venha nos visitar</p>
        <h2
          className="font-display mt-2 leading-none font-black text-white uppercase italic"
          style={{ fontSize: "clamp(36px, 9vw, 72px)" }}
        >
          Como <span className="text-[#c41e3a]">Chegar</span>
        </h2>
        <p className="mt-3 max-w-xl text-sm text-[#666]">
          Av. Principal, 1200 — Centro. Estacionamento para clientes e atendimento com hora marcada
          pelo WhatsApp.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row">
        <div className="relative h-64 w-full sm:h-80 lg:min-h-[480px] lg:h-auto lg:w-[58%]">
          <iframe
            title="Localização Louzada Motos"
            src="https://maps.google.com/maps?q=Av.+Paulista,+1000,+São+Paulo&hl=pt-BR&z=15&output=embed"
            className="absolute inset-0 h-full w-full border-0"
            style={{
              filter: "grayscale(70%) invert(90%) contrast(85%) brightness(82%)",
            }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="flex w-full flex-col justify-center gap-6 bg-[#0a0a0a] px-4 py-8 sm:px-6 lg:w-[42%] lg:px-10 lg:py-12 xl:px-14">
          <div>
            <p className="mb-2 text-[10px] font-semibold tracking-widest text-[#555] uppercase">
              Endereço
            </p>
            <p className="text-xl leading-snug font-bold text-white sm:text-2xl">Av. Principal, 1200</p>
            <p className="mt-1 text-sm text-[#888]">Centro · Seg–Sex 9h–18h · Sáb 9h–13h</p>
          </div>

          <div className="h-px bg-[#1f1f1f]" />

          <div className="flex flex-col gap-2.5 text-sm">
            <a
              href="mailto:contato@louzadamotos.com.br"
              className="flex items-center gap-2 text-[#aaa] transition-colors hover:text-white"
            >
              <Mail size={14} className="shrink-0 text-[#c41e3a]" />
              contato@louzadamotos.com.br
            </a>
            <span className="flex items-center gap-2 text-[#aaa]">
              <Phone size={14} className="shrink-0 text-[#c41e3a]" />
              WhatsApp no botão abaixo
            </span>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#aaa] transition-colors hover:text-white"
            >
              <AtSign size={14} className="shrink-0 text-[#c41e3a]" />
              @louzadamotos
            </a>
          </div>

          {wa ? (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#c41e3a] px-6 py-4 text-base font-black text-white shadow-lg shadow-[#c41e3a]/20 transition-colors hover:bg-[#e52222]"
            >
              <WaIcon />
              Falar no WhatsApp
            </a>
          ) : null}

          <a
            href="https://www.google.com/maps"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#2a2a2a] py-4 text-sm font-semibold text-[#aaa] transition-all hover:border-[#c41e3a]/50 hover:text-white"
          >
            <Navigation size={16} />
            Abrir no Maps
          </a>
        </div>
      </div>
    </section>
  );
}
