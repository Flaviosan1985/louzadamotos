import { test } from "node:test";
import assert from "node:assert/strict";
import { gerarTarefas, parseQuando, tarefasTransferencia } from "./tarefas.ts";

test("transferência em alerta ou vencida vira tarefa; dentro do prazo não", () => {
  const r = tarefasTransferencia(
    [
      { veiculoId: "a", status: "pendente", diasRestantes: 3, situacao: "alerta", limite: new Date("2026-10-19T00:00:00") },
      { veiculoId: "b", status: "pendente", diasRestantes: -2, situacao: "vencido", limite: new Date("2026-10-14T00:00:00") },
      { veiculoId: "c", status: "pendente", diasRestantes: 20, situacao: "ok", limite: new Date("2026-11-05T00:00:00") },
    ],
    { a: "Onix QWE1D22", b: "BMW G 310" },
  );
  assert.deepEqual(r.map((t) => [t.origemId, t.prioridade, t.href]), [
    ["a", "alta", "/veiculos/a"],
    ["b", "alta", "/veiculos/b"],
  ]);
  assert.match(r[0].detalhe, /3 dia/);
  assert.match(r[1].detalhe, /vencido/i);
});

const agora = new Date("2026-10-16T12:00:00");
const iso = (s: string) => new Date(s).toISOString();

const tipos = (r: ReturnType<typeof gerarTarefas>) => r.map((t) => t.tipo);

test("parseQuando lê data e hora locais no formato da agenda", () => {
  assert.equal(parseQuando("2026-10-16 15:00")?.getHours(), 15);
  assert.equal(parseQuando("lixo"), null);
});

test("novo lead há mais de 15 minutos vira tarefa de primeiro contato", () => {
  const r = gerarTarefas({
    kanban: [{ id: "a", titulo: "A", coluna: "Novo lead", etapa_em: iso("2026-10-16T11:40:00") }],
    agenda: [],
    agora,
  });
  assert.deepEqual(tipos(r), ["primeiro-contato"]);
  assert.equal(r[0].prioridade, "alta");
});

test("novo lead recente não gera tarefa", () => {
  const r = gerarTarefas({
    kanban: [{ id: "a", titulo: "A", coluna: "Novo lead", etapa_em: iso("2026-10-16T11:50:00") }],
    agenda: [],
    agora,
  });
  assert.equal(r.length, 0);
});

test("coluna antiga Lead é tratada como Novo lead", () => {
  const r = gerarTarefas({
    kanban: [{ id: "a", titulo: "A", coluna: "Lead", criado_em: iso("2026-10-15T10:00:00") }],
    agenda: [],
    agora,
  });
  assert.deepEqual(tipos(r), ["primeiro-contato"]);
});

test("agendamento nas próximas 24 h, nas próximas 2 h e vencido", () => {
  const base = { titulo: "X", coluna: "Agendamento", etapa_em: iso("2026-10-15T10:00:00") };
  const r = gerarTarefas({
    kanban: [
      { ...base, id: "d", agendado_para: "2026-10-17 09:00" },
      { ...base, id: "h", agendado_para: "2026-10-16 13:30" },
      { ...base, id: "v", agendado_para: "2026-10-16 10:00" },
    ],
    agenda: [],
    agora,
  });
  const porId = Object.fromEntries(r.map((t) => [t.origemId, t.tipo]));
  assert.equal(porId.d, "confirmar-24h");
  assert.equal(porId.h, "lembrete-2h");
  assert.equal(porId.v, "nao-compareceu");
});

test("acompanhamento depois de 24 h do test drive", () => {
  const r = gerarTarefas({
    kanban: [{ id: "t", titulo: "T", coluna: "Test drive", test_drive_em: iso("2026-10-15T09:00:00") }],
    agenda: [],
    agora,
  });
  assert.deepEqual(tipos(r), ["pos-test-drive"]);
});

test("contatado ou em negociação há 48 h sem movimento", () => {
  const r = gerarTarefas({
    kanban: [
      { id: "c", titulo: "C", coluna: "Contatado", etapa_em: iso("2026-10-14T08:00:00") },
      { id: "n", titulo: "N", coluna: "Negociação", etapa_em: iso("2026-10-15T08:00:00") },
    ],
    agenda: [],
    agora,
  });
  assert.deepEqual(tipos(r), ["sem-resposta-48h"]);
});

test("vendidos e perdidos não geram tarefas", () => {
  const r = gerarTarefas({
    kanban: [
      { id: "v", titulo: "V", coluna: "Vendido", etapa_em: iso("2026-10-01T08:00:00") },
      { id: "p", titulo: "P", coluna: "Perdido", etapa_em: iso("2026-10-01T08:00:00") },
    ],
    agenda: [],
    agora,
  });
  assert.equal(r.length, 0);
});

test("compromisso da agenda nas próximas 24 h", () => {
  const r = gerarTarefas({
    kanban: [],
    agenda: [
      { id: "g1", titulo: "Entrega", quando: "2026-10-16 13:00" },
      { id: "g2", titulo: "Longe", quando: "2026-10-20 13:00" },
      { id: "g3", titulo: "Passado", quando: "2026-10-15 13:00" },
    ],
    agora,
  });
  assert.deepEqual(r.map((t) => [t.origemId, t.prioridade]), [["g1", "alta"]]);
});

test("ordena alta prioridade primeiro", () => {
  const r = gerarTarefas({
    kanban: [
      { id: "t", titulo: "T", coluna: "Test drive", test_drive_em: iso("2026-10-15T09:00:00") },
      { id: "a", titulo: "A", coluna: "Novo lead", etapa_em: iso("2026-10-16T08:00:00") },
    ],
    agenda: [],
    agora,
  });
  assert.deepEqual(r.map((t) => t.prioridade), ["alta", "media"]);
});
