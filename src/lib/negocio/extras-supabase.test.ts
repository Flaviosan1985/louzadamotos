import { test } from "node:test";
import assert from "node:assert/strict";
import { EXTRAS_SUPABASE, tabelaDoExtra } from "./extras-supabase.ts";

test("kanban, leads, tarefas, simulações, vendas e documentos têm tabela própria", () => {
  assert.deepEqual([...EXTRAS_SUPABASE], [
    "kanban",
    "leads",
    "tarefas",
    "simulacoes",
    "vendas",
    "documentos",
  ]);
  assert.equal(tabelaDoExtra("kanban"), "kanban_cards");
  assert.equal(tabelaDoExtra("leads"), "leads");
  assert.equal(tabelaDoExtra("tarefas"), "tarefas");
  assert.equal(tabelaDoExtra("simulacoes"), "simulacoes");
  assert.equal(tabelaDoExtra("vendas"), "vendas");
  assert.equal(tabelaDoExtra("documentos"), "documentos_cliente");
});
