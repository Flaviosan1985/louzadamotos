import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl, storeContactMessage } from "@/lib/louzada/whatsapp";

export function WhatsAppFloat() {
  const href = buildWhatsAppUrl(storeContactMessage());
  if (!href) return null;

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed right-4 bottom-4 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 hover:bg-[#1ebe5d]"
      aria-label="Falar no WhatsApp"
    >
      <MessageCircle className="size-7" />
    </Link>
  );
}
