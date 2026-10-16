import { WhiteSection } from "@/components/louzada/WhiteSection";

export default function SobrePage() {
  return (
    <div className="py-10">
      <WhiteSection title="Sobre">
        <div className="prose prose-zinc max-w-none text-zinc-700">
          <p>
            A <strong>Louzada Motos</strong> nasceu para oferecer motos e automóveis com
            transparência, procedência e atendimento humano. Trabalhamos com estoque próprio e
            parceiros selecionados na região.
          </p>
          <p>
            Nossa missão é simplificar a compra: fotos reais, histórico claro e resposta rápida
            pelo WhatsApp. Visite nossa loja ou fale conosco a qualquer momento.
          </p>
        </div>
      </WhiteSection>
    </div>
  );
}
