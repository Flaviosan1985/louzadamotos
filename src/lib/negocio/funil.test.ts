import { test } from "node:test";
import assert from "node:assert/strict";
import {
  ETAPAS,
  normalizarEtapa,
  etapaVizinha,
  validarTransicao,
  aplicarTransicao,
  vendaDoVeiculo,
  type CartaoFunil,
} from "./funil.ts";

const cartao = (campos: Partial<CartaoFunil> = {}): CartaoFunil => ({
  coluna: "Test drive",
  ...campos,
});

test("o funil tem 8 etapas na ordem", () => {
  assert.deepEqual(ETAPAS, [
    "Novo lead",
    "Contatado",
    "Agendamento",
    "Compareceu",
    "Test drive",
    "Negociação",
    "Vendido",
    "Perdido",
  ]);
});

test("colunas antigas do kanban são mapeadas", () => {
  assert.equal(normalizarEtapa("Lead"), "Novo lead");
  assert.equal(normalizarEtapa("Atendimento"), "Contatado");
  assert.equal(normalizarEtapa("Proposta"), "Negociação");
  assert.equal(normalizarEtapa("Vendido"), "Vendido");
  assert.equal(normalizarEtapa("Negociação"), "Negociação");
  assert.equal(normalizarEtapa("qualquer"), "Novo lead");
  assert.equal(normalizarEtapa(undefined), "Novo lead");
});

test("avançar e voltar ficam na trilha principal, sem cair em Perdido", () => {
  assert.equal(etapaVizinha("Novo lead", -1), null);
  assert.equal(etapaVizinha("Novo lead", 1), "Contatado");
  assert.equal(etapaVizinha("Vendido", 1), null);
  assert.equal(etapaVizinha("Perdido", -1), null);
});

test("Negociação exige test drive realizado", () => {
  assert.match(validarTransicao(cartao(), "Negociação", { placaDoVeiculo: null }) ?? "", /test drive/i);
  assert.equal(
    validarTransicao(cartao({ test_drive_em: "2026-10-15T10:00:00Z" }), "Negociação", { placaDoVeiculo: null }),
    null,
  );
});

test("Vendido exige veículo com placa e data de entrega", () => {
  const c = cartao({ coluna: "Negociação", test_drive_em: "x" });
  assert.match(validarTransicao(c, "Vendido", { placaDoVeiculo: null }) ?? "", /placa/i);
  assert.match(
    validarTransicao({ ...c, veiculo_id: "v-1" }, "Vendido", { placaDoVeiculo: "RTA4B21" }) ?? "",
    /entrega/i,
  );
  assert.equal(
    validarTransicao({ ...c, veiculo_id: "v-1", data_entrega: "2026-10-20" }, "Vendido", {
      placaDoVeiculo: "RTA4B21",
    }),
    null,
  );
});

test("Agendamento exige data e hora", () => {
  const c = cartao({ coluna: "Contatado" });
  assert.match(validarTransicao(c, "Agendamento", { placaDoVeiculo: null }) ?? "", /data/i);
  assert.equal(
    validarTransicao({ ...c, agendado_para: "2026-10-17 10:00" }, "Agendamento", { placaDoVeiculo: null }),
    null,
  );
});

test("Perdido exige motivo", () => {
  assert.match(validarTransicao(cartao(), "Perdido", { placaDoVeiculo: null }) ?? "", /motivo/i);
  assert.equal(
    validarTransicao(cartao({ motivo_perda: "Preço" }), "Perdido", { placaDoVeiculo: null }),
    null,
  );
});

test("motivo só com espaços não conta", () => {
  assert.ok(validarTransicao(cartao({ motivo_perda: "   " }), "Perdido", { placaDoVeiculo: null }));
});

test("aplicar transição registra a entrada na etapa e o test drive", () => {
  const agora = "2026-10-16T12:00:00.000Z";
  const r = aplicarTransicao(cartao({ coluna: "Compareceu" }), "Test drive", agora);
  assert.equal(r.coluna, "Test drive");
  assert.equal(r.etapa_em, agora);
  assert.equal(r.test_drive_em, agora);
});

test("venda do veículo acha o cartão vendido e o cliente pelo nome", () => {
  const clientes = [
    { id: "c-1", nome: "Mariana Alves" },
    { id: "c-3", nome: "Pedro Henrique Costa" },
  ];
  const kanban = [
    { coluna: "Negociação", veiculo_id: "v-2", cliente: "Mariana Alves" },
    { coluna: "Vendido", veiculo_id: "v-2", cliente: " pedro henrique costa ", data_entrega: "2026-10-16" },
  ];
  const r = vendaDoVeiculo("v-2", kanban, clientes);
  assert.equal(r.cliente?.id, "c-3");
  assert.equal(r.nomeComprador, " pedro henrique costa ".trim());
  assert.equal(r.dataEntrega, "2026-10-16");
});

test("venda do veículo acha pelo nome se não houver veiculo_id", () => {
  const r = vendaDoVeiculo(
    "v-4",
    [{ coluna: "Vendido", veiculo: "Chevrolet Onix Plus", cliente: "Transportes Norte Sul LTDA", data_entrega: "2026-10-04" }],
    [{ id: "c-2", nome: "Transportes Norte Sul LTDA" }],
    "Chevrolet Onix Plus Premier",
  );
  assert.equal(r.cliente?.id, "c-2");
  assert.equal(r.dataEntrega, "2026-10-04");
});

test("venda do veículo sem cartão devolve campos vazios", () => {
  const r = vendaDoVeiculo("v-9", [], []);
  assert.equal(r.cliente, null);
  assert.equal(r.nomeComprador, "");
  assert.equal(r.dataEntrega, "");
});

test("aplicar transição preserva test drive anterior", () => {
  const r = aplicarTransicao(cartao({ test_drive_em: "antes" }), "Negociação", "depois");
  assert.equal(r.test_drive_em, "antes");
});
