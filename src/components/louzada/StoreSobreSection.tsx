import Image from "next/image";
import { SectionHeading } from "@/components/louzada/SectionHeading";

const valores = [
  "Atendimento honesto",
  "Fotos reais do estoque",
  "Respeito ao cliente",
  "Agilidade na resposta",
  "Motos e autos selecionados",
  "Paixão por automóveis",
];

export function StoreSobreSection() {
  return (
    <section id="sobre" className="bg-[#0a0a0a] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative mb-10 overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#141414] p-6 sm:mb-14 sm:p-12">
          <div className="absolute top-0 left-0 h-full w-1 rounded-l-2xl bg-[#c41e3a]" />
          <div className="pointer-events-none absolute -right-4 -bottom-4 font-display text-[120px] leading-none font-black text-[#c41e3a]/5 italic select-none sm:text-[180px]">
            LM
          </div>
          <p className="max-w-2xl text-lg leading-relaxed font-semibold text-white sm:text-2xl">
            Tem gente que vê um veículo.{" "}
            <span className="font-bold text-[#c41e3a]">
              A gente vê conquista, liberdade e história.
            </span>
          </p>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#777] sm:text-base">
            A Louzada Motos nasceu para simplificar a compra de motos e automóveis: estoque
            transparente, informação clara e contato direto com quem vende.
          </p>
        </div>

        <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Nossa história"
              title={
                <>
                  <span className="text-[#c41e3a]">Louzada</span> Motos
                </>
              }
              description="Referência em motos e autos na região, com vitrine online sempre atualizada."
            />

            <div className="mb-6">
              <p className="mb-3 text-xs font-bold tracking-widest text-[#555] uppercase">
                Nossos valores
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {valores.map((v) => (
                  <div key={v} className="flex items-center gap-2 text-sm text-[#bbb]">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#c41e3a]" />
                    {v}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-4">
                <p className="mb-1 text-xs font-black tracking-widest text-[#c41e3a] uppercase">
                  Missão
                </p>
                <p className="text-xs leading-relaxed text-[#888]">
                  Conectar pessoas ao veículo certo, com confiança e agilidade.
                </p>
              </div>
              <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-4">
                <p className="mb-1 text-xs font-black tracking-widest text-[#c41e3a] uppercase">
                  Visão
                </p>
                <p className="text-xs leading-relaxed text-[#888]">
                  Ser a loja referência em motos e autos para quem busca qualidade.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
              <Image src="/logo.jpg" alt="Louzada Motos" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/50 to-transparent" />
            </div>
            <div className="flex flex-col gap-3">
              <div className="relative aspect-square overflow-hidden rounded-2xl">
                <Image src="/hero-bg.jpg" alt="Estoque Louzada Motos" fill className="object-cover" />
              </div>
              <div className="relative min-h-[80px] flex-1 overflow-hidden rounded-2xl">
                <Image src="/hero-bg.jpg" alt="" fill className="object-cover object-left" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
