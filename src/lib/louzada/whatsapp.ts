export function getWhatsAppNumber(fallback?: string | null) {
  const fromEnv = (process.env.NEXT_PUBLIC_WHATSAPP ?? "").replace(/\D/g, "");
  if (fromEnv) return fromEnv;
  return (fallback ?? "").replace(/\D/g, "");
}

export function buildWhatsAppUrl(message: string, fallbackPhone?: string | null) {
  const number = getWhatsAppNumber(fallbackPhone);
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function vehicleInterestMessage(brand: string, model: string, year: number) {
  return `Olá! Tenho interesse na ${brand} ${model} ${year} que vi no site da Louzada Motos.`;
}

export function leadWhatsAppMessage(input: {
  brand: string;
  model: string;
  year: number;
  displacement?: number | null;
  customerName: string;
  phone: string;
  proposal: string;
}) {
  const cc =
    input.displacement && input.displacement > 0 ? ` (${input.displacement} cc)` : "";
  const lines = [
    `Olá! Sou *${input.customerName}* — tel: ${input.phone}.`,
    `Tenho interesse na *${input.brand} ${input.model} ${input.year}*${cc} do site Louzada Motos.`,
  ];
  if (input.proposal.trim()) {
    lines.push("", `Proposta / mensagem: ${input.proposal.trim()}`);
  }
  return lines.join("\n");
}

export function storeContactMessage() {
  return "Olá! Vim pelo site da Louzada Motos e gostaria de mais informações.";
}
