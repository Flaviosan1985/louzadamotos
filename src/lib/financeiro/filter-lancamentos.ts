import type { LancamentoFinanceiro, StatusFinanceiro } from "@/lib/types/database";

export function filterLancamentos(
  items: LancamentoFinanceiro[],
  status: StatusFinanceiro | "todos",
  de: string,
  ate: string,
) {
  return items.filter((item) => {
    if (status !== "todos" && item.status !== status) return false;
    if (de && item.data_vencimento < de) return false;
    if (ate && item.data_vencimento > ate) return false;
    return true;
  });
}
