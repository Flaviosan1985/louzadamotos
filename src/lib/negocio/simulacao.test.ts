import { test } from "node:test";
import assert from "node:assert/strict";
import {
  parcelaPrice,
  taxaImplicita,
  simular,
  validarSimulacao,
  parseDecimalBR,
  type SimulacaoEntrada,
} from "./simulacao.ts";

const base: SimulacaoEntrada = {
  valor: 50000,
  desconto: 0,
  entrada: 14000,
  troca: 0,
  prazo: 36,
  taxaMensalPct: 1.79,
  tarifas: 0,
  iof: 0,
  renda: 0,
};

const perto = (a: number, b: number, tol = 0.01) =>
  assert.ok(Math.abs(a - b) <= tol, `${a} ≉ ${b}`);

test("parcela Price com juros", () => {
  perto(parcelaPrice(36000, 0.0179, 36), 1365.19);
});

test("parcela Price com taxa zero divide igualmente", () => {
  assert.equal(parcelaPrice(12000, 0, 12), 1000);
});

test("taxa implícita recupera a taxa quando não há custos", () => {
  const p = parcelaPrice(36000, 0.0179, 36);
  perto(taxaImplicita(36000, p, 36), 0.0179, 1e-6);
});

test("taxa implícita é zero quando as parcelas não superam o líquido", () => {
  assert.equal(taxaImplicita(12000, 1000, 12), 0);
});

test("cenário financiado: tarifas e IOF elevam o CET acima da taxa", () => {
  const r = simular({ ...base, tarifas: 900, iof: 500 });
  assert.ok(r.financiado);
  perto(r.financiado.valorFinanciado, 37400);
  assert.ok(r.financiado.cetMensal > 0.0179);
  perto(r.financiado.totalPago, r.financiado.parcela * 36 + 14000);
});

test("à vista considera desconto", () => {
  const r = simular({ ...base, desconto: 2000 });
  assert.equal(r.aVista.total, 48000);
});

test("com troca abate o valor da troca do financiado", () => {
  const r = simular({ ...base, troca: 10000 });
  assert.ok(r.comTroca);
  perto(r.comTroca.valorFinanciado, 26000);
});

test("sem troca não há cenário com troca", () => {
  assert.equal(simular(base).comTroca, null);
});

test("alerta quando a parcela passa de 30% da renda", () => {
  const r = simular({ ...base, renda: 4000 });
  assert.ok(r.financiado);
  assert.equal(r.financiado.alertaRenda, true);
  const ok = simular({ ...base, renda: 10000 });
  assert.equal(ok.financiado?.alertaRenda, false);
});

test("sem renda informada não há comprometimento", () => {
  assert.equal(simular(base).financiado?.comprometimentoRenda, null);
});

test("entrada que quita o veículo não gera financiamento", () => {
  assert.equal(simular({ ...base, entrada: 50000 }).financiado, null);
});

test("validação: prazo fora de 12 a 60 meses", () => {
  assert.ok(validarSimulacao({ ...base, prazo: 6 }).prazo);
  assert.ok(validarSimulacao({ ...base, prazo: 72 }).prazo);
  assert.equal(validarSimulacao(base).prazo, undefined);
});

test("validação: desconto não pode igualar o valor", () => {
  assert.ok(validarSimulacao({ ...base, desconto: 50000 }).desconto);
});

test("validação: número inválido em qualquer campo vira erro", () => {
  const erros = validarSimulacao({ ...base, desconto: NaN, tarifas: NaN });
  assert.ok(erros.desconto);
  assert.ok(erros.tarifas);
});

test("parseDecimalBR aceita formatos brasileiros e rejeita texto", () => {
  assert.equal(parseDecimalBR("1.234,56"), 1234.56);
  assert.equal(parseDecimalBR("R$ 45000"), 45000);
  assert.equal(parseDecimalBR(""), 0);
  assert.ok(Number.isNaN(parseDecimalBR("abc")));
});

test("validação: entrada mais troca maior que o valor", () => {
  assert.ok(validarSimulacao({ ...base, entrada: 45000, troca: 10000 }).entrada);
});
