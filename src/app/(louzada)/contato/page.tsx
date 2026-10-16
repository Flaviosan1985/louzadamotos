import { WhiteSection } from "@/components/louzada/WhiteSection";
import { WhatsAppLink } from "@/components/louzada/WhatsAppLink";
import { buildWhatsAppUrl, storeContactMessage } from "@/lib/louzada/whatsapp";

export default function ContatoPage() {
  const wa = buildWhatsAppUrl(storeContactMessage());

  return (
    <div className="py-10">
      <WhiteSection title="Contato">
        <div className="grid gap-8 text-zinc-800 md:grid-cols-2">
          <div className="space-y-3 text-sm">
            <p>
              <span className="font-semibold">Endereço:</span> Av. Principal, 1200 — Centro
            </p>
            <p>
              <span className="font-semibold">Horário:</span> Seg–Sex 9h–18h · Sáb 9h–13h
            </p>
            <p>
              <span className="font-semibold">E-mail:</span> contato@louzadamotos.com.br
            </p>
          </div>
          <div className="flex flex-col items-start gap-4">
            <p className="text-sm text-zinc-600">
              Prefere agilidade? Chame no WhatsApp e fale direto com nossa equipe.
            </p>
            <WhatsAppLink href={wa} label="Abrir WhatsApp" />
          </div>
        </div>
      </WhiteSection>
    </div>
  );
}
