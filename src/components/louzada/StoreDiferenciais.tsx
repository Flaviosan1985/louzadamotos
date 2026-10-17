import { buildWhatsAppUrl, storeContactMessage } from "@/lib/louzada/whatsapp";
import { SectionHeading } from "@/components/louzada/SectionHeading";

const items = [
  {
    titulo: "Procedência",
    desc: "Histórico claro e informações transparentes sobre cada veículo.",
  },
  {
    titulo: "Resposta rápida",
    desc: "Atendimento ágil pelo WhatsApp, do primeiro contato à visita.",
  },
  {
    titulo: "Condições",
    desc: "Opções de pagamento e financiamento conforme disponibilidade.",
  },
  {
    titulo: "Troca",
    desc: "Avaliamos seu usado na negociação, moto ou auto.",
  },
  {
    titulo: "Confiança",
    desc: "Equipe experiente e foco em uma compra segura.",
  },
  {
    titulo: "Seleção",
    desc: "Motos e automóveis escolhidos para diferentes perfis e bolsos.",
  },
];

export function StoreDiferenciais() {
  const wa = buildWhatsAppUrl(storeContactMessage());

  return (
    <section className="bg-[#0d0d0d] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          align="center"
          eyebrow="Por que nos escolher"
          title={
            <>
              Por que a <span className="text-[#c41e3a]">Louzada</span>
            </>
          }
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((d) => (
            <div
              key={d.titulo}
              className="rounded-2xl border border-[#2a2a2a] bg-[#141414] p-5 transition-all hover:border-[#c41e3a]/40"
            >
              <h3 className="font-display mb-1 text-lg leading-tight font-black text-white uppercase italic">
                {d.titulo}
              </h3>
              <p className="text-sm leading-relaxed text-[#777]">{d.desc}</p>
            </div>
          ))}
        </div>

        {wa ? (
          <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-2xl bg-[#c41e3a] p-7 sm:mt-12 sm:flex-row sm:items-center sm:rounded-3xl sm:p-12">
            <div>
              <h3
                className="font-display leading-tight font-black text-white uppercase italic"
                style={{ fontSize: "clamp(28px, 7vw, 44px)" }}
              >
                Pronto para fechar negócio?
              </h3>
              <p className="mt-1 text-sm text-white/70">Fale com a equipe Louzada Motos agora.</p>
            </div>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full shrink-0 rounded-full bg-white px-7 py-4 text-center text-sm font-black text-[#c41e3a] transition-colors hover:bg-[#f5f5f5] sm:w-auto"
            >
              Chamar no WhatsApp →
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}
