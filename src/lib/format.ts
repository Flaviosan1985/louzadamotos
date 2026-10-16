const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const integer = new Intl.NumberFormat("pt-BR");

export function formatCurrency(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);
  return currency.format(Number.isFinite(amount) ? amount : 0);
}

export function formatKm(value: number | string | null | undefined) {
  const km = Number(value ?? 0);
  return `${integer.format(Number.isFinite(km) ? km : 0)} km`;
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value.includes("T") ? value : `${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("pt-BR");
}

export function formatMonthLabel(isoMonth: string) {
  const [year, month] = isoMonth.split("-").map(Number);
  const date = new Date(year, (month ?? 1) - 1, 1);
  return date.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");
}

export function formatPlaca(placa: string | null | undefined) {
  if (!placa) return "SEM PLACA";
  return placa.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function monthStartISO(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
    .toISOString()
    .slice(0, 10);
}
