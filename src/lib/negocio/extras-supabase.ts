import type { ExtraKey } from "../types/modulos.ts";

export const EXTRAS_SUPABASE = [
  "kanban",
  "leads",
  "tarefas",
  "simulacoes",
  "vendas",
  "documentos",
] as const satisfies readonly ExtraKey[];

export type ExtraSupabase = (typeof EXTRAS_SUPABASE)[number];

const TABELAS: Record<ExtraSupabase, string> = {
  kanban: "kanban_cards",
  leads: "leads",
  tarefas: "tarefas",
  simulacoes: "simulacoes",
  vendas: "vendas",
  documentos: "documentos_cliente",
};

export function ehExtraSupabase(key: ExtraKey): key is ExtraSupabase {
  return (EXTRAS_SUPABASE as readonly string[]).includes(key);
}

export function tabelaDoExtra(key: ExtraSupabase) {
  return TABELAS[key];
}
