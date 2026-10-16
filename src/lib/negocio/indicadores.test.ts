import { test } from "node:test";
import assert from "node:assert/strict";
import { calcularIndicadores } from "./indicadores.ts";

const agora = new Date("2026-10-16T12:00:00");

const veiculos = [
  { id: "a", status: "disponivel", preco_custo: 80, preco_venda: 100, criado_em: "2026-10-06T12:00:00", vendido_em: null },
  { id: "b", status: "reservado", preco_custo: 40, preco_venda: 50, criado_em: "2026-09-26T12:00:00", vendido_em: null },
  { id: "c", status: "vendido", preco_custo: 90, preco_venda: 100, criado_em: "2026-09-01T12:00:00", vendido_em: "2026-10-04T12:00:00" },
];

test("indicadores do estoque, margem, funil e transferências", () => {
  const r = calcularIndicadores({
    veiculos,
    financeiro: [],
    kanban: [{ coluna: "Vendido" }, { coluna: "Perdido" }, { coluna: "Negociação" }, { coluna: "Proposta" }],
    transferencias: [],
    comissaoPct: 0,
    agora,
  });
  assert.equal(r.valorEstoque, 150);
  assert.equal(r.veiculosEstoque, 2);
  assert.equal(r.diasMedioEstoque, 15);
  assert.equal(r.margemMedia, 0.1);
  assert.equal(r.conversaoFunil, 0.25);
  assert.equal(r.transferenciasPendentes, 1);
  assert.equal(r.transferenciasAlerta, 0);
});

test("sem cartões a conversão é nula; sem estoque os dias são nulos", () => {
  const r = calcularIndicadores({
    veiculos: [],
    financeiro: [],
    kanban: [],
    transferencias: [],
    comissaoPct: 0,
    agora,
  });
  assert.equal(r.conversaoFunil, null);
  assert.equal(r.diasMedioEstoque, null);
  assert.equal(r.margemMedia, null);
});
