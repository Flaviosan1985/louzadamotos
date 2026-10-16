export function getWhatsAppNumber() {
  return (process.env.NEXT_PUBLIC_WHATSAPP ?? "").replace(/\D/g, "");
}

export function buildWhatsAppUrl(message: string) {
  const number = getWhatsAppNumber();
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function vehicleInterestMessage(brand: string, model: string, year: number) {
  return `Olá! Tenho interesse na ${brand} ${model} ${year} que vi no site da Louzada Motos.`;
}

export function storeContactMessage() {
  return "Olá! Vim pelo site da Louzada Motos e gostaria de mais informações.";
}
