import { buildWhatsAppUrl, storeContactMessage } from "@/lib/louzada/whatsapp";
import { WaIcon } from "@/components/louzada/WaIcon";

export function WhatsAppFloat() {
  const href = buildWhatsAppUrl(storeContactMessage());
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed right-4 bottom-5 z-50 flex items-center gap-2.5 rounded-full bg-[#25D366] pr-5 pl-4 text-sm font-black text-white shadow-2xl shadow-[#25D366]/40 transition-all hover:scale-105 hover:bg-[#1db954] active:scale-95"
      style={{ height: "52px" }}
    >
      <WaIcon className="h-5 w-5" />
      <span>WhatsApp</span>
    </a>
  );
}
