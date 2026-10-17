import Image from "next/image";
import Link from "next/link";
import { buildWhatsAppUrl, storeContactMessage } from "@/lib/louzada/whatsapp";
import { WaIcon } from "@/components/louzada/WaIcon";

export function HeroSection() {
  const wa = buildWhatsAppUrl(storeContactMessage());

  return (
    <section id="inicio" className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.jpg"
          alt="Louzada Motos"
          fill
          className="object-cover object-center"
          priority
          quality={80}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-[#0a0a0a]/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/80 via-transparent to-transparent" />
      </div>

      <div className="absolute top-0 right-0 left-0 z-10 h-1 bg-[#c41e3a]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-24 pb-10 sm:px-6 sm:pb-14">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#c41e3a]/40 bg-[#c41e3a]/15 px-3 py-1.5 text-xs font-bold tracking-widest text-[#ff6b6b] uppercase">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#c41e3a]" />
          Motos e autos selecionados
        </div>

        <h1 className="font-display mb-4 leading-[0.9] font-black text-white uppercase italic sm:mb-5">
          <span className="block" style={{ fontSize: "clamp(48px, 13vw, 100px)" }}>
            Seu próximo
          </span>
          <span className="block text-[#c41e3a]" style={{ fontSize: "clamp(48px, 13vw, 100px)" }}>
            veículo aqui.
          </span>
        </h1>

        <p className="mb-7 max-w-md text-base leading-relaxed text-[#bbb] sm:text-lg">
          Estoque atualizado, atendimento direto no WhatsApp e condições especiais para motos e
          automóveis.
        </p>

        <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row">
          {wa ? (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2.5 rounded-full bg-[#c41e3a] px-6 py-4 text-base font-black text-white shadow-lg shadow-[#c41e3a]/30 transition-colors hover:bg-[#e52222] active:bg-[#a01830] sm:w-auto"
            >
              <WaIcon />
              Falar no WhatsApp
            </a>
          ) : null}
          <Link
            href="/#estoque"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-4 text-base font-semibold text-white transition-all hover:border-white/50 active:bg-white/10 sm:w-auto"
          >
            Ver estoque
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-6 border-t border-white/10 pt-6 sm:flex sm:flex-wrap sm:gap-10">
          {[
            { value: "100%", label: "Transparência" },
            { value: "Motos", label: "E autos" },
            { value: "WhatsApp", label: "Atendimento rápido" },
            { value: "Financ.", label: "Consulte condições" },
          ].map((s) => (
            <div key={s.label}>
              <p className="font-display text-[clamp(22px,6vw,34px)] leading-none font-black text-[#c41e3a] italic">
                {s.value}
              </p>
              <p className="mt-1 text-[11px] tracking-wider text-[#666] uppercase">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
